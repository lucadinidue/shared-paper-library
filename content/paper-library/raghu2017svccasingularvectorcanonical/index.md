---
title: "SVCCA: Singular Vector Canonical Correlation Analysis for Deep Learning Dynamics and Interpretability"
date: 2026-03-30
draft: false

authors:
  - "Maithra Raghu"
  - "Justin Gilmer"
  - "Jason Yosinski"
  - "Jascha Sohl-Dickstein"

year: 2017
venue: "NeurIPS"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://proceedings.neurips.cc/paper_files/paper/2017/file/dc6a7e655d7e5840e66733e9ee67cc69-Paper.pdf"
code: ""

tags:
  - "embedding-similarity"
  - "learning-dynamics"

keywords:
  - "CCA"
  - "SVD"
  - "neural representations"
  - "layer similarity"
  - "learning dynamics"

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read: 2026-03-27

summary: "Introduces SVCCA, a method combining SVD and CCA to compare neural network representations. It enables affine-invariant similarity comparisons across layers, models, and training stages. The paper uses SVCCA to study intrinsic dimensionality, learning dynamics, and class-specific representations. It also proposes applications like freeze training and model compression."

abstract: "We propose Singular Vector Canonical Correlation Analysis (SVCCA), a technique for comparing neural network representations that is invariant to affine transformations and efficient to compute. SVCCA combines singular value decomposition with canonical correlation analysis to identify important subspaces and align them across representations. Using this method, we study the intrinsic dimensionality of layers, analyze learning dynamics across training, and investigate how class-specific information emerges. We also demonstrate applications to model compression and improved training strategies."

relevance: "This is a foundational paper for analyzing representation geometry in neural networks. SVCCA provides a principled way to compare embedding spaces and hidden states across layers, models, and training time. It is particularly relevant for studying representation evolution and alignment, and has influenced later methods like CKA."

related_topics:
  - "representation similarity analysis"
  - "neural network interpretability"
  - "layer-wise analysis"
  - "model compression"

personal_note: "Core method for comparing representations; important baseline before CKA."
---
- Main claim:

  - Neural network representations can be meaningfully compared using subspace alignment rather than neuron-wise correspondence.
  - SVCCA reveals that learned representations are low-dimensional and converge bottom-up during training.
- Method:

  - Represent each neuron as its activation vector over a dataset.
  - Treat layers as subspaces spanned by these vectors.
  - Step 1: Apply SVD to retain top directions explaining ~99% variance.
  - Step 2: Apply CCA to align the two subspaces and compute correlations.
  - Output: aligned directions and correlation coefficients measuring similarity.
- Useful for:

  - Comparing representations across:
    - different layers
    - different training steps
    - different model initializations or architectures
  - Studying learning dynamics (e.g., bottom-up convergence)
  - Identifying intrinsic dimensionality and redundancy
  - Model compression via projection onto top SVCCA directions
- Limits / caveats:

  - Linear method: only captures linear relationships between representations
  - Requires dataset-dependent activations (not input-independent)
  - Computational cost can be high for large conv layers (mitigated via DFT trick)
  - Sensitive to choice of retained variance threshold in SVD
