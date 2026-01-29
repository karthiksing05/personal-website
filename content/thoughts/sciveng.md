+++
title = "the impossible and improbable"
date = "2026-01-29"
author = "Karthik Singaravadivelan"
cover = ""
description = "a thought experiment on science and engineering"
+++

This post started out of a discussion with a PI in one of my labs (thank you Chris!) and since then I've been ruminating on a thought experiment that I believe encapsulates the fundamental debate we were having. I hope that this discussion will stimulate thinking in my generation, as, on average, I see a lot of engineers and not as many scientists. As you'll see in the discussion section of this blog post, both are important, and neither can truly function without the other.

> Science is about knowing; engineering is about doing.  *— Henry Petroski, American engineer and author*

# the question

Suppose you are a doctor and your job is to treat a patient with a never-before-seen disease that you know, based on the current track of the symptoms, will kill them in 24 hours. You have the following options:

*   You can give the patient a "miracle cure" at any given point before the 24 hours has expired.
    *   This miracle cure was given by divine intervention, reveals nothing about the nature of the illness, and cannot be used more than once, replicated, or analyzed. It simply works, with no further rhyme or reasoning.
    *   This miracle cure can be used within any time of the 24 hours, and has a chance of success inversely proportional to the amount of time elapsed. For example, if you use the miracle cure after 70% of the time has passed, it only has a success rate of 30% (so it will succeed three out of ten times).
*   You have the option to delay the cure to perform more studies to better understand the nature of the disease. I'm no biologist, but assume that for the percentage of time you agree to investigate the patient, you learn that percentage of knowledge regarding the disease.
    *   For instance, if you study the patient for 12 hours, you understand about 50% of all things there are to understand regarding the disease.

So there is a clear tradeoff between the amount of time spent studying the patient and the amount of time remaining to save the patient. The primary question, naturally, is this: how long do you let the patient live with the disease before you give them the miracle cure? Do you give them the miracle cure at all?

# clarifications

Here I list some clarifications with the thought experiment. Note that as this experiment was designed at a dinner table within ten minutes, there are obvious holes with my reasoning, but these clarifications should hopefully help you understand the essence of this question.

*   Of course doctors have an obligation to rescue their patient, but try to consider this question as someone who is both a servant to their patient and a servant to the broader scientific community. Don't ask what the doctor would do, ask what *you* would do in this situation.
*   Try to consider the ethical ramifications of your first instinct. Too many people I asked immediately sided with the option of curing the patient immediately, to which I responded, "What happens if another person suffers the same disease?
*   Assume (at first) that the patient wholeheartedly agrees with whatever decision you take, so the decision is truly up to you.
*   Again, I'm not sure how "understanding X% of all things regarding the disease" really works, but assuming some probability-based outcome generation, I assume that "understanding X% of all things regarding the disease" = "X% chance of generating our own cure for this disease in the future". 

I'll add more clarifications here most likely as more people prompt me about the question, so do contact me with any of your own thoughts!

# extensions

Below I list some extensions to the original thought experiment.

1. Suppose you are not a doctor, but the creator of a product that introduces this disease to a single person. You don't know that this introduction is deterministic, but you do know that the product is the sole cause of the disease. However, your product is also widely useful and has extended promising implications for the human race. How does your opinion of what to do about the patient change?
2. Suppose you must answer this question as the patient. How does your perspective of the scenario change?
3. Finally, consider that you are once again the doctor, and the tradeoff now changes. Suppose at the end of the 24 hours, you can only understand a maximum of 50% of all possible information about the disease: how does your judgement change based on this final upper bound?
4. This thought experiment is phrased as a one-off: however, consider an extended experiment. How would you feel if you had to encounter this scenario once a week, but every week, in addition to learning some percentage of understanding for that respective disease, you build a medical domain knowledge that could allow you to solve diseases with higher probability in the future?
5. As another extension beyond the one-off, assume that you can repeatedly use the miracle cure, but each week, you encounter a new disease that is 10% more different than the prior week's disease as a result of some mutation. As the new disease is 10% more different, the miracle cure will have a 1% less chance of working off the bat: so after 1 year, the miracle cure will only be successful with a probability of 48%. How many weeks do you wait before trying to understand the patient at the risk of killing them (if at all)?

These are the only three extensions I've come up with so far, but the idea is to change the variables of the experiment to prompt a change of identity. I hope that in delving into these extensions, you come up with nuanced reasoning and potentially investigate multiple avenues of rationale.

# discussions

NOTE: try not to read this until you've thought deliberately about the question and the extensions - the reveal may surprise you.

This question is not easy, and of course, depends vastly on the agenda of the person answering the question. I pose this question as a commentary on the difference between science and engineering. One party is obsessed with identifying a working solution, while the other is obsessed with analyzing the problem. Both are important - neither can exist without the other - and both must be validated as necessary by society if we are to advance as a community. As Petroski said in the quote I left at the beginning, science is about knowing and engineering is about doing. If we are to advance the frontier of humanity, we need to know and do.

Over the past several years, especially following the rapid rise of modern AI, this balance has shifted. Historically, many of the most visible technological successes came from engineering-heavy industries: consumer electronics, automotive systems, medical devices, and large-scale infrastructure. These advances rested on decades of scientific discovery, but the public and institutional rewards overwhelmingly favored the tangible outcome—the product, not the underlying understanding. Engineering became the visible hero; science became an invisible prerequisite.

With AI, this imbalance intensified rather than corrected. Computer science and adjacent fields increasingly prioritize benchmark performance, leaderboard rankings, and marginal metric improvements. Studies have shown that a large fraction of top-tier machine learning papers introduce incremental modifications to existing architectures rather than new conceptual frameworks (Lipton & Steinhardt, 2019). Even reproducibility has suffered: multiple audits of AI research have found that a significant portion of published results cannot be reliably replicated without undocumented tuning or proprietary resources.

This shift has consequences. When research incentives reward speed, scale, and surface-level gains, creativity and long-term understanding are crowded out. The replication crisis seen in psychology and biomedicine is now echoed in AI, where dataset contamination, benchmark overfitting, and post-hoc explanations are increasingly common. Industry-driven timelines and funding structures further reinforce this pattern, favoring immediate deployment over foundational clarity. The result is an ecosystem that produces more papers, more models, and more “results,” but less durable knowledge.

Changing this trajectory requires a cultural correction, not just technical fixes. Scientific research must once again value explanation, negative results, and slow progress toward understanding—not merely performance gains. Engineering research must resist the urge to treat every problem as an optimization task detached from theory. Institutions, conferences, and funding bodies play a decisive role here: when incentives shift, behavior follows. 

This is a call to act deliberately. Scientists and engineers must lean into their differences rather than compete for dominance. Engineering needs science to remain grounded and scalable; science needs engineering to remain relevant and testable. Progress is not measured by how fast we move, but by how well we understand where we are going.

*- Karthik*