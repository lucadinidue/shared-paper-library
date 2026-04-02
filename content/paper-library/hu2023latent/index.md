---
title: "Delays, Detours, and Forks in the Road: Latent State Models of Training Dynamics"
date: 2026-03-30
draft: false

authors:
  - "Michael Hu"
  - "Angelica Chen"
  - "Naomi Saphra"
  - "Kyunghyun Cho"

year: 2024
venue: "Transactions on Machine Learning Research"
publication_type: "journal"
arxiv: "2308.09543"
doi: ""
source_url: ""
pdf: "https://openreview.net/pdf?id=NE2xXWo0LF"
code: "https://github.com/michahu/modeling-training"

tags:
  - learning-dynamics

keywords:
  - training dynamics
  - hidden Markov models
  - convergence analysis
  - latent states
  - optimization dynamics

reading_status: "read"
priority: 1
date_added: 2026-03-31
date_read:

summary: "This paper models neural network training as a sequence of latent states using Hidden Markov Models (HMMs) fitted on weight-derived metrics. It shows that training trajectories across random seeds can be clustered into discrete phases, revealing structured variability in optimization. The authors introduce “detour states” that correlate with slower convergence and explain phenomena like grokking. The approach provides a low-dimensional, interpretable representation of training dynamics."

abstract: "The impact of randomness on model training is poorly understood. This work studies how differences in random seeds affect training dynamics by modeling training as a sequence of latent states. Neural networks are trained multiple times and metrics such as norms, means, and variances of weights are collected. A hidden Markov model (HMM) is then fitted over these sequences to infer latent state transitions. The resulting representation provides a low-dimensional, discrete view of training dynamics. Across tasks such as grokking, image classification, and masked language modeling, the method reveals phase transitions and identifies latent “detour” states associated with slower convergence."

relevance: "The paper is relevant for studying representation evolution and hidden states during training. Although it focuses on weight-space metrics rather than embedding geometry, it introduces a principled way to discretize training trajectories into interpretable latent states. This can complement work on representation geometry (e.g., SVCCA/CKA) by providing a temporal abstraction layer over training dynamics."

related_topics:
  - training dynamics modeling
  - grokking and phase transitions
  - optimization landscapes
  - latent variable models
  - model interpretability

personal_note: "Interesting angle: discrete latent states over training could be combined with representation similarity methods to track phase transitions more precisely."
---

- Main claim:
  - Training dynamics can be represented as transitions between a small number of discrete latent states, which explain variability across random seeds and convergence behavior.

- Method:
  - Train multiple runs with different seeds.
  - Extract weight-based metrics (e.g., L1/L2 norms, variance, spectral stats).
  - Fit a Gaussian HMM over normalized metric sequences.
  - Derive a “training map” (Markov chain of latent states).
  - Use regression over state occupancy to link states to convergence time and identify *detour states*.

- Useful for:
  - Understanding variability due to randomness in training.
  - Analyzing grokking and phase transitions.
  - Identifying optimization regimes (fast vs slow convergence).
  - Providing a coarse-grained, interpretable trajectory of learning.

- Limits / caveats:
  - Relies on hand-crafted metrics over weights (not fully representation-level).
  - Assumes Markovian and discrete structure of training dynamics.
  - Scalability to very large models may be limited.
  - Latent states depend on chosen features and HMM assumptions.
