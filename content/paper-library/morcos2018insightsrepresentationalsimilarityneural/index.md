---

title: "Insights on representational similarity in neural networks with canonical correlation"
date: 2026-03-30
draft: false

authors:
- "Ari S. Morcos"
- "Maithra Raghu"
- "Samy Bengio"

year: 2018
venue: "NeurIPS"
publication_type: "conference"
arxiv: ""
doi: ""
source_url: "https://dl.acm.org/doi/10.5555/3327345.3327475"
pdf: "https://arxiv.org/pdf/1806.05759"
code: "https://github.com/google/svcca/"

tags:
- "embedding-similarity"
- "learning-dynamics"

keywords:
- "CCA"
- "PWCCA"
- "representation similarity"

reading_status: "to-read"
priority: 1
date_added: 2026-03-30
date_read:

summary: "The paper studies how neural network representations can be compared using Canonical Correlation Analysis (CCA). It introduces Projection Weighted CCA (PWCCA) to better distinguish signal from noise. The authors analyze representation similarity across models, training regimes, and architectures. They show that generalizing models converge to more similar representations than memorizing ones."

abstract: "Comparing different neural network representations and determining how representations evolve over time remain challenging open questions in our understanding of the function of neural networks. Comparing representations in neural networks is fundamentally difficult as the structure of representations varies greatly, even across groups of networks trained on identical tasks, and over the course of training. Here, we develop projection weighted CCA (Canonical Correlation Analysis) as a tool for understanding neural networks, building off of SVCCA, a recently proposed method. We first improve the core method, showing how to differentiate between signal and noise, and then apply this technique to compare across a group of CNNs, demonstrating that networks which generalize converge to more similar representations than networks which memorize, that wider networks converge to more similar solutions than narrow networks, and that trained networks with identical topology but different learning rates converge to distinct clusters with diverse representations. We also investigate the representational dynamics of RNNs, across both training and sequential timesteps, finding that RNNs converge in a bottom-up pattern over the course of training and that the hidden state is highly variable over the course of a sequence, even when accounting for linear transforms. Together, these results provide new insights into the function of CNNs and RNNs, and demonstrate the utility of using CCA to understand representations."

relevance: "This paper is highly relevant for studying representation geometry and similarity metrics in neural networks. It provides a principled method (PWCCA) to compare embedding spaces across models and training time, addressing invariances to linear transformations. It is particularly useful for analyzing hidden states, representation evolution, and comparing learned representations across architectures."

related_topics:
- "representation similarity analysis"
- "neural network interpretability"
- "embedding space comparison"
- "training dynamics"
- "model generalization"

personal_note: "Important methodological paper for comparing representations; PWCCA improves over SVCCA especially in noisy settings."

---

- Main claim: Neural networks that generalize converge to more similar internal representations than those that memorize, and CCA-based methods can reliably measure this similarity.
- Method: Introduces Projection Weighted CCA (PWCCA), which weights canonical correlations based on their contribution to the original representation, improving over mean-based SVCCA.
- Useful for: 
  - Comparing embedding spaces across models
  - Studying representation evolution during training
  - Understanding hidden state dynamics in RNNs
  - Evaluating similarity across architectures or hyperparameters
- Limits / caveats:
  - PWCCA is a pseudo-distance (non-symmetric)
  - Assumes linear relationships (CCA limitation)
  - Sensitive to preprocessing (e.g., centering, SVD pruning)
  - Does not capture nonlinear similarity well (especially in RNN sequence dynamics)