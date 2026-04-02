---
title: "Mapping 1,000+ Language Models via the Log-Likelihood Vector"
date: 2026-03-30
draft: false

authors:
  - "Momose Oyama"
  - "Hiroaki Yamagiwa"
  - "Yusuke Takase"
  - "Hidetoshi Shimodaira"

year: 2025
venue: "Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)"
publication_type: "conference paper"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://aclanthology.org/2025.acl-long.1584.pdf"
code: "https://github.com/shimo-lab/modelmap"

tags:
  - "model-similarity"

keywords:
  - "log-likelihood vectors"
  - "model coordinates"
  - "KL divergence"
  - "language model comparison"
  - "model mapping"
  - "benchmark prediction"

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This paper proposes representing autoregressive language models with log-likelihood vectors computed on a shared text set. After centering, squared Euclidean distance in this space approximates KL divergence between models, making large-scale model comparison efficient. The authors build a map of 1,018 language models, analyze clustering by model family and text specialization, and show that these coordinates strongly predict benchmark performance. The method also helps surface likely data leakage when likelihood on the chosen corpus is unusually high relative to benchmark scores."

abstract: "To compare autoregressive language models at scale, we propose using log-likelihood vectors computed on a predefined text set as model features. This approach has a solid theoretical basis: when treated as model coordinates, their squared Euclidean distance approximates the Kullback-Leibler divergence of text-generation probabilities. Our method is highly scalable, with computational cost growing linearly in both the number of models and text samples, and is easy to implement as the required features are derived from cross-entropy loss. Applying this method to over 1,000 language models, we constructed a model map, providing a new perspective on large-scale model analysis."

relevance: "This paper is useful for studying representation geometry and similarity metrics at the model level rather than the hidden-state level. It offers a concrete geometric construction in which model distance has an information-theoretic interpretation, linking Euclidean geometry to KL divergence. For work on embedding spaces, alignment, and representation comparison, it provides a strong example of how centering, distance design, and feature-space choice determine what kinds of similarity become measurable."

related_topics:
  - "model geometry"
  - "KL-based similarity"
  - "large-scale LLM comparison"
  - "benchmark prediction"
  - "data contamination detection"

personal_note: "Useful as a model-level geometry paper with a clear metric interpretation, even though it is not about hidden-state similarity directly."
---
- Main claim: A language model can be represented by its log-likelihood vector over a shared corpus, and squared Euclidean distance between centered vectors approximates KL divergence between models.
- Method: Compute log-likelihoods on 10,000 text chunks, apply row-wise and column-wise centering to obtain model coordinates, then use these coordinates for visualization, nearest-neighbor analysis, and regression on benchmark scores.
- Useful for: Comparing many LLMs without pairwise generation, defining interpretable model-level similarity, and relating geometric position to benchmark behavior and data leakage.
- Limits / caveats: Results depend on the chosen text corpus; contamination from pretraining overlap can inflate mean likelihood; the KL approximation relies on models being reasonably close to the underlying data distribution; and the method studies model-output distributions rather than hidden states.
