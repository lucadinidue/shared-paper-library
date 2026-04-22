---
title: "Self-Distillation as a Performance Recovery Mechanism for LLMs: Counteracting Compression and Catastrophic Forgetting"
date: 2026-03-30
draft: false

authors:
- "Chi Liu"
- "Xin Chen"
- "Xu Zhou"
- "Fangbo Tu"
- "Srinivasan Manoharan"

year: 2026
venue: "arXiv"
publication_type: "preprint"
arxiv: "2604.15794"
doi: ""
source_url: ""
pdf: "https://arxiv.org/pdf/2604.15794"
code: ""

tags:
- "embedding-similarity"
- "applications"

keywords:
- self-distillation
- catastrophic forgetting
- model compression
- manifold alignment
- activation similarity

reading_status: "to-read"
priority: 2
date_added: 2026-03-30
date_read:

summary: "This paper proposes a self-distillation fine-tuning (SDFT) framework to recover performance in LLMs degraded by catastrophic forgetting or compression. The method uses the model’s own historical checkpoints as teachers, avoiding external models. A theoretical analysis links recovery to alignment of high-dimensional representation manifolds. Empirical results show strong correlation between performance recovery and CKA-based alignment."

abstract: "Large Language Models (LLMs) have achieved remarkable success, underpinning diverse AI applications. However, they often suffer from performance degradation due to factors such as catastrophic forgetting during Supervised Fine-Tuning (SFT), quantization, and pruning. In this work, we introduce a performance recovery framework based on Self-Distillation Fine-Tuning (SDFT) that effectively restores model capabilities. Complementing this practical contribution, we provide a rigorous theoretical explanation for the underlying recovery mechanism. We posit that an LLM’s generative capability fundamentally relies on the high-dimensional manifold constructed by its hidden layers. To investigate this, we employ Centered Kernel Alignment (CKA) to quantify the alignment between student and teacher activation trajectories, leveraging its invariance to orthogonal transformations and scaling. Our experiments demonstrate a strong correlation between performance recovery and manifold alignment, substantiating the claim that self-distillation effectively aligns the student’s high-dimensional manifold with the optimal structure represented by the teacher. This study bridges the gap between practical recovery frameworks and geometric representation theory, offering new insights into the internal mechanisms of self-distillation."

relevance: "Highly relevant for representation geometry and similarity metrics in LLMs. The paper explicitly connects performance to hidden-state manifold structure and uses CKA as a key metric, making it useful for studying representation alignment, anisotropy, and embedding space evolution."

related_topics:
- representation similarity
- CKA analysis
- catastrophic forgetting
- knowledge distillation
- model compression

personal_note: "Interesting link between recovery and representation alignment; applications."

--- 

- Main claim: Self-distillation recovers degraded LLM performance by realigning the student’s hidden-state manifold with a teacher manifold, measurable via CKA.
- Method:
  - Use historical checkpoints as teachers.
  - Optimize student via reverse KL (distillation) on task data.
  - Measure alignment using CKA on activation matrices (page 6–7).
  - Validate across three scenarios: catastrophic forgetting, quantization, and pruning.
- Useful for:
  - Studying representation geometry in LLMs
  - Understanding effects of fine-tuning and compression on hidden states
  - Using CKA as a diagnostic metric for performance degradation
- Limits / caveats:
  - Strong dependence on teacher quality
  - CKA captures correlation, not causation
  - No direct optimization of geometry (only post-hoc analysis)
  - Small models require external teacher bootstrapping (page 5)