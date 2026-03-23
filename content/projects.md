+++
author = "my inspiration and incentive for life itself"
title = "projects"
+++

> The work is its own reward. *— Sir Arthur Conan Doyle, British writer and physician*

# ongoing efforts

### *[2025-06-11 - present]* WEBSTER @ [ISLE](http://www.isle.org/) | [github](https://github.com/karthiksing05/Chunking-Cobweb)
- Cobweb is a symbolic algorithm that aggregates instances into "concepts" and forms a hierarchy over these instances - it is unsupervised, piecemeal, and incremental, making it a comprehensive model of human learning. I am currently working with Dr. Pat Langley to implement the Cobweb algorithm in a proposed theoretical framework to model psychological "chunking" for efficient parsing, storage and retrieval of concepts based on a set of defined relations. Most recently, we presented our work at the [Computation and Cognition Conference](https://coco.psych.gatech.edu/coco-conference-2026/) (2026), and are actively working towards a finalized theory.

### *[2025-06-01 - present]* Cobweb in Retrieval and Summarization of Language @ [TAIL](https://tail.cc.gatech.edu/) | [github](https://github.com/Teachable-AI-Lab/RAG-Cobweb)
-  (see notes on Cobweb in my work with [ISLE](projects/#---cobweb-for-psychological-chunking--isle--github)) I am currently leading an independent study under Dr. Chris Maclellan in creating a robust, industry-sustainable neurosymbolic solution to utilizing language in agentic systems, using Cobweb as the primary algorithm. Our work takes on two main applications to modern semantic embedding analysis.
- Our first approach is retrieval-aligned - we show that Cobweb performs as a strong search algorithm for dense vector representations, matching performance of traditional systems while offering strong intermediary prototypes. Our [paper](http://www.cogsys.org/proceedings/2025/paper-2025-8.pdf) conducts a preliminary study which not only qualified the efficacy of Cobweb as a search algorithm but also showed its ability to utilize different data forms.
- Our more recent approach aimed to leverage the clustering nature of Cobweb in a field that benefits from both the incremental and hierarchical nature of Cobweb - topic-modeling. We show that Cobweb utilized as a topic model sets a new SOTA in the hierarchical and incremental fields, proving a sustainable way to continuously track topic evolutions and have recently submitted to ACL (paper soon!).

### *[2025-08-27 - present]* Encoding Model & Topographic Constraints development @ [LIT Lab](https://www.language-intelligence-thought.net/)
- Recently, I joined Professor Anya Ivanova and began contributing to the development of encoding models, models that can convert latent content that represents stimuli into direct voxel representations of brain states, measured by fMRI data. This project places large emphasis on model interpretability, with the goal of running large studies with brain simulations inspired by encoding models if they become successful.
- Currently, I'm working on furthering topographic constraints in neural architectures for gains in performance and compute, and to pass on some of the blessings of continual learning to all architectures - specifically, how topography can improve diversity and sparsity constraints to reduce catastrophic forgetting and improve diversity of activations. The brain has a phenomenon called *categorical selectivity*, the idea that neurons in closely related areas behave similarly, and inducing this constraint in deep learning models can lead to some exciting results.

---

# past projects

### *[2025-01-17 - 2025-04-17]* SimplyPhi @ [WISC](https://sleep-and-consciousness.wisc.edu/) | [github](https://github.com/karthiksing05/SimplyPhi)
- I did volunteer work for Dr. Larissa Albantakis on a theory called Integrated Information Theory, an information-theoretic framework that attempted to calculate the distributed "consciousness" of the theory. I used IIT to evaluate the performance of neural networks as a saliency test, identifying the most relevant parts of the network under the "substrate of consciousness" defined by the framework.
- While IIT is an extremely assuming framework to attribute to consciousness, as a metric of "usefulness" by analyzing the distributed information across a system, it has a lot of play, and I look forward to seeing information theory take greater prominence in shaping the field of ML interpretability.

### *[2023-08-27 - 2025-05-25]* DuluthGPT @ Duluth High School | [github](https://github.com/karthiksing05/duluthgptv2)
- At my high school, our student body's ratio of participation to population was disproportionately small, and through my work with student leadership, I discerned part of the gap to be due to a decentralized bank of resources - conflicting information and not a single place to easily access everything. So, I created DuluthGPT, an LLM agent that scraped and added data from athletics websites, extracurricular Instagrams, and the student body themselves, and was able to quickly answer fast Q+A with a basic RAG pipeline.
- In addition to answering over 3,000 queries and increasing student engagement by 10% as measured by customer surveys, we were able to analyze results by measuring the frequency of topics asked about, highlighting AI's useful two-way value proposition in consumer interaction.

### *[2024-06-18 - 2024-07-16]* AI-for-Advertising @ [GA GHP '61](https://gosa.georgia.gov/governors-honors-program) | [github](https://github.com/karthiksing05/sd3dblora_finetune)
- I attended the Georgia Governor's Honors Program for Computer Science in my junior year, where I had the pleasure of launching a mock-startup and conducting research under my advisor. Over the term, I wrote a piece on the application of finetuning diffusion models for the advertising industry based on user demographic and , with the broader social commentary of introducing profitable AI research into the research space before industry so that it could be appropriately regulated.
- My paper was accepted to the Applied Human Factors and Ergonomics Conference, but I was unfortunately unable to attend due to another commitment. Paper can be viewed [here](https://drive.google.com/file/d/1Gn6mnmxkvGaBaOAdVu16wN3FsUyRCiVS/view?usp=sharing)!

### *[2020-08-27 - present]* 8ball | [github](https://github.com/karthiksing05/8ball)
- My first full-production machine learning pipeline was applied to the stock market. I used an XGBoost pipeline, tuned with my [Biaswrappers](/projects/#---biaswrappers--github), and finetuned predictions using sentiment analysis on Reddit, X, Google News, and Yahoo Finance investor analysis. My goal was to use the momentum of prior stock movements and current news sentiment to analyze the trends of future stock predictions by OHLC, and my framework, though generally performing worse or equal to day-to-day predictions, had some highly successful calls with returns of up to 30%-40% for stocks that weren't mainstream.

### *[2021-09-27 - 2024-02-05]* BiasWrappers | [github](https://github.com/karthiksing05/biaswrappers)

- My first machine learning project and independently published paper to a preprint archive! A brief foray into classical forms of regularization on linear regression, including two of my own attempts at unsupervised regularization with respect to the data distribution. The python package currently stands at ~32k downloads!
- Paper can be viewed [here](https://www.techrxiv.org/users/741672/articles/713955-on-biaswrappers-new-regularization-techniques-for-machine-learning-regression), Python Package can be viewed [here](https://pypi.org/project/biaswrappers/)!
