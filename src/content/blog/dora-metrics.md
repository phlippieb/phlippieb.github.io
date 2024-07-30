---
title: DORA metrics — How competitive is your delivery pipeline?
published: 2023-07-28
tags: []
listed: true
excerpt: So you think your team is good at delivering value for your clients. Maybe you even consider yourself elite. But how sure are you? How do you measure it?
---
*This post was originally published on [Retro Rabbit](https://retrorabbit.co.za)*

---

So you think your team is good at delivering value for your clients. Maybe you even consider yourself elite. But how sure are you? How do you measure it?

This post is about a set of four carefully chosen metrics, called the DORA metrics. They’re an industry standard of DevOps-related performance metrics. If your team scores well on them, that’s a good indication that you’re well positioned to generate value.

## Background

DORA, or DevOps Research and Assessment, is a startup founded by Dr Nicole Forsgren, Gene Kim, and Jez Humble. This is the group that brought us of Accelerate, a wildly important book presenting findings of their excellent research on the specific capabilities that factor into a company’s success. Through this meticulous research, DORA has identified a neat set of metrics that strongly indicate how well a team performs with DevOps, which in turn indicates how well-equipped they are to deliver value.

It may sound like these metrics are mainly concerned with DevOps, and that is correct. There are many, many other capabilities that factor into success. But the importance of an efficient delivery pipeline can hardly be overstated, and is a good place to start if you want to assess your team’s value. Why? You could have a team of ultra-gifted engineers churning out hundreds of miracle features a day, but that won’t matter if that code doesn’t end up in customers’ hands. What we build is only real once real people get to use it.

## The metrics

In short, the metrics are:

- Deployment frequency
- Lead time to changes
- Change failure rate
- Mean time to recovery

For each metric, we’ll cover what it is, what to aim for, why it matters, and how to improve your performance.

## Deployment frequency

This metric is exactly what it sounds like: how frequently do you deploy? Or put differently: on average, how often do the changes that your engineers produce end up in customers’ hands?

Deploying weekly is considered standard. Elite teams deploy several times a day.

This metric is important because deployments are the distinct events that stand between the work your engineering team does, and the value it delivers to customers. If they’re infrequent, they act as a bottleneck that prevents you from providing actual value.

In his work on Systems Thinking, Kent Beck also highlights a potential self-reinforcing loop around deployment frequency. With a higher frequency, each deployment contains a smaller set of changes, which translates to a less risky deployment. This increases confidence in the deployment process, which can easily lead to even more frequent deployments. Contrarily, with a lower frequency, each deployment contains more changes and poses a higher risk, making everyone more nervous about it. This will likely cause the cycle to become even longer, leading to even more infrequent deployments.

There are some subtleties, though.

For one, with feature flags, we are able to deploy code to production without immediately exposing it to all our production users. From the DORA metric point of view, this is not cheating — in fact, it is encouraged to deploy code “dark” (toggled off) and still count it towards your frequency.

Another one: how does this apply to mobile application development? Mobile deployments are severely throttled by app store submission processes, especially on iOS. An obvious approach is to simply adjust your target frequency accordingly — what is high for web development is unobtainable for mobile, so aim a little lower. Another approach is to redefine “deployment” — getting a test build out via a distributor like Bitrise or Firebase could also count towards your frequency. The danger with this is, of course, that a seemingly high frequency would not actually translate into value for real clients.

How do you improve it? The standard approach is to add more automation around your deployment processes.

## Lead time to changes

Here, we measure the time from the moment that a line of code getting committed, until the moment it is deployed.

Good teams average between a day and a week. Elite teams can get committed code into production within hours.

The importance of this metric is, again, that it indicates how quickly your team can produce value. Long lead times have an associated opportunity cost — if you write good code, but it takes very long to end up in production, then there is a big stretch where your client could be making money off your code, but isn’t.

There’s also an inverse concern, sort of: longer lead times translate to longer-lived defects. You can have a fix locked and loaded, but the bug isn’t actually fixed until your code hits production.

You can get this time down by using more automation in your deployments (which, as said above, improves your deployment frequency); by increasing automation in your *review* process as well; and by subdividing your products and features so that changes to individual features can be deployed independently of other changes.

## Change failure rate

Getting changes into production as quickly as possible sounds great, but does that mean you should optimise for this time at the cost of quality? Obviously, no — we’re still aiming to deliver *value*. This metric tracks the fraction of deployed changes that result in “failures,” such as bugs, regression defects, or crashes.

For standard teams, 15% to 45% of changes result in failure. For elite teams, this is less than 15%, but notably, never zero. In fact, we don’t aim for zero! That would just create a culture that actively discourages experiments. And experiments are good.

Without this metric, the first two would justify a runaway decline in quality. This metric ensures that the code that makes it into prod is generally good enough that we continue to provide real value.

Another interesting benefit of this metric is that it indicates the fraction of time your team spends fixing defects, as opposed to implementing new features. The less you deal with fires in production, the more valuable new things get created.

Naturally, you can improve your team’s score on this metric by writing better quality code. That means investing in technical debt, automated testing, code reviews; the usual suspects.

## Mean time to recovery

Having touched on defects, the next metric is concerned with recovery. Once a failure is reported, on average, how long does it take your team to do something about it? Note that “doing something” doesn’t necessarily mean “deploying a fix,” and a good way to improve your performance here is to improve your ability and preparedness to do rollbacks, or to toggle off defective features.

Most teams recover in a matter of days. Elite teams can recover in less than an hour.

The value here should be apparent. The longer a team takes to recover from a defect, the more opportunity it has to negatively affect your user’s experience, and your client’s value.

## Last thoughts

What happens when we measure things? Usually, when we track our performance along a certain dimension, we tend to make changes so that our performance improves. These four metrics were carefully chosen by DORA as key indicators of a team’s capability to provide real value to clients. By measuring them, and making them visible to stakeholders and especially to the team being measured, and reflecting on them, you should naturally start to see an increase in value.

 Introducing this into a project can be overwhelming, though. A good rule of thumb is to introduce one metric at a time. Then encourage the team to do experiments with practices that might improve their performance; you now have real data to back up the results, even to stakeholders.