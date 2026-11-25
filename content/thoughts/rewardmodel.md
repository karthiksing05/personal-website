+++
title = "how to build your reward model"
date = "2026-11-24"
author = "Karthik Singaravadivelan"
cover = ""
description = "what RL can teach us about setting effective direction and finding self-fulfillment"
+++

I've been having a lot of conversations about commitment recently, mostly with friends my age, and they almost always end up in the same place. People are worried all the time about their goals: whether they picked the right major, whether the internship they took is the right internship, whether they're doing the right thing at all, and maybe most stressfully, how they could ever even be sure of that. I feel like this is a very Gen-Z flavor of anxiety, where we have more options than any generation before us and somehow less certainty about any of them. At the same time, I've been thinking a lot about reinforcement learning, both because of how widely applicable it is and because of how popular it has gotten recently, and I keep noticing these weird parallels between how ML algorithms converge and how people explore new opportunities. I wanted to write the connection down, mostly to get it out of my head, and partly because I think it's actually useful.

> The reward of a thing well done is to have done it. *- Ralph Waldo Emerson, American essayist and philosopher*

# background

In my opinion, the real thing underneath all of these conversations is feeling lost, and I think feeling lost comes from two main roadblocks. The first is the choice of what it is you want to do in the first place, which is a whole conversation about purpose that I'll write about in its own post soon (stay tuned). The second, and the one I want to focus on here, is how you know you're making progress once you've started moving, especially when nobody is grading you and the feedback you get is rare, noisy, or straight up contradictory.

I want to give a quick disclaimer before I start: I'm not a psychologist, and I can't speak credibly on how people learn in any clinical sense. Based on my own life experiences, though, and on spending way too many hours staring at loss curves, I'm convinced there is a surefire parallel here somewhere, and I'm going to try my best to pin it down.

# definitions

Reinforcement learning (RL) is a framework for learning by trying things, and it has a few moving parts:
*   **Agent:** the thing doing the learning (for us, a language model).
*   **State and action:** the agent observes the *state* of the world and takes an *action*; for an LLM, the state is the prompt plus everything written so far, and each action is the next token.
*   **Policy:** the rule the agent uses to pick its actions, which for an LLM is just the model itself.
*   **Trajectory:** a full sequence of states and actions from start to finish, like one complete response (also called a *rollout* when the agent is actually going out and generating one).
*   **Reward model:** whatever scores how good a trajectory was, and, as you can probably guess from the title, the piece I care about most.

## the goal of RL

Broadly, the goal of RL is to achieve *generalized* success in some category. The category can be as narrow as multiplication or as broad as all of math, but the contingency of "generalized" success requires that the agent learn the underlying rule rather than memorize the answers it happened to see. In modern LLMs, RL comes after pretraining, and it is designed to make that pretrained knowledge more specialized, i.e., to decide which latent knowledge actually gets leveraged to produce a response.

RL also provides partial success guarantees. Traditional finetuning supports a 1:1 guarantee (here is the input, copy this exact output), whereas a well-chosen RL system grades outcomes, so skills can converge partially and modularly: a model can get much better at setting up a proof before it ever gets good at finishing one, and both of those improvements stick.

Throughout the rest of this, I'm going to use an extended metaphor of studying for a test, because I think everyone has done it, and because I've personally done it in just about every way that the algorithms below do it.

# a tour of reward

## RLHF + PPO

