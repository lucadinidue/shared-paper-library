#!/usr/bin/env python3
"""Build citation graph data for the paper library.

The pipeline scans every paper folder under ``content/paper-library``,
extracts the canonical title from ``index.md``, reads optional
``citations.json`` files, resolves cited references against the internal
paper index, and writes global JSON files under ``data/paper-library``.
"""

from __future__ import annotations

import json
import re
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "paper-library"
DATA_DIR = ROOT / "data" / "paper-library"
ALIASES_PATH = DATA_DIR / "citation_aliases.json"
PAPER_INDEX_PATH = DATA_DIR / "paper_index.json"
CITATION_MATCHES_PATH = DATA_DIR / "citation_matches.json"
CITATION_EDGES_PATH = DATA_DIR / "citation_edges.json"
CITATION_UNRESOLVED_PATH = DATA_DIR / "citation_unresolved.json"
SUMMARY_PATH = DATA_DIR / "citation_summary.json"

FRONT_MATTER_BOUNDARY = re.compile(r"^---\s*$")
SCALAR_LINE = re.compile(r"^([A-Za-z0-9_-]+):\s*(.*)$")
YEAR_RE = re.compile(r"\b(19|20)\d{2}\b")


@dataclass(frozen=True)
class PaperRecord:
    paper_id: str
    title: str
    title_normalized: str
    path: str
    year: int | None


