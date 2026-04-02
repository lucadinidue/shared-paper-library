---
title: "Language Models’ Activations Linearly Encode Training-Order Recency"
date: 2026-03-30
draft: false

authors:
  - "Dmitrii Krasheninnikov"
  - "Richard E. Turner"
  - "David Krueger"

year: 2025
venue: "ICML 2025 Workshop"
publication_type: "workshop paper"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://openreview.net/pdf?id=oUOg50iFL1"
code: ""

tags:
  - "learning-dynamics"

keywords:
  - "training-order recency"
  - "sequential fine-tuning"

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This paper argues that LLM activations linearly encode when information was learned during sequential fine-tuning. Using probes over hidden activations, the authors show that entities introduced earlier versus later can be separated with high accuracy, and that this signal generalizes to unseen entities and multiple training stages. The effect persists after additional mixed training and is not fully explained by simple activation or logit statistics. The work is relevant for interpretability, belief editing, and understanding how models organize learned knowledge over time."
abstract: "Language models’ activations appear to linearly encode the recency of training data exposure. The authors sequentially fine-tune Llama-3.2-1B on two disjoint but otherwise similar datasets about named entities, then train linear probes on the resulting activations. These probes distinguish early versus late entities with about 90% accuracy and generalize to entities unseen during probe training. The model can also be fine-tuned to explicitly report an unseen entity’s training stage with about 80% accuracy. Similar experiments with six sequential fine-tuning stages confirm a linear direction tracking learning order. The temporal signal is not clearly attributable to simple activation-magnitude differences or output-logit statistics, suggesting a more fundamental mechanism by which models differentiate information by acquisition time."
relevance: "This paper is useful for studying hidden-state structure and representation geometry in LLMs because it identifies a linear direction in activation space that tracks temporal aspects of learning rather than semantic content alone. It is especially relevant for probing-based analysis of hidden states, for questions about how fine-tuning reorganizes representations, and for work on knowledge editing or alignment where the model may implicitly encode when information was acquired."
related_topics:
  - "linear probes on hidden states"
  - "sequential fine-tuning dynamics"
  - "knowledge editing"
  - "temporal structure in representations"

personal_note: "Potentially useful as a probing-focused reference on non-semantic structure encoded in LLM activations."
---
- Main claim: LLM hidden activations contain a linear signal that tracks training-order recency, allowing early versus late learned entities to be separated and ordered across multiple fine-tuning stages.
- Method: Sequentially fine-tune models on disjoint entity datasets, cache post-residual activations, and train logistic-regression probes on layer/token representations; also test persistence under mixed training, LoRA variants, and controls balancing activation/logit statistics.
- Useful for: Hidden-state probing, representation geometry under fine-tuning, temporal organization of learned knowledge, and interpretability questions related to knowledge editing or conflicting evidence.
- Limits / caveats: Experiments are restricted to relatively small models, synthetic or semi-synthetic entity QA data, and mainly fine-tuning settings rather than full pretraining; the underlying mechanism behind the signal remains unclear.
