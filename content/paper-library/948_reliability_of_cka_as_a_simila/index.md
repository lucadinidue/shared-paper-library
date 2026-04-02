---
title: "Reliability of CKA as a Similarity Measure in Deep Learning"
date: 2026-03-30
draft: false

authors:
- "MohammadReza Davari"
- "Stefan Horoi"
- "Amine Natik"
- "Guillaume Lajoie"
- "Guy Wolf"
- "Eugene Belilovsky"

year: 2023
venue: "ICLR"
publication_type: "conference paper"
arxiv: ""
doi: ""
source_url: ""
pdf: "https://openreview.net/pdf?id=8HRvyxc606"
code: ""

tags:
- "embedding-similarity"

keywords:
- "Centered Kernel Alignment"
- "representation similarity"
- "neural network representations"
- "HSIC"
- "representation analysis"

reading_status: "to-read"
priority: 2
date_added: 2026-03-30
date_read:

summary: "This paper analyzes the reliability of CKA as a representation similarity metric in deep learning. It shows that CKA is highly sensitive to simple transformations such as subset translations and outliers. The authors demonstrate both theoretically and empirically that CKA values can be manipulated without affecting model functionality. This raises concerns about interpreting CKA-based similarity conclusions."

abstract: "Comparing learned neural representations in neural networks is a challenging but important problem, which has been approached in different ways. The Centered Kernel Alignment (CKA) similarity metric, particularly its linear variant, has recently become a popular approach and has been widely used to compare representations of a network’s different layers, of architecturally similar networks trained differently, or of models with different architectures trained on the same data. A wide variety of conclusions about similarity and dissimilarity of these various representations have been made using CKA. In this work we present analysis that formally characterizes CKA sensitivity to a large class of simple transformations, which can naturally occur in the context of modern machine learning. This provides a concrete explanation of CKA sensitivity to outliers, which has been observed in past works, and to transformations that preserve the linear separability of the data, an important generalization attribute. We empirically investigate several sensitivities of the CKA similarity metric, demonstrating situations in which it gives unexpected or counter-intuitive results. Finally we study approaches for modifying representations to maintain functional behaviour while changing the CKA value. Our results illustrate that, in many cases, the CKA value can be easily manipulated without substantial changes to the functional behaviour of the models, and call for caution when leveraging activation alignment metrics."

relevance: "Highly relevant for studying representation geometry and similarity metrics. It provides theoretical and empirical evidence that CKA does not reliably capture functional similarity between representations, especially under affine transformations or outliers. Important for interpreting embedding space comparisons and hidden state analyses."

related_topics:
- "representation similarity metrics"
- "neural representation analysis"
- "model interpretability"
- "embedding space geometry"

personal_note: "Important cautionary paper—CKA can be misleading. Useful when interpreting representation similarity results."
---

- Main claim:
  - CKA is not a reliable standalone similarity metric; it is highly sensitive to simple transformations that preserve functional behavior.

- Method:
  - Theoretical analysis of CKA sensitivity (subset translations, outliers, separability-preserving transforms)
  - Empirical experiments on synthetic data and CNNs
  - Optimization procedure to manipulate CKA maps without changing accuracy

- Useful for:
  - Understanding limitations of CKA in representation comparison
  - Interpreting similarity across layers/models
  - Designing better evaluation metrics for embedding spaces

- Limits / caveats:
  - Focus mainly on linear CKA (nonlinear case less explored)
  - Some pathological transformations may be uncommon in practice
  - Does not propose a definitive alternative metric
