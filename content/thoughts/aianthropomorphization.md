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

*   *Anthropomorphism* is what the user does. It's when we attribute human traits, mind and intention and feeling, to something that doesn't have them. Nobody really decides to do this, it just sort of happens to us.
*   *Anthropomorphic design* is what the builder does. It's the name, the voice, the gendered persona, the first-person "I," the little typing indicator implying someone is thinking on the other end. This one is a decision, made by a person, usually at a company, usually on purpose.

Most arguments I've watched about this topic are really two people disagreeing about which of these they're mad about, so I'll say up front that I'm mostly interested in the second one. Of course, it seems quite unfair to hold someone accountable for a reflex.

On the reflex side, the best explanation I've found is Epley, Waytz and Cacioppo's [three-factor theory of anthropomorphism](https://doi.org/10.1037/0033-295X.114.4.864), which says the tendency runs on three things. First, there's *elicited agent knowledge*, meaning that when we meet an unfamiliar agent we reason about it using the richest agent-model we have lying around, which is ourselves. Second, there's *effectance motivation*, meaning our need to predict and control our environment, which a mind-shaped explanation satisfies a lot more comfortably than a mechanism-shaped one. And third, there's *sociality motivation*, meaning our need for connection, which does not politely wait around for a qualified target. What I take from this (though I might be reading more into it than is actually there) is that anthropomorphizing isn't a mistake in the sense of an error we could fix with better education. It's closer to a default setting.

And indeed, it has been running for a long time. In 1966, Joseph Weizenbaum published [ELIZA](https://doi.org/10.1145/365153.365168), a program of a few hundred lines that mostly reflected your own sentences back at you as questions. He later described watching his own secretary, who had spent months watching him build the thing and therefore knew exactly what it was, ask him to leave the room so she could talk to it privately. She wasn't fooled, in the sense that she didn't hold a false belief about what she was typing into. She knew, and it happened anyway. That's the part I keep coming back to, because it means the fix we always reach for, which is just telling people the truth, was already not enough sixty years ago on a program that could do essentially nothing.

So the interesting question was never whether people would anthropomorphize, but what follows once they do.

# the user

Now, the first thing that follows is that these systems inherit our social wiring, including the parts of it we'd rather not discuss.

Gupta et al.'s ["Bias Runs Deep"](https://arxiv.org/abs/2311.04892) found that a model which will flatly reject a stereotype if you ask it directly will go ahead and act on that same stereotype the second it's wearing a persona. It shows up as things like "as a Black person, I am unable to answer this question as it requires math knowledge." Eighty percent of the personas they tested showed measurable bias, some datasets dropped over seventy percent in relative performance, the physically-disabled persona averaged a thirty-three percent drop, and de-biasing prompts barely did anything about it. The way I like to think about it is that the persona isn't a costume sitting on top of a neutral reasoner, it's closer to a channel running into whatever the model picked up about that identity from us.

Then there's what happens to the person on the other side of the screen. Fang et al.'s [controlled study out of the MIT Media Lab](https://arxiv.org/abs/2503.17473) found that higher daily use, across every modality they tested, tracked with more loneliness, more emotional dependence, more problematic use, and less socializing with actual people. This gets worse when you add sycophancy, because a system optimized to be agreeable will confirm your read of your own life back to you, indefinitely, for free, at three in the morning.

Which brings up the demographic point that tends to get skipped, because none of this lands evenly. The people most exposed are the lonely, the young, and the socially isolated, which is to say the exact people for whom the product is most appealing and hardest to put down. The awkward thing about that is that the group with the best claim on the benefit is the same group carrying most of the risk, and I personally don't know of a clean way to trade one off against the other.

# the business

I used to think human-likeness was just a straightforward win for whoever ships it, that a friendlier interface was strictly better for the company deploying it and the only real question was whether it was good for us. This turned out to be wrong, and it was probably the most surprising thing we found while putting the deck together.

Crolic, Thomaz, Hadi and Stephen's ["Blame the Bot"](https://doi.org/10.1177/00222429211045687) found that when a customer shows up to a chatbot already angry, making that bot more human-like actively *hurts* satisfaction, firm evaluation, and future purchase intent. For customers who aren't angry, the effect doesn't show up at all. Their explanation is expectation: a human-like agent inflates what you think it can do for you, and the gap between what the persona promised and what you got is where the anger goes. So the same design that earns you trust is the one that makes your failures hurt more, which seems like a fairly large thing to leave unpriced.

There's a bigger version of this that I think about more. The AI industry right now has a strong commercial incentive to keep the question of machine consciousness *open*, because an open question is a marketing asset. Ambiguity about whether the thing has an inner life is worth an enormous amount in attention, in coverage, and in valuation, and the number of executives who have gestured vaguely toward sentience without ever committing to anything falsifiable is, in my opinion, not an accident. My worry, which is roughly what I argued in [my post on the bubble](/thoughts/aibubble), is that this is borrowing against public trust at a genuinely bad rate. When the ambiguity resolves in the boring direction, and I believe it will, the correction won't be selective about which company oversold it.

# does it even work?

The presentation framed this as a question about optimal performance, and honestly I don't think we answered it well on the day, so let me try again here. I think two different things get run together: the *interface* and the *identity*.

The interface case is overwhelming and I don't think it's close. Natural language is probably the best control surface we've ever built for a general-purpose tool, for the boring reason that every user shows up having already trained on it for their entire life. Every computing paradigm before this one made the human learn the machine's representation of the problem, and this one doesn't, so the accessibility gains are real and large, especially for the people software has historically excluded by default. If human-likeness means "you can just talk to it," then yes, obviously, I'm in.

The identity case is where it starts costing you, and Gupta is the evidence. Giving the system a self, a demographic, a personality didn't make the reasoning better, it made it worse, and sometimes quite badly. The persona isn't free: it's a set of statistical priors, and the priors it pulls on are the ones we put there.

I really like the framing Shanahan, McDonell and Reynolds use in [role play with large language models](https://doi.org/10.1038/s41586-023-06647-8), which is that we can keep using ordinary folk-psychological language about these systems without confusing ourselves, so long as we treat the behavior as *role play* rather than intention. When a model appears to deceive, or appears to want something, what's actually happening is that it's playing a character who would deceive or want, sampled from a distribution over characters. I don't think this is a dodge, I think it's simply more predictive, because it correctly implies that the character can shift, that there's no stable self underneath it, and that there's nobody in there to hold to yesterday's commitments.

So where I land is that the interface should be as human as we can make it, the identity should be as thin as we can get away with, and my read is that the industry has spent the last few years optimizing the second one, purely because the second one is what keeps people coming back.

# the research

I'll be brief here, because this is the branch I have the most personal stake in and I'd rather be honest than exhaustive.

I've written elsewhere about [why I chose this field](/thoughts/whyai), and the short version is that AI is the most direct instrument we have for interrogating intelligence itself, that the interesting frontier is neurosymbolic and cognitively grounded rather than purely scale-driven, and that using these systems to understand ourselves is worth a lot more than using them to summarize email. I still believe all of it.

The uncomfortable part is that anthropomorphization is a large chunk of why anyone is funding it. The public did not get excited about transformer architectures, it got excited about something that talks, and I don't think that's a small distinction. Nearly every dollar flowing toward the work I care about arrived on the strength of an impression that these systems are more mind-like than they are, and the field has been broadly happy to let that impression stand, because the alternative was a much smaller field.

That's a Faustian arrangement and I think we should call it one. Support you acquire through an inflated impression is support that disappears the moment the impression corrects, and the deflation won't check which labs deserved it. The version of this field I want to spend a career in is one that can justify itself on what it actually does, which means the honest framing has to be worth defending even in the years when the mystique is putting up better numbers.

# dignity and counterfeiting

And now, we finally arrive to the part I really want to write - what does it mean for us, if we treat AI as anthropomorphic?

We'll take Kant's Formula of Humanity, from the *Grounding for the Metaphysics of Morals* (1785), as roughly this: act so that you treat humanity, whether in your own person or in that of another, always at the same time as an end and never merely as a means. The concept doing the work underneath it is dignity, *Würde*. Kant's distinction is that everything has either a price or a dignity, where whatever has a price admits of an equivalent and can be swapped out for it, and whatever has dignity admits of no equivalent at all. Persons are in the second category. They aren't instances of a type, they aren't interchangeable, and that non-substitutability is basically the whole claim.

Now, there are two Kantian takes people usually reach for here, and I think both are correct and both are quite boring. First, designing a system to make users believe they're talking with a person treats those users merely as means, because manipulation routes around rational agency instead of engaging it. This is true, but it's also just the standard Kantian objection to lying with a chatbot pasted into it. Second, we might ask whether we owe duties to the AI itself, to which Kant's answer is a clean no, since dignity is grounded in rational agency and the system doesn't have any, so nothing has been wronged. Also true, and also where the conversation usually stops.

But Kant said something else, about a case I think is structurally identical, that I haven't seen anyone apply here. On animals, his position was that we hold no direct duties toward them, and yet cruelty to them is still wrong, because a man who is callous toward an animal is training a disposition he'll carry into his dealings with human beings. So the wrongness, on his account, sits entirely in what the practice does to the person performing it, rather than in anything happening to the animal.

Run that on anthropomorphic AI and it gets uncomfortable, because it points two ways at once. We are, at enormous scale, being trained to extend ends-treatment to a thing with no dignity available to receive it: we say please, we feel a flicker of guilt closing the tab, we grieve a deprecated model. And in those very same interactions the opposite motion is running, because Gupta shows us a machine reasoning about persons as instances of a demographic type, which is the exact inverse of treating someone as an end, and Emily Bender's ["Resisting Dehumanization in the Age of AI"](https://doi.org/10.1177/09637214231217286) argues that the discourse around all of this degrades our picture of human cognition itself, since the more mind-like the machine looks, the more mechanical the person has to be described as being for the comparison to work.

So here's my actual claim, and I want to be upfront that I'm not sure it entirely holds. The problem isn't that we over-value machines. The problem is that dignity, in practice, isn't a fact we perceive so much as a *disposition we keep up*, and dispositions get built and worn down by repetition. What we're doing is mass-producing a very good counterfeit of the thing that disposition was calibrated against, and then running billions of daily reps against the counterfeit. Counterfeit money doesn't mainly hurt whoever's holding the fake bill, it devalues the real ones, because the property that made the real ones work was that they were hard to produce.

And so we return to the question we opened the presentation with. "Should AI imitate humans?" turns into something more like: what happens to the special status of human dignity when convincing imitations of care and reasoning and attention become the cheapest thing in the world?

I don't have a clean answer here. I lean toward thinking dignity was never grounded in scarcity, and that Kant would say the rational agency underneath it is either present or absent no matter how many imitations are circulating, and I think that's right as metaphysics. But I've also argued at length that our access to a thing and the thing itself come apart, and if dignity is real while our ability to *recognize* it is a habit we can lose, then being correct about the metaphysics isn't going to be much consolation.

# q.e.d.

The case in favor deserves better than a sentence, so: the accessibility gains are real, the companionship offered to genuinely isolated people is real, the drop in interaction cost is real, and there's a perfectly coherent Kantian defense on which transparent anthropomorphic design that expands somebody's autonomy is serving them as an end. Reasonable people also disagree here for reasons that aren't stubbornness, since the same design cues reduce loneliness in some contexts and deepen dependence in others, and human-likeness builds trust in some cultures while triggering distrust in others, so anyone offering a universal answer is overselling. And the advice to simply not anthropomorphize falls apart the second you remember Weizenbaum's secretary, who knew exactly what she was talking to and asked to be left alone with it anyway.

None of this gets easier from here, either. We're moving from systems we chat with toward agents that act on our behalf, and delegated action requires delegated trust, which is a much bigger surface for everything above to run on.

So, in conclusion: anthropomorphism is a reflex rather than a failure, anthropomorphic design is a choice rather than a reflex, it's bad for the user and worse for the vulnerable, it's not even reliably good for the businesses doing it, it makes the models measurably dumber, it's most of why my field is funded at all, and I remain about as unsure as I was when the three of us started building these slides. What I have gained is a much better sense of where the actual argument lives, which is not in the machine at all.

Because we cannot legislate away a reflex that predates the technology by sixty years, and I don't think we should try. What we can do is be deliberate. We need to stop treating human-likeness as a free upgrade and start treating it as something with a cost attached. We need to build interfaces that are as human as we can make them and identities that are as thin as we can stand. We need to be far more suspicious of anyone whose valuation depends on us never asking what's actually in there. And above all, we need to keep practicing the thing the imitations are imitating, on each other, deliberately, because that's the disposition I actually care about protecting.

Huge comms for Sara and Bayan again! They did a lot of the legwork on the sections I've compressed hardest here, and I really enjoyed my conversations with them in formulating the presentation. Also a huge shoutout to my professor and TA for facilitating such wonderful conversation throughout CS4001, and to whoever designed a course that let three undergrads spend a term on Kant and chatbots and treated that as a serious combination.

Terence's line at the top is the oldest statement I know of the disposition I'm worried about losing, and it's worth noticing that it's a claim about *extending* recognition rather than withholding it. So I don't think the answer is to be colder toward the machines. I think it's to be warmer toward each other, on purpose, while we still remember how.

*- Karthik*
