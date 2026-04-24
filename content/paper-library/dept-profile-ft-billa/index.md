---
title: "Decomposing the Depth Profile of Fine-Tuning"
date: 2026-03-30
draft: false

authors:
- "Jayadev Billa"

year: 2026
venue: "arXiv"
publication_type: "preprint"
arxiv: "2604.17177v1"
doi: ""
source_url: "https://arxiv.org/abs/2604.17177"
pdf: "https://arxiv.org/pdf/2604.17177v1"
code: "https://github.com/jb1999/ft-depth-profile-paper"

tags:
- "embedding-similarity"
- "learning-dynamics"

keywords:
- "fine-tuning dynamics"
- "depth-wise representation change"
- "locality gradient"
- "Procrustes distance"
- "CKA"

reading_status: "to-read"
priority: 2
date_added: 2026-03-30
date_read:

summary: "This paper studies how representations change across depth during fine-tuning. It shows that changes concentrate in output-proximal layers across architectures. Using an equal-step control, it decomposes this effect into components driven by gradient magnitude and intrinsic representation structure. Results reveal strong dependencies on architecture, objective, and scale."

abstract: "Fine-tuning adapts pretrained networks to new objectives. Whether the resulting depth profile of representational change reflects an intrinsic property of the model or the magnitude of gradient flow has not been tested directly. We measure this profile across 240 fine-tuning runs spanning 15 models in four architecture families at scales from 125M to 6.9B parameters. Representational change concentrates in output-proximal layers in nearly all runs. A per-layer control equalizing update magnitudes shows that this profile persists in some conditions and collapses in others, depending on architecture and objective. The locality gradient is thus a composite phenomenon whose components are scale-dependent."

relevance: "Highly relevant for studying representation geometry and hidden-state evolution during fine-tuning. Provides a systematic analysis of depth-wise changes using similarity metrics (CKA, Procrustes) and introduces a method to disentangle gradient-driven vs intrinsic structural effects, directly useful for understanding embedding space dynamics."

related_topics:
- representation similarity
- fine-tuning dynamics
- layer-wise adaptation
- neural representation analysis
- probing
personal_note: "Strong empirical study; particularly interesting for linking objective distance to representation change and for questioning common fine-tuning heuristics."

--- 
- Main claim: Representational change during fine-tuning is concentrated in later layers, but this “locality gradient” is partly due to gradient flow and partly intrinsic structure.
- Method:
  - Large-scale empirical study (240 runs, 15 models).
  - Measures representation change using Procrustes distance and CKA across depths.
  - Introduces equal-step control to normalize per-layer update magnitudes.
- Useful for:
  - Understanding how representations evolve during fine-tuning.
  - Evaluating assumptions behind PEFT methods (LoRA, layer freezing).
  - Studying representation geometry and similarity metrics across depth.
- Limits / caveats:
  - Equal-step operates in parameter space, not function space.
  - Limited architectural diversity (few parallel-block models).
  - No instruction tuning / RLHF / multimodal settings.
