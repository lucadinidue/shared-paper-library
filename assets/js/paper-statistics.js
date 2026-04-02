(function () {
  async function init() {
    const app = document.querySelector("[data-paper-statistics-app]");
    if (!app) {
      return;
    }

    const jsonUrl = app.dataset.jsonUrl;
    if (!jsonUrl) {
      return;
    }

    try {
      const response = await fetch(jsonUrl, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (window.PaperLibraryGraph) {
        window.PaperLibraryGraph.render(
          app.querySelector("[data-paper-citation-graph]"),
          app.querySelector("[data-paper-citation-graph-detail]"),
          data,
        );
        window.PaperLibraryGraph.render(
          app.querySelector("[data-paper-graph]"),
          app.querySelector("[data-paper-graph-detail]"),
          data,
        );
      }
    } catch (error) {
      console.error("Paper statistics dataset could not be loaded.", error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
