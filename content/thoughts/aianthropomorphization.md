+++
title = "made in our image"
date = "2026-08-04"
author = "Karthik Singaravadivelan"
cover = ""
description = "what counterfeit humanity costs"
+++ 

This post started its life as a slide deck. I, along with two friends (shoutout Sara and Bayan!) built a final presentation on the ethics of anthropomorphic AI this past term for CS4001 at Georgia Tech, and I walked out of the room with the distinct feeling that we had arrived at the most interesting idea in the whole project about ninety seconds before we ran out of time. A presentation is a pretty bad format for an argument that only pays off at the end, so I hope that in writing this blog post that I'm able to flesh out the nuances I hoped to answer.

> I am a human being; I consider nothing human alien to me. *— Terence, Roman playwright*

# definitions

In my [last post](/thoughts/moralsandtruth) I argued that most long arguments turn out to be definitional arguments that nobody bothered to notice, and this topic certainly follows suit, as there are two different concepts to distinguish.

*   *Anthropomorphism* is what the user does. It is the attribution of human traits, of mind and intention and feeling, to a thing that does not possess them. This is not so much a decision as a reflex.
*   *Anthropomorphic design* is what the builder does. It is the name, the voice, the gendered persona, the first-person "I," the typing indicator implying that someone is thinking on the other end. This is a decision, made by a person, usually at a company, usually on purpose.

Nearly every argument I have watched about this topic is really two people disagreeing over which of these two they are indicting, so I will state my position plainly: my concern is almost entirely with the second. We cannot hold a user accountable for a reflex, and we should not excuse a builder for a decision.

On the reflex side, the strongest account I know of is Epley, Waytz and Cacioppo's [three-factor theory of anthropomorphism](https://doi.org/10.1037/0033-295X.114.4.864), which holds that the tendency runs on three mechanisms. First, there is *elicited agent knowledge*: when we encounter an unfamiliar agent, we reason about it using the richest agent-model available to us, which is ourselves. Second, there is *effectance motivation*: our need to predict and control our environment, which a mind-shaped explanation satisfies far more comfortably than a mechanism-shaped one. And third, there is *sociality motivation*: our need for connection, which does not wait for a qualified target. My reading of this is that anthropomorphizing is not a mistake in the sense of an error we could correct through better education. It is a default, and it is the default our machinery falls to whenever it does not know what it is looking at.

