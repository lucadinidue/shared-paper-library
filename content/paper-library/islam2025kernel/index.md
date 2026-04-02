---
title: "Kernel Alignment using Manifold Approximation"
date: 2026-03-30
draft: false

authors:
  - "Mohammad Tariqul Islam"
  - "Du Liu"
  - "Deblina Sarker"

year: 2025
venue: "ICLR 2025 Workshop on Representational Alignment (Re-Align)"
publication_type: "workshop paper"
arxiv: ""
doi: ""
source_url: ""
pdf: ""
code: ""

tags:
  - "embedding-similarity"

keywords:
  - "manifold approximation"
  - "kernel alignment"
  - "MKA"
  - "representational similarity"
  - "neural network representations"

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This paper proposes Manifold-approximated Kernel Alignment (MKA), a variant of kernel alignment that incorporates local manifold structure into representation comparison. It argues that standard CKA is sensitive to scale, bandwidth choices, and some topological distortions, while MKA is more stable across synthetic settings. The paper provides a theoretical formulation for MKA and compares it empirically against several CKA variants. It also revisits layerwise similarity in ResNet-50, showing that MKA yields a different view of representational organization than standard CKA."

abstract: "Centered kernel alignment (CKA) is a popular metric for comparing representations, determining equivalence of networks, and conducting neuroscience research. However, CKA does not account for the underlying manifold and relies on heuristics that can make it behave differently at different data scales. This work proposes Manifold-approximated Kernel Alignment (MKA), which incorporates manifold geometry into the alignment task. The paper derives a theoretical framework for MKA and evaluates it on synthetic datasets and real-world examples to characterize and compare it to CKA. The results suggest that manifold-aware kernel alignment provides a more robust foundation for measuring representations, with potential applications in representation learning."

relevance: "Useful for work on representation geometry and similarity metrics because it directly questions the robustness of CKA and proposes a manifold-aware alternative. It is especially relevant when comparing hidden representations whose topology may matter more than global Euclidean structure. The paper is also helpful for thinking about how alignment measures change under perturbations, dimensionality shifts, and different notions of neighborhood structure."

related_topics:
  - "manifold-aware similarity measures"
  - "representation alignment"
  - "layerwise representation comparison"
  - "topology of embedding spaces"

personal_note: "Potentially useful as a methodological reference when CKA seems too sensitive to geometry or hyperparameters."
---
- Main claim: Standard CKA can miss or distort manifold-level similarity, while MKA better captures topology-preserving relationships and is more robust to some hyperparameter choices.
- Method: Define a sparse manifold-approximated kernel using a UMAP-style k-nearest-neighbor construction, then compute a normalized alignment score with row-centered kernels; compare against RBF-CKA variants and a sparsified t-CKA baseline.
- Useful for: Studying representation geometry, evaluating similarity metrics beyond linear/global kernels, and analyzing neural network hidden representations when local neighborhood structure matters.
- Limits / caveats: The paper is a workshop paper; the proposed kernel is non-symmetric and non-Mercer; evaluation is mostly synthetic plus a ResNet-50 case study; bibliographic metadata such as DOI, arXiv ID, and code link are not recoverable from the provided PDF alone.
