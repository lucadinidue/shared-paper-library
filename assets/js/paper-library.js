(function () {
  async function init() {
    const app = document.querySelector("[data-paper-library-app]");
    if (!app) {
      return;
    }

    const cards = Array.from(app.querySelectorAll("[data-paper-card]"));
    const resultsLabel = app.querySelector("[data-paper-results]");
    const emptyState = app.querySelector("[data-paper-empty]");
    const list = app.querySelector("[data-paper-results-list]");
    const resetButton = app.querySelector("[data-paper-reset]");
    const controls = {
      query: app.querySelector('[data-paper-filter="query"]'),
      tag: app.querySelector('[data-paper-filter="tag"]'),
      status: app.querySelector('[data-paper-filter="status"]'),
      author: app.querySelector('[data-paper-filter="author"]'),
      year: app.querySelector('[data-paper-filter="year"]'),
      sort: app.querySelector('[data-paper-filter="sort"]'),
    };

    hydrateFromUrl(controls);
    applyFilters(cards, controls, resultsLabel, emptyState, list, false);

    Object.values(controls).forEach((control) => {
      if (!control) {
        return;
      }
      control.addEventListener("input", () => applyFilters(cards, controls, resultsLabel, emptyState, list, true));
      control.addEventListener("change", () => applyFilters(cards, controls, resultsLabel, emptyState, list, true));
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        controls.query.value = "";
        controls.tag.value = "";
        controls.status.value = "";
        controls.author.value = "";
        controls.year.value = "";
        controls.sort.value = "recent";
        applyFilters(cards, controls, resultsLabel, emptyState, list, true);
      });
    }
  }

  function applyFilters(cards, controls, resultsLabel, emptyState, list, updateUrl) {
    const query = normalize(controls.query?.value);
    const tag = normalize(controls.tag?.value);
    const status = normalize(controls.status?.value);
    const author = normalize(controls.author?.value);
    const year = normalize(controls.year?.value);
    const sort = controls.sort?.value || "recent";

    const visible = [];
    cards.forEach((card) => {
      const matches =
        (!query ||
          [
            card.dataset.title,
            card.dataset.authors,
            card.dataset.tags,
            card.dataset.venue,
            card.dataset.summary,
          ]
            .join(" ")
            .includes(query)) &&
        (!tag || (card.dataset.tags || "").includes(tag)) &&
        (!status || normalize(card.dataset.status) === status) &&
        (!author || (card.dataset.authors || "").includes(author)) &&
        (!year || normalize(card.dataset.year) === year);

      card.hidden = !matches;
      if (matches) {
        visible.push(card);
      }
    });

    sortCards(visible, sort);
    visible.forEach((card) => list.appendChild(card));

    if (resultsLabel) {
      resultsLabel.textContent = `${visible.length} paper${visible.length === 1 ? "" : "s"}`;
    }
    if (emptyState) {
      emptyState.hidden = visible.length > 0;
    }

    if (updateUrl) {
      const params = new URLSearchParams();
      if (query) params.set("q", controls.query.value.trim());
      if (tag) params.set("tag", controls.tag.value);
      if (status) params.set("status", controls.status.value);
      if (author) params.set("author", controls.author.value);
      if (year) params.set("year", controls.year.value);
      if (sort !== "recent") params.set("sort", sort);
      const queryString = params.toString();
      const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState({}, "", nextUrl);
    }
  }

  function sortCards(cards, sort) {
    const comparators = {
      recent: (a, b) =>
        numberValue(b.dataset.year) - numberValue(a.dataset.year) ||
        numberValue(a.dataset.priority) - numberValue(b.dataset.priority),
      priority: (a, b) =>
        numberValue(a.dataset.priority) - numberValue(b.dataset.priority) ||
        numberValue(b.dataset.year) - numberValue(a.dataset.year),
      title: (a, b) => (a.dataset.title || "").localeCompare(b.dataset.title || ""),
      author: (a, b) => (a.dataset.sortAuthor || "").localeCompare(b.dataset.sortAuthor || ""),
      "year-asc": (a, b) => numberValue(a.dataset.year) - numberValue(b.dataset.year),
    };
    const compare = comparators[sort] || comparators.recent;

    cards.sort(compare);
  }

  function hydrateFromUrl(controls) {
    const params = new URLSearchParams(window.location.search);
    if (controls.query && params.has("q")) controls.query.value = params.get("q");
    if (controls.tag && params.has("tag")) controls.tag.value = params.get("tag");
    if (controls.status && params.has("status")) controls.status.value = params.get("status");
    if (controls.author && params.has("author")) controls.author.value = params.get("author");
    if (controls.year && params.has("year")) controls.year.value = params.get("year");
    if (controls.sort && params.has("sort")) controls.sort.value = params.get("sort");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function numberValue(value) {
    return Number.parseInt(value || "0", 10) || 0;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
