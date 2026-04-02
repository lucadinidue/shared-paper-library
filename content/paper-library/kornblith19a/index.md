---
title: "Similarity of Neural Network Representations Revisited"
date: 2026-03-30
draft: false

authors:
- "Simon Kornblith"
- "Mohammad Norouzi"
- "Honglak Lee"
- "Geoffrey Hinton"

year: 2019
venue: "International Conference on Machine Learning (ICML)"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://proceedings.mlr.press/v97/kornblith19a/kornblith19a.pdf"
code: ""

tags:
- embedding-similarity
keywords:
- "representation similarity"
- "CKA"
- "CCA"
- "neural network representations"
- "kernel methods"

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "The paper studies how to measure similarity between neural network representations. It critiques CCA-based methods and introduces centered kernel alignment (CKA) as a more reliable similarity metric. CKA overcomes limitations related to invariance properties and high-dimensional representations. Empirically, it successfully identifies correspondence between layers across models and architectures."

abstract: "Recent work has sought to understand the behavior of neural networks by comparing representations between layers and between different trained models. We examine methods for comparing neural network representations based on canonical correlation analysis (CCA). We show that CCA belongs to a family of statistics for measuring multivariate similarity, but that neither CCA nor any other statistic that is invariant to invertible linear transformation can measure meaningful similarities between representations of higher dimension than the number of data points. We introduce a similarity index that measures the relationship between representational similarity matrices and does not suffer from this limitation. This similarity index is equivalent to centered kernel alignment (CKA) and is also closely connected to CCA. Unlike CCA, CKA can reliably identify correspondences between representations in networks trained from different initializations."

relevance: "Highly relevant for studying representation geometry and similarity metrics in neural networks. Introduces CKA, now a standard tool for comparing embedding spaces and hidden states. Important for understanding invariance properties and limitations of CCA/SVCCA when analyzing learned representations."

related_topics:
- "representation similarity analysis"
- "embedding space comparison"
- "layer alignment"
- "kernel methods"
- "neural network interpretability"

personal_note: "Seminal paper introducing CKA; important baseline for any work on representation similarity."

---

- Main claim:
  - Similarity measures invariant to invertible linear transformations (e.g., CCA) fail in high-dimensional settings.
  - CKA provides a robust alternative that captures meaningful similarities between neural network representations.

- Method:

  - Reformulates representation comparison via representational similarity matrices (RSMs).
  - Uses HSIC and its normalized version (CKA) to compare similarity structures.
  - Shows linear CKA equivalence to normalized Frobenius norm of cross-covariance.
  - Empirical evaluation across CNNs and Transformers.

- Useful for:

  - Comparing hidden representations across models or layers.
  - Studying training dynamics and representation evolution.
  - Evaluating alignment across architectures or datasets.
  - Analyzing embedding space geometry.

- Limits / caveats:

  - Choice of kernel (linear vs RBF) may affect results.
  - Still unclear what the "best" similarity notion should be.
  - Does not fully resolve interpretability of representations.
  - Requires careful preprocessing (centering, etc.).

