---
title: "Geometry-aware similarity metrics for neural representations on Riemannian and statistical manifolds"
date: 2026-03-30
draft: false

authors:
  - "N Alex Cayco Gajic"
  - "Arthur Pellegrino"

year: 2026
venue: "arXiv"
publication_type: "preprint"
arxiv: "2603.28764"
doi: ""
source_url: ""
pdf: "https://arxiv.org/pdf/2603.28764"
code: ""
explicit canonical_id: arxiv:2603.28764

tags:
  - "embedding-space-geometry"
  - "embedding-similarity"

keywords:
  - "Riemannian geometry"
  - "metric similarity analysis"
  - "pullback metric"
  - "spectral ratio"
  - "intrinsic geometry"

reading_status: "to-read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "The paper introduces Metric Similarity Analysis (MSA), a novel framework for comparing neural representations based on intrinsic geometry rather than extrinsic embeddings. Using tools from Riemannian geometry, it compares pullback metrics induced by neural networks. The method reveals differences between models that standard techniques (e.g., CKA, RSA) fail to detect. It is applied to deep networks, dynamical systems, and diffusion models."

abstract: "Similarity measures are widely used to interpret the representational geometries used by neural networks to solve tasks. Yet, because existing methods compare the extrinsic geometry of representations in state space, rather than their intrinsic geometry, they may fail to capture subtle yet crucial distinctions between fundamentally different neural network solutions. Here, we introduce metric similarity analysis (MSA), a novel method which leverages tools from Riemannian geometry to compare the intrinsic geometry of neural representations under the manifold hypothesis. We show that MSA can be used to disentangle features of neural computations in deep networks with different learning regimes, compare nonlinear dynamics, and investigate diffusion models. This provides a mathematically grounded framework to understand neural computations through intrinsic geometry."

relevance: "Highly relevant for studying representation geometry beyond standard similarity metrics (CKA/RSA). Introduces a principled intrinsic metric grounded in Riemannian geometry, directly applicable to analyzing embedding spaces, hidden states, and training dynamics. Particularly useful for understanding when models with similar performance learn fundamentally different representations."

related_topics:
  - "intrinsic vs extrinsic geometry"
  - "representation similarity analysis"
  - "neural manifold hypothesis"
  - "geometry of deep learning"

personal_note: "Important conceptual shift: compare pullback metrics instead of activations. Could connect to probing geometry of LM representations."
---

- Main claim:
  - Standard similarity metrics (CKA, RSA, CCA) fail because they compare **extrinsic geometry**.
  - Neural computations are better characterized by **intrinsic geometry of the data manifold**.
  - MSA captures these intrinsic differences and distinguishes models that appear similar otherwise.

- Method:
  - Model representations as mappings from an input manifold.
  - Use the **pullback metric**:  
    \( G(p) = J(p)^T J(p) \) to encode intrinsic geometry.
  - Define a distance between metrics via the **spectral ratio** on SPD matrices.
  - Aggregate over the manifold:
    \[
    d_{\text{MSA}} = \int_M d_{SR}(G_1(p), G_2(p)) dp
    \]
  - Produces a similarity score in \([0,1]\).

- Useful for:
  - Comparing **hidden representations across models**
  - Detecting differences between **rich vs lazy training regimes** (Fig. 5, page 5)
  - Studying **dynamical systems (RNNs vs SSMs)** (page 6)
  - Analyzing **diffusion model latent geometry** (page 7)
  - General interpretability of neural computations

- Limits / caveats:
  - Requires access to (or estimation of) the **input data manifold**
  - Computationally heavier than sampling-based methods
  - Focuses on representation geometry, not downstream usage
  - Less suitable in **low-data regimes** without manifold estimation :contentReference[oaicite:0]{index=0}