The classic recipe, made famous by InstructGPT ([Ouyang et al., 2022](https://arxiv.org/abs/2203.02155)): first do supervised finetuning on human-written examples, then train a reward model to predict which of two responses a person would prefer, and finally train the model against that reward model with an algorithm called PPO. The problem it attempted to solve is that "good" is really hard to write down as a rule, so instead of writing it down, you learn it from people.

In test terms, this is working through practice problems, showing your answers to a teacher, and slowly building an internal sense of what the teacher is looking for, until you can grade your own work without asking them every time. That internal sense is a reward model, and I'd argue everyone already has one, even if they've never called it that.

## constitutional AI

Constitutional AI ([Bai et al., 2022](https://arxiv.org/abs/2212.08073)) extends RLHF by streamlining how messy it is to garner human feedback. Instead of asking people to compare thousands of responses, you write down a short set of principles (a *constitution*) and have the model critique and revise its own responses against them.

I think this one is so unbelievably cool because we autonomously do this as humans!! At some point while studying, you stop needing the teacher to check every answer, because you've distilled their feedback into a handful of rules: show your work, check the units, reread the question. Those rules are your constitution, and they let you give yourself feedback at a scale no teacher ever could.

## DPO

Direct Preference Optimization ([Rafailov et al., 2023](https://arxiv.org/abs/2305.18290)) skips the separate reward model entirely, and lets the model compute the reward itself straight from preference pairs. The benefit is sample-efficiency and simplicity. The downside is that you get cooked by in-distribution prediction: because DPO only learns from a fixed set of pairs, it knows very little about anything outside of them.

This has a pretty clear human analog in how we don't necessarily holistically rank or regard everything at once. When I'm studying, I'm not scoring every possible way of solving a problem; I'm looking at two approaches and deciding which one feels better, and I find a lot of tractability in making decisions pairwise like that. Careers work this way too, since almost nobody ranks every possible life, but everybody can tell you which of two offers they'd rather take. The catch, just like DPO, is that if you only ever compare the options sitting in front of you, you never learn anything about the ones that aren't.

## REINFORCE

REINFORCE ([Williams, 1992](https://link.springer.com/article/10.1007/BF00992696)) is much older than everything above, and it's the precursor to GRPO, the method behind a lot of today's reasoning models, which has a model grade its own attempts against each other (more on that next). You sample a full trajectory, see how it did, and reinforce every action in it based on whether the outcome beat your average, rather than taking each reward and applying it individually. This works mainly because good outcomes tend to be built out of mostly good steps, so the good steps get reinforced more often than not, even when a few bad ones sneak through.

In test terms, this is getting your exam back with only a final score on it. You don't know which answers lost you points, but if you did better than usual, you assume the way you studied this time was better than usual too, and you lean into it.

## GRPO

Group Relative Policy Optimization ([Shao et al., 2024](https://arxiv.org/abs/2402.03300)) takes that averaging idea and makes it local: for each problem, the model samples a group of its own answers, and each one is rewarded based on how it did relative to the rest of the group. In plain words, we sample from ourselves, weight the better attempts higher, and iterate to better structure our manifold of latent knowledge.

I think this is an extremely useful analog for how humans learn to teach themselves ideas with limited feedback. When I'm stuck on a proof, I'll try three or four different ways of explaining it to myself, and the one that finally clicks becomes the version I remember. Oftentimes, we agree with the rewards that feel more intuitively correct to us, and a reasonable explanation for this is that intuition is exactly that group comparison happening quietly in the background: we judge each new attempt against our other attempts, not against some absolute scale.

## RLVR

Reinforcement Learning with Verifiable Rewards ([Lambert et al., 2024](https://arxiv.org/abs/2411.15124), popularized by [DeepSeek-R1](https://arxiv.org/abs/2501.12948)) is behind most of the recent leaps in LLM reasoning. It throws out the learned reward model wherever you can check the answer directly (did the math come out right, did the code pass the tests), which gives the model a reward that can't be flattered or fooled.

For humans, I think this is inherently a discussion about faith and trust. Very few of our rewards are actually verifiable, so we tend to trust, and sometimes inflate, the value of rewards based on how much we believe in their underlying momentum toward our goal. Generally, we value rewards proportionally to how much we trust that the reward will lead us to our ultimate goal. You may think that we value rewards proportionally to how good they make us feel, but that in itself ties directly back to the fact that achieving goals makes us feel good, in a much more primitive sense. A practice test score feels good because you trust that it predicts the real one; if you found out the practice test was from a completely different class, the exact same number would feel like nothing.

## OPD and MOPD

On-policy distillation ([Agarwal et al., 2024](https://arxiv.org/abs/2306.13649)) has a strong teacher model act as the reward model, grading every single step of the student's own attempt rather than just the final answer. MOPD (multi-teacher on-policy distillation) goes further, with multiple expert teachers distilled into one central model so that it develops all of their capabilities at once.

In test terms, this is a private tutor who watches you work through every problem and stops you the moment you take a wrong turn, and MOPD is having a different world-class tutor for every subject. That's pretty unrealistic for most people (unless of course you are very privileged), but there's still something nice to be taken away here: the most valuable feedback is dense and on-policy, coming from someone watching *you* do the thing rather than showing you their own perfect solution after the fact. Even one good mentor who does this occasionally is worth more than a hundred textbooks with the answers in the back.

# what the tour tells us

Looking at all of these together, I think the broad trend is that RL is slowly moving away from direct references to the real environment and toward *models* of the environment: learned reward models, AI judges, teacher models, all of which are really perception-predictions of what the world would say if you asked it. Real feedback is expensive and slow, so we learn to predict it, and then we learn from the prediction.

There's one important caveat, though, and I'm not sure where best to put it, so I'll put it here. In ML, RL functions by allowing specialization of latent knowledge that already exists, and it's much worse at teaching genuinely out-of-distribution tasks, partly because of a KL penalty that keeps the model tethered to where it started. There's some pretty compelling evidence for this: [Yue et al. (2025)](https://arxiv.org/abs/2504.13837) found that when you give a base model enough attempts, it can solve basically everything its RL-trained version can, and [Shenfeld et al. (2025)](https://arxiv.org/abs/2509.04259) argue that RL forgets less than finetuning precisely because it stays close to the original model. In the real world, I think having the right reward model may come down to acknowledging and accepting that your prior knowledge tells a half-full story, while not letting that degrade you. You start where you start, and that's okay, because RL is about getting the most out of what's already there.

# sparse rewards

Now, I want to begin to discuss the notion of sparse rewards, because I think this is where the parallel gets the most interesting. RL works for LLMs because we have well-structured rewards that allow for fast uptake of the underlying trajectories. Most of the techniques above succeed because a reward can be obtained, at least partially, depending on how successful the solution was, and you can generate thousands of rollouts in an afternoon.

In the real world, rewards are rarely so abundant. You don't get a score every time you have a conversation, or work on a project, or make a decision about what to do next; you might get one big reward (a job offer, a paper acceptance, the feeling of having built something real) after years of trajectories with no signal at all. This means it comes down to us setting effective goals to build up to the large reward, so that we have something smaller to learn from along the way.

I think those smaller rewards matter for more than just learning, too: they're what keep you afloat while you're waiting on the big checkpoints. A model doesn't get discouraged after ten thousand rollouts with no reward, but people absolutely do, and a goal that only pays out once every few years is a goal that most of us will quietly abandon long before it ever pays out. Setting effective direction also gets harder as life goes on, mostly because fulfillment shifts. The things that felt rewarding to me at fifteen (winning a robotics match, getting a model to train at all) aren't the things that feel rewarding to me now, which means the reward model I built back then is slowly going stale, and I have to keep rebuilding it. In ML, we'd call this a non-stationary reward, and it's one of the harder open problems in the field; in real life, I think it's just called growing up.

Additionally, in the real world, we're constantly creating our own informal reward models based on partially informative feedback, and we use those models to guide our behavior and decisions in zero-shot scenarios (i.e., scenarios we've never seen an example of). Nobody has a training set for "should I switch majors in my second year," so you predict the reward, and you act on your prediction.

Thus, I maintain that the best way to evolve and grow is to focus hard on developing your reward model under a central North Star, and to learn to trust that reward model strongly.

# so, how do you build a reward model?

Here's my current best attempt at an answer, built from everything above.

*   **First, and hardest, pick a goal.** Reward models operate under the pretense that you have already decided what it is you want to do. However, fear not even if you haven't picked one yet. We know from cognitive science that skills transfer: as far back as 1949, Harry Harlow showed that monkeys who solved many different problems of the same type got faster at solving brand new ones, which he called forming a *learning set* ([Harlow, 1949](https://doi.org/10.1037/h0062474)). In engaging in the process of learning and growth, even if the specific skills you learn end up not mattering because of a complete career pivot, you are still learning *how* to learn, and that carries over everywhere.
*   **Borrow verifiable rewards from other people.** From RLVR, we learn the value of a reward you can actually check. Most of us don't have a verifier for our lives, but other people's lives are the closest thing we've got. Read, read a ton, and soak up lessons and generalizations of lessons. None of this may stick with you right away, which is why I've left a list of readings at the bottom you can absolutely investigate to confirm (or refute) any of this for yourself. Find examples of people who got where you want to go, and do what they did.
*   **DO SOMETHING.** RL assumes that you are actually taking actions! You HAVE to try stuff out and correct your reward model based on what happens. In a related vein, you can never get a high reward if you never stumble across the answer, so in everyone's reward model, there has to be a reward for exploration itself. This is already a well-adopted strategy in AI (entropy bonuses, epsilon-greedy sampling, and so on) to keep models from a) converging to the first answer they find, and b) never finding an answer, period.
*   **Reflect like GRPO.** Metacognition has huge value here, and reflecting intentionally is hard but fulfilling. The strategy I've borrowed from GRPO is to try a few different things for the same problem, compare them against each other honestly, assign each one a reward, and let that comparison guide my future rollouts. I think comparing against your own other attempts is so much healthier than comparing against someone else's highlight reel.
*   **Don't reward hack.** In ML, reward hacking is when a model finds a way to score highly without actually doing the thing the reward was meant to capture. As a human, I think reward hacking looks like optimizing for external reward rather than internal motivation: the title, the follower count, or the grade, rather than the skill. Learning the generalization of the rule is harder, but it leads to much better abstraction in the long run. This is also why it is crucial to think deeply about setting a reward that enables positive growth, rather than one that regresses you into someone else's identity. Wanting to learn skills X, Y, and Z is a good goal, because it has the potential to generalize. Wanting to be like person A, who happens to have skills X, Y, and Z, is a worse goal, because it restricts your ability to generalize to exactly one person's path.

# q.e.d.

I get asked a lot why I study both CS and psychology, and the honest answer roots deeply in this exact dichotomy. In CS, I have found answers about myself, and in myself, I have found answers about CS. One of my research advisors would probably argue that RL isn't true learning at all, just pedantic optimization against a number, and I understand where that view comes from, but I can't help disagreeing with it holistically, because some things just make so much more sense from this perspective.

I want to close on what I think is still unsolved, both in RL and in learning in general, because perhaps the answer is in ourselves. In my opinion, the final frontier for RL is test-time continual learning: learning that keeps happening after deployment, the kind that stimulates evolution rather than just refinement. One of the continuities across every method I described above is the KL penalty, which is there to keep training stable by keeping the model close to who it already was. For true evolution, it seems like we'll need to abandon that penalty in favor of one that allows us to become more than who we are, while still retaining all the right parts of who we were. I don't know what that looks like for a model yet, and I'm not sure I know what it looks like for a person either, but I think figuring it out is the most worthwhile thing I could spend my reward on.

*- Karthik*

# further reading

*   Richard Sutton and Andrew Barto, [*Reinforcement Learning: An Introduction*](http://incompleteideas.net/book/the-book-2nd.html) (2nd ed., 2018), the textbook, free online.
*   Nathan Lambert, [*RLHF Book*](https://rlhfbook.com/), a really approachable walkthrough of everything in the tour above.
*   David Silver et al., [Reward is Enough](https://doi.org/10.1016/j.artint.2021.103535) (Artificial Intelligence, 2021), the boldest version of the argument that reward maximization alone could explain intelligence.
*   Ouyang et al., [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) (2022).
*   Bai et al., [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (2022).
*   Rafailov et al., [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) (2023).
*   Shao et al., [DeepSeekMath](https://arxiv.org/abs/2402.03300) (2024), where GRPO comes from.
*   DeepSeek-AI, [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025).
*   Thinking Machines, [On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/) (2025).
*   Yue et al., [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?](https://arxiv.org/abs/2504.13837) (2025).
*   Shenfeld et al., [RL's Razor: Why Online Reinforcement Learning Forgets Less](https://arxiv.org/abs/2509.04259) (2025).
*   Harry Harlow, [The Formation of Learning Sets](https://doi.org/10.1037/h0062474) (Psychological Review, 1949).
