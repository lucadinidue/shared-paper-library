---
title: "Fine-Tuned Transformers Show Clusters of Similar Representations Across Layers"
date: 2026-03-30
draft: false

authors:
- "Jason Phang"
- "Haokun Liu"
- "Samuel Bowman"

year: 2021
venue: "Proceedings of the Fourth BlackboxNLP Workshop on Analyzing and Interpreting Neural Networks for NLP"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: "https://aclanthology.org/2021.blackboxnlp-1.42/"
pdf: "https://aclanthology.org/2021.blackboxnlp-1.42.pdf"
code: ""

tags:
- "embedding-similarity"

keywords:
- CKA
- layer similarity
- fine-tuning

reading_status: "to-read"
priority: 2
date_added: 2026-03-30
date_read:

summary: "This paper analyzes how representations in Transformers change after fine-tuning using CKA similarity. It finds a block-diagonal structure across layers, separating early and late representations. Later layers are highly similar to each other, suggesting redundancy. Experiments show that top layers can often be removed with minimal performance loss."

abstract: "Despite the success of fine-tuning pretrained language encoders like BERT for downstream natural language understanding (NLU) tasks, it is still poorly understood how neural networks change after fine-tuning. In this work, we use centered kernel alignment (CKA), a method for comparing learned representations, to measure the similarity of representations in task-tuned models across layers. In experiments across twelve NLU tasks, we discover a consistent block diagonal structure in the similarity of representations within fine-tuned RoBERTa and ALBERT models, with strong similarity within clusters of earlier and later layers, but not between them. The similarity of later layer representations implies that later layers only marginally contribute to task performance, and we verify in experiments that the top few layers of fine-tuned Transformers can be discarded without hurting performance, even with no further tuning."

relevance: "Highly relevant for studying representation geometry in Transformers. Shows how CKA reveals structural clustering across layers and supports the idea of redundancy in upper layers. Useful for understanding hidden state evolution and evaluating similarity metrics in embedding spaces."

related_topics:
- layer redundancy in transformers
- representation similarity
- model pruning
- fine-tuning dynamics
personal_note: "Clear empirical evidence of layer clustering; useful baseline for any work on anisotropy or representation collapse."

--- 

- Main claim: Fine-tuned Transformers (RoBERTa, ALBERT) exhibit a block-diagonal similarity structure across layers, separating early and late representations, with high redundancy in top layers.
- Method: Uses Centered Kernel Alignment (CKA) to compute similarity between CLS representations across layers, models, and training conditions (before/after fine-tuning, across seeds).
- Useful for: Understanding representation geometry, layer redundancy, and effects of fine-tuning; supports pruning or early-exit strategies.
- Limits / caveats: Findings do not generalize to all architectures (e.g., ELECTRA behaves differently). Focus is on CLS token and NLU tasks only.