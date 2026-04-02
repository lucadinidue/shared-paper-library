(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const GRAPH_STATE = new WeakMap();

  const GRAPH_VARIANTS = {
    author: {
      name: "author",
      emptyTitle: "Author graph",
      emptySubtitle: "Hover or select a node or an edge to inspect local collaborations.",
      emptyMessage: "No author data available yet.",
      ariaLabel: "Author collaboration graph",
      fallbackTooltip: "Author graph",
      edgeStroke: "rgba(140, 181, 200, 0.35)",
      edgeStrokeActive: "rgba(185, 232, 214, 0.98)",
      edgeStrokeContext: "rgba(154, 191, 213, 0.72)",
      detailEmptyListMessage: "No shared paper metadata available.",
      chargeStrengthExpanded: 1800,
      chargeStrengthCompact: 1150,
      centerStrengthExpanded: 0.0015,
      centerStrengthCompact: 0.0022,
      collisionPaddingExpanded: 14,
      collisionPaddingCompact: 10,
      linkForceExpanded: 1,
      linkForceCompact: 1,
      collisionForceExpanded: 1,
      collisionForceCompact: 1,
      chargeForceExpanded: 1,
      chargeForceCompact: 1,
      velocityDecay: 0.78,
      alphaDecay: 0.032,
      dragAlphaStart: 0.22,
      dragAlphaMove: 0.18,
      dragAlphaRelease: 0.15,
      linkDistanceExpanded(link) {
        return 82 + (6 - Math.min(link.weight, 5)) * 19;
      },
      linkDistanceCompact(link) {
        return 70 + (6 - Math.min(link.weight, 5)) * 16;
      },
      buildGraph(data, size) {
        if (!Array.isArray(data?.authors) || !Array.isArray(data?.authorLinks)) {
          return null;
        }

        const nodes = data.authors.map((author, index) => ({
          ...author,
          index,
          name: author.name,
          shortLabel: author.name,
          fullTitle: author.name,
          metricValue: Number(author.papers) || 1,
          degree: 0,
          x: size.centerX + Math.cos(index * 0.9) * 18,
          y: size.centerY + Math.sin(index * 0.9) * 18,
          vx: 0,
          vy: 0,
          fx: null,
          fy: null,
          r: 0,
          labelWeight: "secondary",
        }));

        const byId = new Map(nodes.map((node) => [node.id, node]));
        const links = data.authorLinks
          .map((link, index) => {
            const source = byId.get(link.source);
            const target = byId.get(link.target);
            if (!source || !target) {
              return null;
            }

            source.degree += Number(link.weight) || 1;
            target.degree += Number(link.weight) || 1;

            return {
              ...link,
              index,
              sourceNode: source,
              targetNode: target,
              sourceName: source.name,
              targetName: target.name,
              weight: Math.max(Number(link.weight) || 1, 1),
              papers: Array.isArray(link.papers) ? link.papers : [],
              strokeWidth: 1,
              opacity: 0.2,
            };
          })
          .filter(Boolean);

        nodes.forEach((node) => {
          node.colorValue = node.metricValue + node.degree * 0.55;
          node.importance = node.metricValue * 0.75 + node.degree;
        });

        return { nodes, links, byId };
      },
      buildScales(nodes, links, expanded) {
        const minMetric = Math.min(...nodes.map((node) => node.metricValue));
        const maxMetric = Math.max(...nodes.map((node) => node.metricValue));
        const minColor = Math.min(...nodes.map((node) => node.colorValue));
        const maxColor = Math.max(...nodes.map((node) => node.colorValue));
        const minWeight = Math.min(...links.map((link) => link.weight), 1);
        const maxWeight = Math.max(...links.map((link) => link.weight), 1);
        const orderedImportance = [...nodes.map((node) => node.importance)].sort((a, b) => b - a);
        const labelIndex = Math.min(Math.max(Math.ceil(nodes.length * 0.35), 4), orderedImportance.length) - 1;
        const labelThreshold = orderedImportance[Math.max(labelIndex, 0)] || 0;
        const minRadius = expanded ? 11 : 9;
        const maxRadius = expanded ? 28 : 22;

        return {
          radius(value) {
            return interpolate(value, minMetric, maxMetric, minRadius, maxRadius, true);
          },
          nodeColor(value) {
            return mixColors([48, 71, 100], [112, 145, 170], normalize(value, minColor, maxColor));
          },
          haloColor(value) {
            return mixColors([88, 114, 141], [146, 178, 194], normalize(value, minColor, maxColor));
          },
          nodeStroke(value) {
            return mixColors([180, 195, 210], [214, 224, 232], normalize(value, minColor, maxColor));
          },
          linkWidth(value) {
            return interpolate(value, minWeight, maxWeight, 1.05, expanded ? 3.2 : 2.8);
          },
          linkOpacity(value) {
            return interpolate(value, minWeight, maxWeight, 0.16, 0.42);
          },
          labelThreshold,
        };
      },
      nodeAriaLabel(node) {
        return `${node.name}, ${node.metricValue} papers`;
      },
      nodeDetail(state, node) {
        const connected = state.graph.links.filter((link) => link.source === node.id || link.target === node.id);
        const sharedPapers = new Set();
        connected.forEach((link) => {
          link.papers.forEach((paper) => sharedPapers.add(paper));
        });

        return {
          title: node.name,
          subtitle: `${node.metricValue} paper${node.metricValue > 1 ? "s" : ""} in the library, ${connected.length} collaboration${connected.length === 1 ? "" : "s"}`,
          papers: Array.from(sharedPapers),
        };
      },
      linkDetail(link) {
        return {
          title: `${link.sourceName} + ${link.targetName}`,
          subtitle: `${link.weight} shared collaboration${link.weight > 1 ? "s" : ""}`,
          papers: link.papers,
        };
      },
    },
    citation: {
      name: "citation",
      emptyTitle: "Citation graph",
      emptySubtitle: "Directed citation links between papers in the library.",
      emptyMessage: "No citation links available yet.",
      ariaLabel: "Paper citation graph",
      fallbackTooltip: "Citation graph",
      edgeStroke: "rgba(172, 209, 149, 0.62)",
      edgeStrokeActive: "rgba(224, 249, 191, 0.98)",
      edgeStrokeContext: "rgba(200, 229, 165, 0.86)",
      edgeMarkerFill: "rgba(180, 217, 155, 0.96)",
      edgeMarkerFillActive: "rgba(224, 249, 191, 0.98)",
      edgeMarkerFillContext: "rgba(200, 229, 165, 0.92)",
      detailEmptyListMessage: "No citation metadata available.",
      chargeStrengthExpanded: 2050,
      chargeStrengthCompact: 1250,
      centerStrengthExpanded: 0.001,
      centerStrengthCompact: 0.00135,
      collisionPaddingExpanded: 24,
      collisionPaddingCompact: 18,
      linkForceExpanded: 0.62,
      linkForceCompact: 0.58,
      collisionForceExpanded: 1.18,
      collisionForceCompact: 1.12,
      chargeForceExpanded: 1.16,
      chargeForceCompact: 1.1,
      velocityDecay: 0.86,
      alphaDecay: 0.026,
      dragAlphaStart: 0.16,
      dragAlphaMove: 0.12,
      dragAlphaRelease: 0.08,
      linkDistanceExpanded(link) {
        return 174 - Math.min(link.weight, 3) * 8;
      },
      linkDistanceCompact(link) {
        return 142 - Math.min(link.weight, 3) * 7;
      },
      buildGraph(data, size) {
        const citationData = data?.citationGraph;
        if (!citationData || !Array.isArray(citationData.edges) || !Array.isArray(citationData.nodes)) {
          return null;
        }

        const linkedIds = new Set();
        citationData.edges.forEach((edge) => {
          if (edge?.source) {
            linkedIds.add(edge.source);
          }
          if (edge?.target) {
            linkedIds.add(edge.target);
          }
        });

        const catalog = new Map(
          citationData.nodes.map((paper) => [
            paper.paper_id,
            {
              ...paper,
              shortLabel: abbreviatePaperTitle(paper.title),
            },
          ]),
        );

        const nodes = Array.from(linkedIds)
          .map((paperId, index) => {
            const paper = catalog.get(paperId);
            if (!paper) {
              return null;
            }

            return {
              index,
              id: paper.paper_id,
              paperId: paper.paper_id,
              name: paper.title,
              fullTitle: paper.title,
              shortLabel: paper.shortLabel,
              url: paper.url || "",
              year: paper.year || "",
              metricValue: 1,
              degree: 0,
              inDegree: 0,
              outDegree: 0,
              x: size.centerX + Math.cos(index * 0.95) * 18,
              y: size.centerY + Math.sin(index * 0.95) * 18,
              vx: 0,
              vy: 0,
              fx: null,
              fy: null,
              r: 0,
              labelWeight: "secondary",
            };
          })
          .filter(Boolean);

        const byId = new Map(nodes.map((node) => [node.id, node]));
        const links = citationData.edges
          .map((edge, index) => {
            const source = byId.get(edge.source);
            const target = byId.get(edge.target);
            if (!source || !target) {
              return null;
            }

            source.outDegree += 1;
            source.degree += 1;
            target.inDegree += 1;
            target.degree += 1;

            return {
              index,
              source: source.id,
              target: target.id,
              sourceNode: source,
              targetNode: target,
              sourceName: source.name,
              targetName: target.name,
              weight: 1,
              papers: [target.name],
              strokeWidth: 1,
              opacity: 0.28,
            };
          })
          .filter(Boolean);

        nodes.forEach((node) => {
          node.metricValue = Math.max(node.inDegree + node.outDegree, 1);
          node.colorValue = node.inDegree * 1.15 + node.outDegree * 0.85 + node.metricValue;
          node.importance = node.inDegree * 1.4 + node.outDegree + node.metricValue * 0.35;
        });

        return { nodes, links, byId };
      },
      buildScales(nodes, links, expanded) {
        const minMetric = Math.min(...nodes.map((node) => node.metricValue));
        const maxMetric = Math.max(...nodes.map((node) => node.metricValue));
        const minColor = Math.min(...nodes.map((node) => node.colorValue));
        const maxColor = Math.max(...nodes.map((node) => node.colorValue));
        const minWeight = Math.min(...links.map((link) => link.weight), 1);
        const maxWeight = Math.max(...links.map((link) => link.weight), 1);
        const orderedImportance = [...nodes.map((node) => node.importance)].sort((a, b) => b - a);
        const labelIndex = Math.min(Math.max(Math.ceil(nodes.length * 0.55), 4), orderedImportance.length) - 1;
        const labelThreshold = orderedImportance[Math.max(labelIndex, 0)] || 0;
        const minRadius = expanded ? 12 : 10;
        const maxRadius = expanded ? 24 : 20;

        return {
          radius(value) {
            return interpolate(value, minMetric, maxMetric, minRadius, maxRadius, true);
          },
          nodeColor(value) {
            return mixColors([58, 87, 61], [125, 165, 102], normalize(value, minColor, maxColor));
          },
          haloColor(value) {
            return mixColors([86, 121, 73], [164, 205, 126], normalize(value, minColor, maxColor));
          },
          nodeStroke(value) {
            return mixColors([187, 210, 176], [224, 238, 202], normalize(value, minColor, maxColor));
          },
          linkWidth(value) {
            return interpolate(value, minWeight, maxWeight, 1.7, expanded ? 3.1 : 2.7);
          },
          linkOpacity(value) {
            return interpolate(value, minWeight, maxWeight, 0.68, 0.88);
          },
          labelThreshold,
        };
      },
      nodeAriaLabel(node) {
        return `${node.name}, ${node.inDegree} incoming citation${node.inDegree === 1 ? "" : "s"}, ${node.outDegree} outgoing citation${node.outDegree === 1 ? "" : "s"}`;
      },
      nodeDetail(state, node) {
        const outgoing = state.graph.links.filter((link) => link.source === node.id);
        const incoming = state.graph.links.filter((link) => link.target === node.id);
        const citedPapers = outgoing.map((link) => `Cites: ${link.targetName}`);
        const citingPapers = incoming.map((link) => `Cited by: ${link.sourceName}`);

        return {
          title: node.fullTitle,
          subtitle: `${node.outDegree} outgoing citation${node.outDegree === 1 ? "" : "s"}, ${node.inDegree} incoming citation${node.inDegree === 1 ? "" : "s"}`,
          papers: [...citedPapers, ...citingPapers],
        };
      },
      linkDetail(link) {
        return {
          title: `${link.sourceName} -> ${link.targetName}`,
          subtitle: "Directed internal citation",
          papers: [link.targetName],
        };
      },
    },
  };

  function render(container, detail, data) {
    const variant = resolveVariant(container);
    const emptyDetail = {
      title: variant.emptyTitle,
      subtitle: variant.emptySubtitle,
      papers: null,
    };

    if (!container || !data) {
      return;
    }

    cleanup(container);
    container.dataset.graphKind = variant.name;
    if (detail) {
      detail.dataset.graphKind = variant.name;
    }

    const expanded = container.dataset.graphSize === "expanded";
    const size = resolveSize(container, expanded);
    const graph = variant.buildGraph(data, size, expanded);
    if (!graph || !graph.nodes.length || !graph.links.length) {
      container.innerHTML = `<p class="paper-graph__empty">${escapeHtml(variant.emptyMessage)}</p>`;
      if (detail) {
        setDetail(detail, emptyDetail.title, emptyDetail.subtitle, emptyDetail.papers, variant);
      }
      return;
    }

    const scales = variant.buildScales(graph.nodes, graph.links, expanded);
    const scene = setupSvg(container, size, expanded, variant);
    const state = {
      container,
      detail,
      data,
      variant,
      emptyDetail,
      expanded,
      size,
      graph,
      scales,
      scene,
      selected: null,
      hovered: null,
      resizeFrame: null,
      frame: null,
      observer: null,
    };

    graph.nodes.forEach((node) => {
      node.r = scales.radius(node.metricValue);
      node.fill = scales.nodeColor(node.colorValue);
      node.haloColor = scales.haloColor(node.colorValue);
      node.stroke = scales.nodeStroke(node.colorValue);
      node.labelWeight = node.importance >= scales.labelThreshold ? "primary" : "secondary";
    });

    graph.links.forEach((link) => {
      link.strokeWidth = scales.linkWidth(link.weight);
      link.opacity = scales.linkOpacity(link.weight);
    });

    renderLinks(state);
    renderNodes(state);
    bindInteractions(state);
    updateDetail(state, emptyDetail, false);
    resetState(state, false);
    startSimulation(state);
    installResizeHandling(state);

    GRAPH_STATE.set(container, state);
  }

  function resolveVariant(container) {
    const kind = container?.dataset?.graphKind === "citation" ? "citation" : "author";
    return GRAPH_VARIANTS[kind];
  }

  function cleanup(container) {
    const existing = GRAPH_STATE.get(container);
    if (!existing) {
      return;
    }

    if (existing.frame) {
      cancelAnimationFrame(existing.frame);
    }

    if (existing.resizeFrame) {
      cancelAnimationFrame(existing.resizeFrame);
    }

    if (existing.observer) {
      existing.observer.disconnect();
    }

    GRAPH_STATE.delete(container);
  }

  function resolveSize(container, expanded) {
    const bounds = container.getBoundingClientRect();
    const fallbackWidth = expanded ? 1240 : 920;
    const width = Math.max(Math.round(bounds.width || fallbackWidth), expanded ? 720 : 320);
    const heightRatio = expanded ? 0.64 : 0.68;
    const minHeight = expanded ? 620 : 380;
    const height = Math.max(Math.round(width * heightRatio), minHeight);
    return {
      width,
      height,
      centerX: width / 2,
      centerY: height / 2,
      padding: expanded ? 40 : 28,
    };
  }

  function setupSvg(container, size, expanded, variant) {
    container.innerHTML = "";
    container.style.position = "relative";

    const svg = createSvg("svg", {
      class: "paper-graph__svg",
      viewBox: `0 0 ${size.width} ${size.height}`,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": variant.ariaLabel,
    });

    const defs = createSvg("defs");
    const shadowId = `paper-graph-shadow-${variant.name}`;
    defs.appendChild(
      createSvg("filter", { id: shadowId, x: "-30%", y: "-30%", width: "160%", height: "160%" }, [
        createSvg("feDropShadow", {
          dx: "0",
          dy: expanded ? "8" : "6",
          stdDeviation: expanded ? "7" : "5",
          "flood-color": "#081017",
          "flood-opacity": "0.22",
        }),
      ]),
    );

    if (variant.name === "citation") {
      defs.appendChild(createCitationMarker(`${variant.name}-default`, variant.edgeMarkerFill));
      defs.appendChild(createCitationMarker(`${variant.name}-context`, variant.edgeMarkerFillContext));
      defs.appendChild(createCitationMarker(`${variant.name}-active`, variant.edgeMarkerFillActive));
    }

    svg.appendChild(defs);

    const backdrop = createSvg("rect", {
      x: "0",
      y: "0",
      width: String(size.width),
      height: String(size.height),
      fill: "transparent",
      class: "paper-graph__backdrop",
    });
    svg.appendChild(backdrop);

    const edgeGroup = createSvg("g", { class: "paper-graph__edges" });
    const nodeGroup = createSvg("g", { class: "paper-graph__nodes" });
    svg.appendChild(edgeGroup);
    svg.appendChild(nodeGroup);

    const tooltip = document.createElement("div");
    tooltip.className = "paper-graph__tooltip";
    Object.assign(tooltip.style, {
      position: "absolute",
      left: "0",
      top: "0",
      maxWidth: expanded ? "20rem" : "15rem",
      padding: expanded ? "0.6rem 0.75rem" : "0.5rem 0.65rem",
      borderRadius: "0.85rem",
      background: "rgba(8, 16, 23, 0.92)",
      color: "#f8fafc",
      boxShadow: "0 18px 36px rgba(8, 16, 23, 0.22)",
      border: "1px solid rgba(190, 204, 220, 0.18)",
      pointerEvents: "none",
      opacity: "0",
      transform: "translate3d(0, 0, 0)",
      transition: "opacity 160ms ease",
      fontSize: expanded ? "0.88rem" : "0.81rem",
      lineHeight: "1.35",
      zIndex: "2",
    });

    container.appendChild(svg);
    container.appendChild(tooltip);

    return {
      svg,
      edgeGroup,
      nodeGroup,
      tooltip,
      backdrop,
      width: size.width,
      height: size.height,
      shadowId,
      markerIds:
        variant.name === "citation"
          ? {
              default: `paper-graph-arrow-${variant.name}-default`,
              context: `paper-graph-arrow-${variant.name}-context`,
              active: `paper-graph-arrow-${variant.name}-active`,
            }
          : null,
    };
  }

  function renderLinks(state) {
    const { scene, graph, variant } = state;
    const linkElements = [];

    graph.links.forEach((link) => {
      const path = createSvg("path", {
        class: "paper-graph__edge",
        fill: "none",
        stroke: variant.edgeStroke,
        "stroke-linecap": "round",
        "stroke-width": String(link.strokeWidth),
        opacity: String(link.opacity),
      });

      if (variant.name === "citation") {
        path.setAttribute("marker-end", `url(#${scene.markerIds.default})`);
      }

      path.dataset.source = link.source;
      path.dataset.target = link.target;
      scene.edgeGroup.appendChild(path);

      link.element = path;
      linkElements.push(path);
    });

    state.edgeElements = linkElements;
  }

  function renderNodes(state) {
    const { scene, graph, expanded } = state;
    const nodeElements = [];

    graph.nodes.forEach((node) => {
      const group = createSvg("g", {
        class: "paper-graph__node",
        tabindex: "0",
        role: "button",
        "aria-label": state.variant.nodeAriaLabel(node),
      });
      group.dataset.nodeId = node.id;

      const halo = createSvg("circle", {
        class: "paper-graph__node-halo",
        r: String(node.r + (expanded ? 8 : 6)),
        fill: node.haloColor,
        opacity: "0",
      });
      halo.style.fill = node.haloColor;

      const circle = createSvg("circle", {
        class: "paper-graph__node-circle",
        r: String(node.r),
        fill: node.fill,
        stroke: node.stroke,
        "stroke-width": expanded ? "1.8" : "1.5",
        filter: `url(#${scene.shadowId})`,
      });
      circle.style.fill = node.fill;
      circle.style.stroke = node.stroke;
      circle.style.transition = "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease, opacity 180ms ease";

      const label = createSvg("text", {
        class: "paper-graph__label",
        "text-anchor": "middle",
        fill: "rgba(226, 233, 240, 0.78)",
        "font-size": expanded ? "12.5" : "11.5",
      });
      label.textContent = node.shortLabel;

      const labelBack = createSvg("rect", {
        class: "paper-graph__label-back",
        rx: expanded ? "9" : "8",
        ry: expanded ? "9" : "8",
        fill: "rgba(7, 13, 18, 0.68)",
        opacity: node.labelWeight === "primary" ? "0.82" : "0",
      });

      group.appendChild(halo);
      group.appendChild(circle);
      group.appendChild(labelBack);
      group.appendChild(label);
      scene.nodeGroup.appendChild(group);

      node.element = group;
      node.circle = circle;
      node.halo = halo;
      node.label = label;
      node.labelBack = labelBack;
      nodeElements.push(group);
    });

    state.nodeElements = nodeElements;
  }

  function bindInteractions(state) {
    const { scene, graph, variant } = state;

    scene.backdrop.addEventListener("click", () => {
      state.selected = null;
      resetState(state, true);
    });

    scene.svg.addEventListener("mouseleave", () => {
      state.hovered = null;
      applyStateClasses(state);
      hideTooltip(scene.tooltip);
      if (!state.selected) {
        updateDetail(state, state.emptyDetail, false);
      }
    });

    graph.links.forEach((link) => {
      const element = link.element;
      element.style.cursor = "pointer";

      element.addEventListener("mouseenter", (event) => {
        state.hovered = { type: "link", id: link.index };
        applyStateClasses(state);
        showTooltip(state, event, variant.linkDetail(link));
        if (!state.selected) {
          updateDetail(state, variant.linkDetail(link), false);
        }
      });

      element.addEventListener("mousemove", (event) => {
        showTooltip(state, event, variant.linkDetail(link));
      });

      element.addEventListener("mouseleave", () => {
        state.hovered = null;
        applyStateClasses(state);
        hideTooltip(scene.tooltip);
        if (!state.selected) {
          updateDetail(state, state.emptyDetail, false);
        }
      });

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        state.selected = { type: "link", id: link.index };
        updateDetail(state, variant.linkDetail(link), true);
        applyStateClasses(state);
      });
    });

    graph.nodes.forEach((node) => {
      const group = node.element;
      const onEnter = (event) => {
        state.hovered = { type: "node", id: node.id };
        applyStateClasses(state);
        showTooltip(state, event, variant.nodeDetail(state, node));
        if (!state.selected) {
          updateDetail(state, variant.nodeDetail(state, node), false);
        }
      };

      group.addEventListener("mouseenter", onEnter);
      group.addEventListener("focus", onEnter);

      group.addEventListener("mousemove", (event) => {
        showTooltip(state, event, variant.nodeDetail(state, node));
      });

      group.addEventListener("mouseleave", () => {
        state.hovered = null;
        applyStateClasses(state);
        hideTooltip(scene.tooltip);
        if (!state.selected) {
          updateDetail(state, state.emptyDetail, false);
        }
      });

      group.addEventListener("blur", () => {
        state.hovered = null;
        applyStateClasses(state);
      });

      group.addEventListener("click", (event) => {
        event.stopPropagation();
        state.selected = { type: "node", id: node.id };
        updateDetail(state, variant.nodeDetail(state, node), true);
        applyStateClasses(state);
      });

      bindDrag(state, node);
    });
  }

  function bindDrag(state, node) {
    const { svg } = state.scene;
    const { variant } = state;
    let pointerId = null;

    node.element.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      pointerId = event.pointerId;
      node.element.setPointerCapture(pointerId);
      const point = projectPointer(svg, event);
      node.fx = point.x;
      node.fy = point.y;
      node.vx = 0;
      node.vy = 0;
      kickSimulation(state, variant.dragAlphaStart ?? 0.22);
    });

    node.element.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) {
        return;
      }
      const point = projectPointer(svg, event);
      node.fx = point.x;
      node.fy = point.y;
      kickSimulation(state, variant.dragAlphaMove ?? 0.18);
    });

    const release = (event) => {
      if (pointerId !== event.pointerId) {
        return;
      }
      pointerId = null;
      node.element.releasePointerCapture(event.pointerId);
      node.fx = null;
      node.fy = null;
      kickSimulation(state, variant.dragAlphaRelease ?? 0.15);
    };

    node.element.addEventListener("pointerup", release);
    node.element.addEventListener("pointercancel", release);
  }

  function startSimulation(state) {
    if (!state.simulation) {
      state.simulation = {
        alpha: 1,
        alphaMin: 0.018,
        alphaDecay: state.variant.alphaDecay ?? 0.032,
        velocityDecay: state.variant.velocityDecay ?? 0.78,
      };
    }

    const simulation = state.simulation;
    simulation.alpha = Math.max(simulation.alpha, 0.2);

    const step = () => {
      applyForces(state);
      tick(state);

      simulation.alpha += (0 - simulation.alpha) * simulation.alphaDecay;
      if (simulation.alpha > simulation.alphaMin) {
        state.frame = requestAnimationFrame(step);
      } else {
        state.frame = null;
      }
    };

    state.frame = requestAnimationFrame(step);
  }

  function kickSimulation(state, alpha) {
    if (!state.simulation) {
      return;
    }
    state.simulation.alpha = Math.max(state.simulation.alpha, alpha);
    if (!state.frame) {
      startSimulation(state);
    }
  }

  function applyForces(state) {
    const { graph, size, simulation, variant } = state;
    const alpha = simulation.alpha;
    const nodes = graph.nodes;
    const links = graph.links;
    const chargeStrength = state.expanded ? variant.chargeStrengthExpanded : variant.chargeStrengthCompact;
    const centerStrength = state.expanded ? variant.centerStrengthExpanded : variant.centerStrengthCompact;
    const collisionPadding = state.expanded ? variant.collisionPaddingExpanded : variant.collisionPaddingCompact;
    const linkForceMultiplier = state.expanded ? variant.linkForceExpanded ?? 1 : variant.linkForceCompact ?? 1;
    const collisionForceMultiplier = state.expanded ? variant.collisionForceExpanded ?? 1 : variant.collisionForceCompact ?? 1;
    const chargeForceMultiplier = state.expanded ? variant.chargeForceExpanded ?? 1 : variant.chargeForceCompact ?? 1;

    nodes.forEach((node) => {
      const offsetX = size.centerX - node.x;
      const offsetY = size.centerY - node.y;
      node.vx += offsetX * centerStrength * alpha;
      node.vy += offsetY * centerStrength * alpha;
    });

    links.forEach((link) => {
      const source = link.sourceNode;
      const target = link.targetNode;
      let dx = target.x - source.x;
      let dy = target.y - source.y;
      let distance = Math.hypot(dx, dy) || 1;
      const desired = state.expanded ? variant.linkDistanceExpanded(link) : variant.linkDistanceCompact(link);
      const force = ((distance - desired) / distance) * (0.007 + link.weight * 0.0045) * linkForceMultiplier * alpha;

      dx *= force;
      dy *= force;

      source.vx += dx;
      source.vy += dy;
      target.vx -= dx;
      target.vy -= dy;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distanceSq = dx * dx + dy * dy;
        if (!distanceSq) {
          dx = (Math.random() - 0.5) * 0.2;
          dy = (Math.random() - 0.5) * 0.2;
          distanceSq = dx * dx + dy * dy;
        }

        const distance = Math.sqrt(distanceSq);
        const minDistance = a.r + b.r + collisionPadding;
        if (distance < minDistance) {
          const push = ((minDistance - distance) / distance) * 0.08 * collisionForceMultiplier * alpha;
          const pushX = dx * push;
          const pushY = dy * push;
          a.vx -= pushX;
          a.vy -= pushY;
          b.vx += pushX;
          b.vy += pushY;
        }

        const repulse = ((chargeStrength * chargeForceMultiplier) * alpha) / (distanceSq + 24);
        a.vx -= dx * repulse * 0.00011;
        a.vy -= dy * repulse * 0.00011;
        b.vx += dx * repulse * 0.00011;
        b.vy += dy * repulse * 0.00011;
      }
    }
  }

  function tick(state) {
    const { graph, size, simulation } = state;

    graph.nodes.forEach((node) => {
      if (node.fx != null && node.fy != null) {
        node.x = node.fx;
        node.y = node.fy;
      } else {
        node.vx *= simulation.velocityDecay;
        node.vy *= simulation.velocityDecay;
        node.x += node.vx;
        node.y += node.vy;
      }

      const inset = node.r + size.padding;
      node.x = clamp(node.x, inset, size.width - inset);
      node.y = clamp(node.y, inset, size.height - inset);
    });

    updateLinkPositions(state);
    updateNodePositions(state);
  }

  function updateLinkPositions(state) {
    state.graph.links.forEach((link) => {
      const source = link.sourceNode;
      const target = link.targetNode;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const unitX = dx / distance;
      const unitY = dy / distance;
      const startX = source.x + unitX * (source.r + 1.5);
      const startY = source.y + unitY * (source.r + 1.5);
      const endPadding = state.variant.name === "citation" ? target.r + 11 : target.r + 1.5;
      const endX = target.x - unitX * endPadding;
      const endY = target.y - unitY * endPadding;
      const nx = -(endY - startY) / distance;
      const ny = (endX - startX) / distance;
      const curveMagnitude =
        state.variant.name === "citation"
          ? Math.min(14, 7 + (Math.abs(source.index - target.index) % 3) * 2.5)
          : Math.min(24, 6 + link.weight * 2.8);
      const curve = curveMagnitude * (source.index < target.index ? 1 : -1);
      const cx = (startX + endX) / 2 + nx * curve;
      const cy = (startY + endY) / 2 + ny * curve;
      link.element.setAttribute("d", `M ${startX.toFixed(2)} ${startY.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`);
    });
  }

  function updateNodePositions(state) {
    const { graph, size, expanded } = state;

    graph.nodes.forEach((node) => {
      node.element.setAttribute("transform", `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)})`);

      const angle = Math.atan2(node.y - size.centerY, node.x - size.centerX);
      const textBox = estimateTextBox(node.shortLabel, expanded ? 12.5 : 11.5);
      const labelLayout = resolveLabelPosition(node, graph.nodes, size, angle, textBox, expanded);

      node.label.setAttribute("x", String(labelLayout.textX));
      node.label.setAttribute("y", String(labelLayout.textY));
      node.labelBack.setAttribute("x", String(labelLayout.boxX));
      node.labelBack.setAttribute("y", String(labelLayout.boxY));
      node.labelBack.setAttribute("width", String(labelLayout.boxWidth));
      node.labelBack.setAttribute("height", String(labelLayout.boxHeight));
    });
  }

  function updateDetail(state, payload, persistent) {
    setDetail(state.detail, payload.title, payload.subtitle, payload.papers, state.variant);
    if (state.detail) {
      state.detail.dataset.graphSelection = persistent ? "locked" : "preview";
    }
  }

  function resetState(state, resetDetail) {
    if (resetDetail) {
      updateDetail(state, state.emptyDetail, false);
    }
    applyStateClasses(state);
    hideTooltip(state.scene.tooltip);
  }

  function applyStateClasses(state) {
    const active = state.selected || state.hovered;
    const activeNodeIds = new Set();
    const activeLinkIds = new Set();

    if (active) {
      if (active.type === "node") {
        activeNodeIds.add(active.id);
        state.graph.links.forEach((link) => {
          if (link.source === active.id || link.target === active.id) {
            activeLinkIds.add(link.index);
            activeNodeIds.add(link.source);
            activeNodeIds.add(link.target);
          }
        });
      } else if (active.type === "link") {
        activeLinkIds.add(active.id);
        const link = state.graph.links.find((entry) => entry.index === active.id);
        if (link) {
          activeNodeIds.add(link.source);
          activeNodeIds.add(link.target);
        }
      }
    }

    state.graph.links.forEach((link) => {
      const isActive = activeLinkIds.has(link.index);
      const isContext = activeNodeIds.has(link.source) || activeNodeIds.has(link.target);
      link.element.classList.toggle("is-active", isActive);
      link.element.classList.toggle("is-context", !isActive && isContext && !!active);
      link.element.classList.toggle("is-muted", !!active && !isActive && !isContext);
      link.element.setAttribute("opacity", String(resolveLinkOpacity(link, isActive, isContext, !!active)));
      link.element.setAttribute("stroke", resolveLinkStroke(state, isActive, isContext));
      if (state.variant.name === "citation") {
        link.element.setAttribute("marker-end", resolveCitationMarker(state, isActive, isContext));
      }
    });

    state.graph.nodes.forEach((node) => {
      const isActive =
        activeNodeIds.has(node.id) &&
        (!active || (active.type === "node" && active.id === node.id) || (active.type === "link" && activeNodeIds.has(node.id)));
      const isContext = activeNodeIds.has(node.id);
      const muted = !!active && !isContext;

      node.element.classList.toggle("is-active", isActive);
      node.element.classList.toggle("is-context", !isActive && isContext);
      node.element.classList.toggle("is-muted", muted);

      node.halo.setAttribute("opacity", isActive ? "1" : isContext ? "0.5" : "0");
      node.circle.setAttribute("stroke-width", isActive ? "2.8" : isContext ? "2.2" : state.expanded ? "1.8" : "1.5");
      node.circle.setAttribute("stroke", isActive ? "#f2f7fb" : isContext ? tintColor(node.stroke, 0.06) : node.stroke);
      node.circle.setAttribute("fill", muted ? tintColor(node.fill, 0.18) : isActive ? tintColor(node.fill, 0.08) : node.fill);
      node.circle.style.stroke = isActive ? "#f2f7fb" : isContext ? tintColor(node.stroke, 0.06) : node.stroke;
      node.circle.style.fill = muted ? tintColor(node.fill, 0.18) : isActive ? tintColor(node.fill, 0.08) : node.fill;
      node.halo.style.fill = node.haloColor;

      const prominent = node.labelWeight === "primary" || isContext || (!!state.hovered && state.hovered.type === "node" && state.hovered.id === node.id);
      node.label.setAttribute("opacity", muted ? "0.18" : prominent ? "1" : "0.54");
      node.label.setAttribute("font-size", prominent ? (state.expanded ? "13.5" : "12.2") : state.expanded ? "12.5" : "11.5");
      node.labelBack.setAttribute("opacity", prominent ? "0.86" : "0");
      node.label.setAttribute("fill", muted ? "rgba(226, 233, 240, 0.35)" : prominent ? "#f8fafc" : "rgba(226, 233, 240, 0.78)");
    });
  }

  function resolveLinkOpacity(link, isActive, isContext, hasSelection) {
    if (isActive) {
      return 0.98;
    }
    if (isContext) {
      return Math.min(link.opacity + 0.22, 0.7);
    }
    if (hasSelection) {
      return 0.08;
    }
    return link.opacity;
  }

  function resolveLinkStroke(state, isActive, isContext) {
    if (isActive) {
      return state.variant.edgeStrokeActive;
    }
    if (isContext) {
      return state.variant.edgeStrokeContext;
    }
    return state.variant.edgeStroke;
  }

  function resolveCitationMarker(state, isActive, isContext) {
    if (!state.scene.markerIds) {
      return "";
    }
    if (isActive) {
      return `url(#${state.scene.markerIds.active})`;
    }
    if (isContext) {
      return `url(#${state.scene.markerIds.context})`;
    }
    return `url(#${state.scene.markerIds.default})`;
  }

  function showTooltip(state, event, payload) {
    if (typeof event.clientX !== "number" || typeof event.clientY !== "number") {
      return;
    }

    const { tooltip } = state.scene;
    tooltip.innerHTML = `
      <strong style="display:block;margin-bottom:0.2rem;">${escapeHtml(payload.title || state.variant.fallbackTooltip)}</strong>
      <span>${escapeHtml(payload.subtitle || "")}</span>
    `;
    tooltip.style.opacity = "1";

    const bounds = state.container.getBoundingClientRect();
    const x = event.clientX - bounds.left + 14;
    const y = event.clientY - bounds.top + 14;
    const maxX = Math.max(bounds.width - tooltip.offsetWidth - 8, 8);
    const maxY = Math.max(bounds.height - tooltip.offsetHeight - 8, 8);
    tooltip.style.left = `${clamp(x, 8, maxX)}px`;
    tooltip.style.top = `${clamp(y, 8, maxY)}px`;
  }

  function hideTooltip(tooltip) {
    tooltip.style.opacity = "0";
  }

  function installResizeHandling(state) {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (state.resizeFrame) {
        cancelAnimationFrame(state.resizeFrame);
      }
      state.resizeFrame = requestAnimationFrame(() => {
        const nextSize = resolveSize(state.container, state.expanded);
        if (nextSize.width === state.size.width && nextSize.height === state.size.height) {
          return;
        }
        render(state.container, state.detail, state.data);
      });
    });

    observer.observe(state.container);
    state.observer = observer;
  }

  function projectPointer(svg, event) {
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    return {
      x: ((event.clientX - rect.left) / rect.width) * viewBox.width,
      y: ((event.clientY - rect.top) / rect.height) * viewBox.height,
    };
  }

  function setDetail(container, title, subtitle, papers, variant) {
    if (!container) {
      return;
    }

    const items = (papers || [])
      .map((paper) => `<li>${escapeHtml(paper)}</li>`)
      .join("");

    container.innerHTML = `
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(subtitle)}</p>
      ${papers == null ? "" : items ? `<ul>${items}</ul>` : `<p>${escapeHtml(variant.detailEmptyListMessage)}</p>`}
    `;
  }

  function abbreviatePaperTitle(title) {
    if (!title) {
      return "";
    }

    const trimmed = String(title).trim();
    if (trimmed.length <= 30) {
      return trimmed;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex >= 12 && colonIndex <= 38) {
      const beforeColon = trimmed.slice(0, colonIndex).trim();
      if (beforeColon.length >= 10) {
        return beforeColon;
      }
    }

    const words = trimmed.split(/\s+/);
    let label = "";
    for (const word of words) {
      const candidate = label ? `${label} ${word}` : word;
      if (candidate.length > 30) {
        break;
      }
      label = candidate;
    }

    if (label.length >= 14) {
      return `${label}…`;
    }

    return `${trimmed.slice(0, 27).trimEnd()}…`;
  }

  function createSvg(tagName, attributes, children) {
    const element = document.createElementNS(SVG_NS, tagName);
    Object.entries(attributes || {}).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    (children || []).forEach((child) => element.appendChild(child));
    return element;
  }

  function createCitationMarker(suffix, fill) {
    return createSvg("marker", {
      id: `paper-graph-arrow-${suffix}`,
      markerWidth: "12",
      markerHeight: "12",
      refX: "10.2",
      refY: "6",
      orient: "auto",
      markerUnits: "userSpaceOnUse",
    }, [
      createSvg("path", {
        d: "M 0 0 L 12 6 L 0 12 z",
        fill,
      }),
    ]);
  }

  function estimateTextBox(text, fontSize) {
    return {
      width: Math.max(text.length * fontSize * 0.52, 40),
      height: fontSize + 6,
    };
  }

  function resolveLabelPosition(node, nodes, size, angle, textBox, expanded) {
    const baseOffset = node.r + (expanded ? 18 : 15);
    const directionX = Math.cos(angle) || 1;
    const directionY = Math.sin(angle) || 0;
    const boxWidth = textBox.width + 14;
    const boxHeight = textBox.height + 8;
    let labelX = directionX * Math.min(baseOffset, 18);
    let labelY = directionY * baseOffset + (angle > 0 ? 10 : -6);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const boxX = labelX - boxWidth / 2;
      const boxY = labelY - textBox.height + 2;
      const overlapsNode = nodes.some((other) => other !== node && labelIntersectsNode(node, boxX, boxY, boxWidth, boxHeight, other));
      if (!overlapsNode) {
        break;
      }

      labelX += directionX * 10;
      labelY += directionY * 10 + (directionY >= 0 ? 3 : -3);
    }

    const clampedTextX = clamp(labelX, -node.x + boxWidth / 2 + 6, size.width - node.x - boxWidth / 2 - 6);
    const clampedTextY = clamp(labelY, -node.y + boxHeight, size.height - node.y - 8);

    return {
      textX: clampedTextX,
      textY: clampedTextY,
      boxX: clamp(clampedTextX - boxWidth / 2, -node.x + 6, size.width - node.x - boxWidth - 6),
      boxY: clamp(clampedTextY - textBox.height + 2, -node.y + 6, size.height - node.y - boxHeight - 6),
      boxWidth,
      boxHeight,
    };
  }

  function labelIntersectsNode(node, boxX, boxY, boxWidth, boxHeight, other) {
    const closestX = clamp(other.x - node.x, boxX, boxX + boxWidth);
    const closestY = clamp(other.y - node.y, boxY, boxY + boxHeight);
    const dx = other.x - node.x - closestX;
    const dy = other.y - node.y - closestY;
    return dx * dx + dy * dy < Math.pow(other.r + 6, 2);
  }

  function normalize(value, min, max) {
    if (min === max) {
      return 0.5;
    }
    return clamp((value - min) / (max - min), 0, 1);
  }

  function interpolate(value, min, max, outMin, outMax, soften) {
    const t = soften ? Math.sqrt(normalize(value, min, max)) : normalize(value, min, max);
    return outMin + (outMax - outMin) * t;
  }

  function mixColors(from, to, t) {
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function tintColor(color, amount) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) {
      return color;
    }

    const [r, g, b] = match.map(Number);
    const mix = (channel) => Math.round(channel + (255 - channel) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  window.PaperLibraryGraph = { render };
})();
