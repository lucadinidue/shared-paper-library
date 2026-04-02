---
title: "Establishing a Scale for Kullback-Leibler Divergence in Language Models Across Various Settings"
date: 2026-03-30
draft: false

authors:
  - "Ryo Kishino"
  - "Yusuke Takase"
  - "Momose Oyama"
  - "Hiroaki Yamagiwa"
  - "Hidetoshi Shimodaira"

year: 2025
venue: "arXiv"
publication_type: "preprint"
arxiv: "2505.15353"
doi: "10.48550/arXiv.2505.15353"
source_url: "https://arxiv.org/abs/2505.15353"
pdf: "https://arxiv.org/pdf/2505.15353"
canonical_id: "doi:10.48550/arxiv.2505.15353"
code: ""

tags:
  - "model-similarity"
  - "learning-dynamics"

keywords:
  - KL divergence
  - log-likelihood space
  - scaling laws
  - training dynamics

reading_status: "to-read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This work extends the log-likelihood vector framework to establish a consistent scale for KL divergence across language models. It compares models across checkpoints, sizes, seeds, quantization, fine-tuning, and layers within a unified geometric space. The study shows that model behavior stabilizes early in log-likelihood space despite continued weight drift, exhibiting subdiffusive dynamics. This provides a principled way to interpret distances between models and track their evolution."

abstract: "We extend this framework to training checkpoints and intermediate layers, and establish a consistent scale for KL divergence across pretraining, model size, random seeds, quantization, fine-tuning, and layers. Analysis of Pythia pretraining trajectories further shows that changes in log-likelihood space are much smaller than in weight space, resulting in subdiffusive learning trajectories and early stabilization of language-model behavior despite weight drift."

relevance: "Highly relevant for representation geometry and similarity metrics in LLMs. The paper provides a unified embedding space where KL divergence becomes a meaningful geometric distance across models, training stages, and architectures. The introduction of a 'scale' for KL divergence is particularly useful for interpreting distances and comparing representation evolution."

related_topics:
  - model similarity metrics
  - training dynamics
  - geometric model comparison
  - logit lens analysis
  - scaling behavior in LLMs

personal_note: "More mature version of the earlier trajectory paper; the notion of a calibrated KL scale could be useful for comparing curriculum-induced trajectories."
---
- Main claim:

  - KL divergence between language models can be placed on a **consistent, interpretable scale** across many settings (training, size, fine-tuning, etc.).
  - Model evolution is **highly constrained in output (log-likelihood) space**, even when weights continue to change.
- Method:

  - Represent models via **log-likelihood vectors** over a fixed dataset.
  - Embed models in a shared Euclidean space where distance ≈ KL divergence.
  - Extend analysis to:
    - Pretraining checkpoints
    - Model sizes
    - Random seeds
    - Quantization
    - Fine-tuning
    - Layers
  - Analyze trajectories and diffusion behavior in this space.
- Useful for:

  - Giving **absolute meaning to KL distances** between models
  - Comparing heterogeneous models (architectures, sizes, training stages)
  - Studying **representation evolution vs weight evolution**
  - Understanding when training actually “stabilizes” behaviorally
- Limits / caveats:

  - KL values depend on the chosen reference dataset
  - Still relies on approximation via log-likelihood vectors
  - Interpretation of the “scale” may not transfer across domains
  - Underlying causes of subdiffusion and trajectory structure remain open
