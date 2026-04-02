---
title: "Representation Topology Divergence: a Method for Comparing Neural Network Representations"
date: 2026-03-30
draft: false

authors:
  - "Serguei Barannikov"
  - "Ilya Trofimov"
  - "Nikita Balabin"
  - "Evgeny Burnaev"

year: 2022
venue: "ICML"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://proceedings.mlr.press/v162/barannikov22a/barannikov22a.pdf"
code: "https://github.com/IlyaTrofimov/RTD"

tags:
  - embedding-similarity
  - learning-dynamics

keywords:
  - topological data analysis
  - persistent homology
  - neural representations
  - RTD
  - R-cross-barcode

reading_status: "to-read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This paper introduces Representation Topology Divergence (RTD), a metric based on topological data analysis to compare neural representations. Unlike CKA or CCA-based methods, RTD captures multi-scale topological differences between embeddings. It operates on paired point clouds and uses persistent homology to quantify structural discrepancies. Empirically, RTD aligns well with prediction disagreement and outperforms prior similarity metrics."

abstract: "Comparison of data representations is a complex multi-aspect problem that has no complete solution yet. We propose a method for comparing two data representations. We introduce the Representation Topology Divergence (RTD) which measures the dissimilarity in multi-scale topology between two point clouds of equal size with a one-to-one correspondence between points. The data point clouds are allowed to lie in different ambient spaces. The RTD is one of the few practical methods based on Topological Data Analysis applicable to real machine learning datasets. Experiments show the proposed RTD agrees with the intuitive assessment of data representation similarity and is sensitive to its topological structure. We apply RTD to gain insights into neural network representations in computer vision and NLP domains for various problems: training dynamics analysis, data distribution shift, transfer learning, ensemble learning."

relevance: "Highly relevant for studying representation geometry beyond linear similarity metrics. RTD provides a fundamentally different lens (topology instead of correlation) to compare embedding spaces, which is useful for analyzing hidden states, training dynamics, and structural properties of representations."

related_topics:
  - persistent homology in ML
  - representation similarity metrics
  - geometry of embedding spaces
  - neural representation comparison

personal_note: "Interesting alternative to CKA that captures structure rather than alignment; potentially useful for analyzing curriculum effects on representation topology."
---

- Main claim:
  - Representation similarity should be evaluated through **topological structure**, not just linear/statistical alignment.
  - RTD captures meaningful differences missed by CKA/SVCCA and correlates strongly with model behavior (e.g., prediction disagreement). :contentReference[oaicite:0]{index=0}

- Method:
  - Treat representations as **point clouds with one-to-one correspondence**.
  - Build weighted graphs from pairwise distances.
  - Use **persistent homology (Vietoris–Rips complexes)** to analyze multi-scale topology.
  - Define **R-Cross-Barcode** to track topological discrepancies across scales.
  - RTD = **sum of persistence interval lengths** (mainly in H1). :contentReference[oaicite:1]{index=1}

- Useful for:
  - Comparing representations across:
    - training epochs (representation evolution)
    - architectures
    - layers
    - data shifts
    - transfer learning
  - Detecting **cluster structures, holes, and topology changes** (where CKA fails).
  - Measuring **ensemble diversity** and representation drift.
  - Situations where **geometry matters more than linear alignment**.

- Limits / caveats:
  - Computationally heavier than CKA (requires persistent homology).
  - Requires **one-to-one correspondence between samples**.
  - Sensitive to distance normalization choices.
  - Harder to interpret than scalar similarity metrics.
  - Primarily focuses on topology (may ignore fine-grained alignment).
