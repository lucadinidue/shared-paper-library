---
title: "Why not to use Cosine Similarity between Label Representations"
date: 2026-03-30
draft: false

authors:
- "Beatrix Nielsen"

year: 2026
venue: "arXiv"
publication_type: "preprint"
arxiv: "2603.29488"
doi: ""
source_url: ""
pdf: "https://arxiv.org/pdf/2603.29488"
code: "https://github.com/bemigini/cosine-sim-not-informative"

tags:
- "embedding-similarity"

keywords:
- "cosine similarity"
- "softmax classifier"
- "unembeddings"
- "translation invariance"
- "representation analysis"

reading_status: "to-read"
priority: 2
date_added: 2026-03-30
date_read:

summary: "The paper shows that cosine similarity between label representations (unembeddings) in softmax classifiers does not reflect model behavior. Due to translation invariance, equivalent models can produce identical probabilities while having arbitrarily different cosine similarities. The author proves that similarities can be forced to −1 or 1 without changing outputs. This disconnect challenges the use of cosine similarity for interpreting model predictions."

abstract: "Cosine similarity is often used to measure the similarity of vectors. These vectors might be the representations of neural network models. However, it is not guaranteed that cosine similarity of model representations will tell us anything about model behaviour. In this paper we show that when using a softmax classifier, be it an image classifier or an autoregressive language model, measuring the cosine similarity between label representations (called unembeddings in the paper) does not give any information on the probabilities assigned by the model. Specifically, we prove that for any softmax classifier model, given two label representations, it is possible to make another model which gives the same probabilities for all labels and inputs, but where the cosine similarity between the representations is now either 1 or −1. We give specific examples of models with very high or low cosine simlarity between representations and show how to we can make equivalent models where the cosine similarity is now −1 or 1. This translation ambiguity can be fixed by centering the label representations, however, labels with representations with low cosine similarity can still have high probability for the same inputs. Fixing the length of the representations still does not give a guarantee that high(or low) cosine similarity will give high(or low) probability to the labels for the same inputs. This means that when working with softmax classifiers, cosine similarity values between label representations should not be used to explain model probabilities."

relevance: "Highly relevant for representation geometry and similarity metrics: it formally demonstrates that cosine similarity between output embeddings (unembeddings) is not aligned with model probabilities. This challenges common interpretability practices in embedding space analysis, especially for LLM output layers."

related_topics:
- "representation invariances"
- "softmax geometry"
- "embedding similarity pitfalls"
- "model interpretability"

personal_note: "Important negative result—useful caution when interpreting cosine similarity in output spaces."

---

- Main claim: Cosine similarity between label representations (unembeddings) in softmax classifiers is not informative about model probabilities.
- Method:
  - Formal proof exploiting translation invariance of softmax logits.
  - Constructive lemmas showing cosine similarity can be arbitrarily set to −1 or 1 without affecting outputs.
  - Empirical toy examples (Fig. 1–2, pages 2–5) illustrating equivalent models with drastically different cosine similarities.
- Useful for:
  - Understanding limitations of similarity metrics in embedding spaces.
  - Interpreting output layers of LLMs and classifiers.
  - Research on representation geometry and invariances.
- Limits / caveats:
  - Focuses only on unembeddings (output representations), not hidden states.
  - Does not rule out usefulness of cosine similarity in other contexts (e.g., input embeddings).
  - Assumes standard softmax classifier formulation.