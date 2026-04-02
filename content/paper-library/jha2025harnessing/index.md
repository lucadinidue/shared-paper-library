---
title: "Harnessing the Universal Geometry of Embeddings"
date: 2026-03-30
draft: false

authors:
  - "Rishi Jha"
  - "Collin Zhang"
  - "Vitaly Shmatikov"
  - "John X. Morris"

year: 2025
venue: "NeurIPS 2025"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: "https://vec2vec.github.io/"
pdf: https://openreview.net/pdf?id=jiCLUPq5xv""
code: "https://github.com/rjha18/vec2vec"

tags:
  - "embedding-space-geometry"
  - "embedding-similarity"

keywords:
  - unsupervised embedding translation
  - latent space alignment
  - platonic representation hypothesis
  - embedding inversion
  - adversarial learning

reading_status: "read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "This paper proposes vec2vec, the first method to translate text embeddings across models without paired data. It learns a shared latent space capturing a universal geometry of representations. The method preserves both geometric structure and semantic information, enabling cross-model alignment and even information extraction. Results show high cosine similarity and strong transfer across architectures and domains."

abstract: "We introduce a method for translating text embeddings from one vector space to another without paired data, encoders, or predefined matches. The approach maps embeddings into a shared latent representation inspired by the Platonic Representation Hypothesis. Translations achieve high cosine similarity across models with different architectures and datasets. The method preserves geometry and semantics, enabling attribute inference and inversion, with implications for both representation learning and data privacy."

relevance: "Highly relevant for studying representation geometry and alignment across models. It provides strong empirical evidence for shared latent structures in embedding spaces and introduces a concrete method to exploit them. Particularly useful for understanding cross-model similarity, latent alignment, and the geometry underlying embeddings."

related_topics:
  - cross-model alignment
  - latent space translation
  - embedding inversion
  - representation similarity
  - unsupervised learning

personal_note: "Important for thinking about universal structure in embeddings and implications for representation comparability and privacy."
---
- Main claim:

  - Embedding spaces from different models share a universal latent geometry that can be learned and used to translate representations without any paired data. :contentReference[oaicite:0]{index=0}
- Method:

  - Introduces **vec2vec**, a modular architecture with:
    - Input adapters → shared latent space → output adapters
    - A shared backbone network enforcing a universal representation
  - Training combines:
    - Adversarial loss (distribution matching)
    - Cycle consistency (round-trip stability)
    - Reconstruction loss
    - Vector Space Preservation (pairwise geometry preservation)
  - Fully unsupervised: no aligned pairs, no access to original encoder
- Useful for:

  - Studying **representation geometry across models**
  - Cross-model embedding compatibility
  - Understanding whether embeddings encode **model-invariant semantics**
  - Security/privacy analysis (embedding leakage and inversion)
  - Bridging modalities (e.g., text ↔ CLIP embeddings)
- Limits / caveats:

  - Training relies on GAN-style objectives → instability and tuning required
  - Requires large amounts of embedding data for strong performance
  - Assumes similar modality and task distribution (e.g., text, same language)
  - Translation quality drops in harder cross-modal or distant domains
  - Does not fully reconstruct original inputs—only partial semantic recovery