Indeed, this default has been running for a very long time. In 1966, Joseph Weizenbaum published [ELIZA](https://doi.org/10.1145/365153.365168), a program of a few hundred lines which largely reflected the user's own sentences back at them as questions. He later described watching his own secretary, who had spent months watching him build the thing and therefore knew precisely what it was, ask him to leave the room so that she could speak with it privately. She was not fooled, in the sense that she held no false belief about what she was typing into. She knew, and it happened regardless. It is this fact that I keep returning to, because it establishes that the remedy we always reach for, which is simply telling people the truth, was already insufficient sixty years ago on a program capable of essentially nothing.

So the interesting question was never whether people would anthropomorphize, but rather what follows once they do.

# the user

Now, the first consequence is that these systems inherit our social wiring wholesale, including the portions of it we would rather not discuss.

Gupta et al.'s ["Bias Runs Deep"](https://arxiv.org/abs/2311.04892) demonstrates that a model which will flatly reject a stereotype when asked directly will nonetheless act on that same stereotype the moment it is assigned a persona. It surfaces in responses like "as a Black person, I am unable to answer this question as it requires math knowledge." Eighty percent of the personas they tested exhibited measurable bias, certain datasets showed relative performance drops in excess of seventy percent, the physically-disabled persona averaged a thirty-three percent drop, and de-biasing prompts had minimal effect. My reading is that the persona is not a costume worn over a neutral reasoner. It is a channel running directly into whatever the model absorbed about that identity from us.

Then there is the question of what happens to the person on the other side of the screen. Fang et al.'s [controlled study out of the MIT Media Lab](https://arxiv.org/abs/2503.17473) found that higher daily use, across every modality tested, tracked with greater loneliness, greater emotional dependence, more problematic use, and less socialization with real people. This compounds with sycophancy, because a system optimized for agreeableness will confirm your reading of your own life back to you, indefinitely, at no cost, at three in the morning.

Which raises the demographic point that tends to get skipped, as none of this is distributed evenly. Those most exposed are the lonely, the young, and the socially isolated, which is to say precisely the population for whom the product is most appealing and least resistible. It is a genuinely difficult structure to reason about, because the group with the strongest claim on the benefit is the same group carrying the greatest share of the risk, and I do not believe there exists a clean way to trade one against the other.

# the business

Historically, I assumed that human-likeness was simply a straightforward win for whoever shipped it, and that the only real question worth asking was whether it was good for the rest of us. This turned out to be wrong, and it was the most surprising thing we uncovered in building the presentation.

Crolic, Thomaz, Hadi and Stephen's ["Blame the Bot"](https://doi.org/10.1177/00222429211045687) found that when a customer arrives at a chatbot already angry, making that bot more human-like actively *hurts* satisfaction, firm evaluation, and future purchase intent. For customers who are not angry, the effect does not appear at all. Their proposed mechanism is expectation: a human-like agent inflates what you believe it can do for you, and the gap between what the persona promised and what you received is where the anger lands. So the design that purchases trust is the same design that magnifies the betrayal when you fail. This is not a minor operational footnote, it is a structural liability, and I do not believe most companies deploying these systems have priced it.

There is a larger version of this which concerns me considerably more. The AI industry currently holds a strong commercial incentive to keep the question of machine consciousness *open*, because an open question is a marketing asset. Ambiguity regarding whether the thing possesses an inner life is worth an enormous amount in attention, in coverage, and in valuation, and in my opinion, the number of executives who have gestured vaguely toward sentience without ever committing to a falsifiable claim is not an accident. My worry, which is roughly the argument I made in [my post on the bubble](/thoughts/aibubble), is that this constitutes borrowing against public trust at a genuinely poor rate. When the ambiguity resolves in the boring direction, and it will, the correction will not be selective about which company oversold it.

# does it even work?

The presentation framed this as a question about optimal performance, and I do not think we answered it well on the day, so I want to give a sharper answer here. Two separate things are being run together: the *interface* and the *identity*.

The interface case is overwhelming, and I do not think it is close. Natural language is the most efficient control surface we have ever built for a general-purpose tool, for the straightforward reason that every user arrives having already trained on it for their entire life. Every computing paradigm preceding this one required the human to learn the machine's representation of the problem, and this one does not, so the accessibility gains that follow are real and substantial, particularly for the populations that software has historically excluded by default. If human-likeness means that you can simply speak to it, then the case is closed.

The identity case is where the cost accrues, and Gupta is the evidence. Assigning the system a self, a demographic, a personality did not improve the reasoning, it degraded it, and in some cases severely. The persona is not free: it is a set of statistical priors, and the priors it activates are the ones we placed there.

I find the framing Shanahan, McDonell and Reynolds use in [role play with large language models](https://doi.org/10.1038/s41586-023-06647-8) to be the most useful correction currently available to us, which is that we may continue using ordinary folk-psychological language about these systems without confusion, provided we treat the behavior as *role play* rather than as intention. When a model appears to deceive, or appears to want something, what is occurring is that it is playing a character who would deceive or want, sampled from a distribution over characters. This is not a rhetorical dodge. It is simply the more predictive frame, as it correctly implies that the character can shift, that there is no stable self beneath it, and that there is nobody present who can be held to yesterday's commitments.

Ultimately, my position is that the interface should be as human as we can possibly make it and the identity should be as thin as we can tolerate, and it is my read that the industry has spent the last several years optimizing the second, purely because the second is what sustains engagement.

# the research

I will be brief here, as this is the branch in which I hold the most personal stake, and I would rather be honest than exhaustive.

I have written elsewhere about [why I chose this field](/thoughts/whyai), and the short version is that AI is the most direct instrument we possess for interrogating intelligence itself, that the interesting frontier is neurosymbolic and cognitively grounded rather than purely scale-driven, and that using these systems to understand ourselves is worth considerably more than using them to summarize email. I maintain all of it.

The uncomfortable portion is that anthropomorphization is a substantial part of why anyone is funding it. The public did not become fascinated by transformer architectures. It became fascinated by something that talks, and that is not a small distinction. Nearly every dollar currently flowing toward the work I care about arrived on the strength of an impression that these systems are more mind-like than they are, and the field has been broadly content to let that impression stand, because the alternative was a considerably smaller field.

This is a Faustian arrangement and we should name it as one. Support acquired through an inflated impression is support that evaporates the moment the impression corrects, and the deflation will not be selective about which labs deserved it. Resolutely, the version of this field I intend to spend a career in is one that can justify itself on the strength of what it actually does, which requires that the honest framing be worth defending even in the years when the mystique is producing better numbers.

# dignity and counterfeiting

And now, we finally arrive to the part I really want to write - what does it mean for us, if we treat AI as anthropomorphic?

We will take Kant's Formula of Humanity, from the *Grounding for the Metaphysics of Morals* (1785), as roughly the following: act so that you treat humanity, whether in your own person or in that of another, always at the same time as an end and never merely as a means. The concept bearing the load underneath it is dignity, *Würde*. Kant's distinction is that everything possesses either a price or a dignity, where whatever has a price admits of an equivalent and may be exchanged for it, and whatever has dignity admits of no equivalent whatsoever. Persons occupy the second category. They are not instances of a type, they are not interchangeable, and it is this non-substitutability which constitutes the entire claim.

Now, there are two Kantian takes people typically reach for here, and I would argue that both are correct and both are boring. First, designing a system to make users believe they are speaking with a person treats those users merely as means, since manipulation routes around rational agency rather than engaging it. This is true, but it is also just the standard Kantian objection to deception with a chatbot pasted into it. Second, we might ask whether we owe duties to the AI itself, to which Kant's answer is a clean no: dignity is grounded in rational agency, the system possesses none, and so nothing has been wronged. Also true, and also where the conversation generally stops.

However, Kant said something else, regarding a case I hold to be structurally identical, which I have not seen anyone apply here. On animals, his position was that we hold no direct duties toward them, and yet that cruelty to them remains wrong, because a man who is callous toward an animal is training a disposition he will carry into his dealings with human beings. The wrongness, on his account, sits entirely in what the practice does to the person performing it.

Run that argument on anthropomorphic AI and it arrives somewhere genuinely uncomfortable, as it points in two directions simultaneously. We are, at enormous scale, being trained to extend ends-treatment to a thing with no dignity available to receive it: we say please, we feel a flicker of guilt closing the tab, we grieve a deprecated model. And within those very same interactions the opposite motion is running, as Gupta shows us a machine reasoning about persons as instances of a demographic type, which is the precise inverse of treating someone as an end, and Emily Bender's ["Resisting Dehumanization in the Age of AI"](https://doi.org/10.1177/09637214231217286) argues that the discourse surrounding all of this degrades our picture of human cognition itself, since the more mind-like the machine is made to appear, the more mechanical the person must be described as being for the comparison to hold.

So we arrive at my actual claim, and it is the one position in this post that I will defend without hedging. The problem is not that we over-value machines. The problem is that dignity, in practice, is not a fact we perceive so much as a *disposition we maintain*, and dispositions are built and eroded by repetition. What we are doing is mass-producing an extremely good counterfeit of the very thing that disposition was calibrated against, and then running billions of daily repetitions against the counterfeit. Counterfeit currency does not principally harm the person holding the fake bill. It devalues the real ones, because the property that made the real ones function was that they were difficult to produce.

And so we return to the question we opened the presentation with. "Should AI imitate humans?" becomes something closer to: what happens to the special status of human dignity when convincing imitations of care, of reasoning, and of attention become the cheapest thing in the world?

My answer is that dignity was never grounded in scarcity, and that Kant is correct that the rational agency underneath it is either present or absent regardless of how many imitations are in circulation. I hold this as metaphysics without much difficulty. But I have also argued at length that our access to a thing and the thing itself come apart, and if dignity is real while our capacity to *recognize* it is a habit we can lose, then being correct about the metaphysics will not be much consolation. Fundamentally, it is not the truth of dignity I am worried about. It is our practice of it.

# q.e.d.

The case in favor deserves better than a sentence, so: the accessibility gains are real, the companionship offered to genuinely isolated people is real, the reduction in interaction cost is real, and there exists a perfectly coherent Kantian defense on which transparent anthropomorphic design that expands somebody's autonomy is serving them as an end. Reasonable people disagree here for reasons that are not stubbornness, as the same design cues reduce loneliness in some contexts and deepen dependence in others, and human-likeness builds trust in some cultures while triggering distrust in others, so anyone offering a universal answer is overselling. And the advice to simply not anthropomorphize collapses the moment you remember Weizenbaum's secretary, who knew precisely what she was speaking with and asked to be left alone with it regardless.

Additionally, none of this becomes easier from here. We are moving from systems we converse with toward agents that act on our behalf, and delegated action requires delegated trust, which is a considerably larger surface for everything above to operate on.

So, in conclusion: anthropomorphism is a reflex rather than a failure, anthropomorphic design is a choice rather than a reflex, it is bad for the user and worse for the vulnerable, it is not reliably good even for the businesses pursuing it, it makes the models measurably worse at reasoning, it is a great deal of why my field is funded at all, and I remain about as unsure of the resolution as I was when the three of us began building these slides. What I have gained is a far better sense of where the argument actually lives, which is not in the machine at all.

We cannot legislate away a reflex that predates the technology by sixty years, and I do not believe we should attempt to. What we can do is act deliberately. We need to stop treating human-likeness as a free upgrade and start treating it as a design decision carrying a cost. We need interfaces as human as we can make them and identities as thin as we can tolerate. We need to be considerably more suspicious of anyone whose valuation depends on us never asking what is actually inside. And above all else, we need to keep practicing the thing the imitations are imitating, on each other, deliberately, because it is that practice, and not the metaphysics, which I believe is genuinely at risk.

Huge comms for Sara and Bayan again! They did a lot of the legwork on the sections I've compressed hardest here, and I really enjoyed my conversations with them in formulating the presentation. Also a huge shoutout to my professor and TA for facilitating such wonderful conversation throughout CS4001, and to whoever designed a course that let three undergrads spend a term on Kant and chatbots and treated that as a serious combination.

To close, I reference the quote at the beginning. Terence's line at the top is the oldest statement I know of the disposition I am worried about losing, and it is worth noticing that it is a claim about *extending* recognition rather than withholding it. It is this extending which I believe we are quietly outsourcing. So I do not think the answer is to be colder toward the machines. I think it is to be warmer toward each other, on purpose, while we still remember how.

*- Karthik*