def normalize_title(value: str | None) -> str:
    if not value:
        return ""

    text = unicodedata.normalize("NFKC", value).lower()
    text = re.sub(r"[-‐‑‒–—―/|_+]+", " ", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_scalar(value: str) -> str | None:
    raw = value.strip()
    if not raw:
        return ""
    if raw in {"null", "~"}:
        return None
    if raw in {"true", "false"}:
        return raw
    if (raw.startswith('"') and raw.endswith('"')) or (raw.startswith("'") and raw.endswith("'")):
        return raw[1:-1]
    return raw


def extract_front_matter(markdown_path: Path) -> dict[str, str | None]:
    lines = markdown_path.read_text(encoding="utf-8").splitlines()
    if not lines or not FRONT_MATTER_BOUNDARY.match(lines[0]):
        return {}

    data: dict[str, str | None] = {}
    for line in lines[1:]:
        if FRONT_MATTER_BOUNDARY.match(line):
            break
        match = SCALAR_LINE.match(line)
        if not match:
            continue
        key, value = match.groups()
        parsed = parse_scalar(value)
        if parsed is not None:
            data[key] = parsed
    return data


def parse_year(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)

    text = str(value).strip()
    if not text:
        return None

    match = YEAR_RE.search(text)
    if not match:
        return None
    return int(match.group(0))


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except json.JSONDecodeError as error:
        raise ValueError(f"Invalid JSON in {path}: {error}") from error


def ensure_aliases_file() -> dict[str, str]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not ALIASES_PATH.exists():
        ALIASES_PATH.write_text("{}\n", encoding="utf-8")
        return {}

    aliases = load_json(ALIASES_PATH, {})
    if not isinstance(aliases, dict):
        raise ValueError(f"{ALIASES_PATH} must contain a JSON object.")

    normalized_aliases: dict[str, str] = {}
    for key, value in aliases.items():
        normalized_key = normalize_title(str(key))
        if normalized_key:
            normalized_aliases[normalized_key] = str(value).strip()
    return normalized_aliases


def iter_paper_dirs() -> list[Path]:
    if not CONTENT_DIR.exists():
        return []
    return sorted(
        [
            path
            for path in CONTENT_DIR.iterdir()
            if path.is_dir() and path.name != "statistics" and (path / "index.md").exists()
        ],
        key=lambda item: item.name.lower(),
    )


def build_paper_index() -> tuple[list[dict[str, Any]], dict[str, PaperRecord], dict[str, list[PaperRecord]]]:
    papers: list[dict[str, Any]] = []
    by_id: dict[str, PaperRecord] = {}
    by_title_normalized: dict[str, list[PaperRecord]] = {}

    for paper_dir in iter_paper_dirs():
        front_matter = extract_front_matter(paper_dir / "index.md")
        title = (front_matter.get("title") or "").strip() if isinstance(front_matter.get("title"), str) else ""
        paper_id = paper_dir.name
        normalized = normalize_title(title)
        record = PaperRecord(
            paper_id=paper_id,
            title=title,
            title_normalized=normalized,
            path=str((paper_dir / "index.md").relative_to(ROOT)),
            year=parse_year(front_matter.get("year")),
        )
        papers.append(
            {
                "paper_id": record.paper_id,
                "title": record.title,
                "title_normalized": record.title_normalized,
                "year": record.year,
                "path": record.path,
            }
        )
        by_id[record.paper_id] = record
        by_title_normalized.setdefault(record.title_normalized, []).append(record)

    papers.sort(key=lambda item: item["paper_id"])
    return papers, by_id, by_title_normalized


def safe_string(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def similarity_scores(reference_title: str, candidate_title: str) -> tuple[float, float, float]:
    base_ratio = SequenceMatcher(None, reference_title, candidate_title).ratio()

    ref_tokens = reference_title.split()
    candidate_tokens = candidate_title.split()
    token_ratio = SequenceMatcher(None, " ".join(sorted(ref_tokens)), " ".join(sorted(candidate_tokens))).ratio()

    ref_set = set(ref_tokens)
    candidate_set = set(candidate_tokens)
    if not ref_set and not candidate_set:
        token_overlap = 1.0
    else:
        token_overlap = len(ref_set & candidate_set) / max(len(ref_set | candidate_set), 1)

    return base_ratio, token_ratio, token_overlap


def score_candidate(reference_normalized: str, reference_year: int | None, paper: PaperRecord) -> float:
    base_ratio, token_ratio, token_overlap = similarity_scores(reference_normalized, paper.title_normalized)
    score = max(base_ratio, token_ratio) * 100
    score += token_overlap * 12

    if reference_year is not None and paper.year is not None:
        if reference_year == paper.year:
            score += 4
        else:
            score -= min(abs(reference_year - paper.year) * 2, 10)

    return round(min(score, 100.0), 2)


def build_candidate_preview(candidates: list[tuple[PaperRecord, float]], limit: int = 3) -> list[dict[str, Any]]:
    preview = []
    for paper, score in candidates[:limit]:
        preview.append(
            {
                "paper_id": paper.paper_id,
                "title": paper.title,
                "year": paper.year,
                "score": score,
            }
        )
    return preview


def resolve_reference(
    source_paper: str,
    reference: dict[str, Any],
    aliases: dict[str, str],
    papers_by_id: dict[str, PaperRecord],
    papers_by_title: dict[str, list[PaperRecord]],
) -> dict[str, Any]:
    reference_title = safe_string(reference.get("title"))
    reference_normalized = normalize_title(reference_title)
    reference_year = parse_year(reference.get("year"))

    base_record = {
        "source_paper": source_paper,
        "reference_title": reference_title,
        "reference_title_normalized": reference_normalized,
        "reference_year": reference_year,
        "matched_paper": None,
        "match_type": None,
        "score": 0,
        "status": "unresolved",
    }

    if not reference_title or not reference_normalized:
        base_record["reason"] = "missing_reference_title"
        return base_record

    alias_target = aliases.get(reference_normalized)
    if alias_target:
        paper = papers_by_id.get(alias_target)
        if paper is not None:
            base_record.update(
                {
                    "matched_paper": paper.paper_id,
                    "match_type": "alias",
                    "score": 100,
                    "status": "resolved",
                }
            )
            return base_record

        base_record["reason"] = "alias_points_to_missing_paper"
        return base_record

    exact_candidates = papers_by_title.get(reference_normalized, [])
    if len(exact_candidates) == 1:
        paper = exact_candidates[0]
        score = 100
        if reference_year is not None and paper.year is not None and reference_year != paper.year:
            score = 92
        base_record.update(
            {
                "matched_paper": paper.paper_id,
                "match_type": "exact",
                "score": score,
                "status": "resolved",
            }
        )
        return base_record

    if len(exact_candidates) > 1:
        ranked_exact = sorted(
            [(paper, score_candidate(reference_normalized, reference_year, paper)) for paper in exact_candidates],
            key=lambda item: item[1],
            reverse=True,
        )
        best_paper, best_score = ranked_exact[0]
        next_score = ranked_exact[1][1] if len(ranked_exact) > 1 else 0
        if best_score >= 96 and best_score - next_score >= 4:
            base_record.update(
                {
                    "matched_paper": best_paper.paper_id,
                    "match_type": "exact-year-supported",
                    "score": best_score,
                    "status": "resolved",
                }
            )
            return base_record

        base_record.update(
            {
                "match_type": "exact",
                "score": best_score,
                "status": "ambiguous",
                "reason": "multiple_internal_papers_share_normalized_title",
                "candidate_matches": build_candidate_preview(ranked_exact),
            }
        )
        return base_record

    ranked_candidates = sorted(
        [(paper, score_candidate(reference_normalized, reference_year, paper)) for paper in papers_by_id.values()],
        key=lambda item: item[1],
        reverse=True,
    )
    best_paper, best_score = ranked_candidates[0]
    second_score = ranked_candidates[1][1] if len(ranked_candidates) > 1 else 0
    margin = best_score - second_score

    if best_score >= 93 and margin >= 4:
        base_record.update(
            {
                "matched_paper": best_paper.paper_id,
                "match_type": "fuzzy",
                "score": best_score,
                "status": "resolved",
            }
        )
        return base_record

    if best_score >= 84:
        base_record.update(
            {
                "match_type": "fuzzy",
                "score": best_score,
                "status": "ambiguous",
                "reason": "fuzzy_match_needs_review",
                "candidate_matches": build_candidate_preview(ranked_candidates),
            }
        )
        return base_record

    base_record.update(
        {
            "match_type": "fuzzy",
            "score": best_score,
            "status": "unresolved",
            "reason": "no_confident_internal_match",
            "candidate_matches": build_candidate_preview(ranked_candidates),
        }
    )
    return base_record


def unique_edges(matches: list[dict[str, Any]]) -> list[dict[str, str]]:
    seen: set[tuple[str, str]] = set()
    edges: list[dict[str, str]] = []
    for match in matches:
        if match.get("status") != "resolved":
            continue
        source = safe_string(match.get("source_paper"))
        target = safe_string(match.get("matched_paper"))
        if not source or not target:
            continue
        pair = (source, target)
        if pair in seen:
            continue
        seen.add(pair)
        edges.append({"source": source, "target": target})
    edges.sort(key=lambda item: (item["source"], item["target"]))
    return edges


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def main() -> int:
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    aliases = ensure_aliases_file()
    paper_index, papers_by_id, papers_by_title = build_paper_index()

    matches: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    missing_citations_files: list[str] = []
    invalid_citations_files: list[dict[str, str]] = []

    for paper in paper_index:
        paper_id = paper["paper_id"]
        citations_path = CONTENT_DIR / paper_id / "citations.json"
        if not citations_path.exists():
            missing_citations_files.append(paper_id)
            continue

        try:
            citations_data = load_json(citations_path, {})
        except ValueError as error:
            invalid_citations_files.append({"paper_id": paper_id, "error": str(error)})
            continue

        references = citations_data.get("references", [])
        if not isinstance(references, list):
            invalid_citations_files.append(
                {
                    "paper_id": paper_id,
                    "error": f"{citations_path.relative_to(ROOT)} must contain a 'references' array.",
                }
            )
            continue

        for index, reference in enumerate(references):
            if not isinstance(reference, dict):
                resolved = {
                    "source_paper": paper_id,
                    "reference_title": "",
                    "reference_title_normalized": "",
                    "reference_year": None,
                    "matched_paper": None,
                    "match_type": None,
                    "score": 0,
                    "status": "unresolved",
                    "reason": "reference_entry_is_not_an_object",
                    "reference_index": index,
                }
            else:
                resolved = resolve_reference(paper_id, reference, aliases, papers_by_id, papers_by_title)
                resolved["reference_index"] = index

            matches.append(resolved)
            if resolved["status"] != "resolved":
                unresolved.append(resolved)

    edges = unique_edges(matches)

    paper_index_payload = {
        "generated_at": generated_at,
        "paper_count": len(paper_index),
        "papers": paper_index,
    }
    summary_payload = {
        "generated_at": generated_at,
        "match_count": len(matches),
        "resolved_count": sum(1 for item in matches if item["status"] == "resolved"),
        "ambiguous_count": sum(1 for item in matches if item["status"] == "ambiguous"),
        "unresolved_count": sum(1 for item in matches if item["status"] == "unresolved"),
        "edge_count": len(edges),
        "papers_missing_citations_file": missing_citations_files,
        "invalid_citations_files": invalid_citations_files,
    }

    write_json(PAPER_INDEX_PATH, paper_index_payload)
    write_json(CITATION_MATCHES_PATH, matches)
    write_json(CITATION_EDGES_PATH, edges)
    write_json(CITATION_UNRESOLVED_PATH, unresolved)
    write_json(SUMMARY_PATH, summary_payload)

    print(
        "Built paper-library citation data:",
        f"{len(paper_index)} papers,",
        f"{len(matches)} references processed,",
        f"{len(edges)} internal edges,",
        f"{len(unresolved)} unresolved or ambiguous references.",
    )
    if missing_citations_files:
        print(f"Papers without citations.json: {len(missing_citations_files)}")
    if invalid_citations_files:
        print(f"Invalid citations.json files: {len(invalid_citations_files)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
