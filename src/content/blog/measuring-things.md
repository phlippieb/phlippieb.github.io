---
title: Measuring things is magic
published: 2024-03-18
tags: []
listed: true
excerpt: Measuring things that we can influence, and making those metrics visible, tends to encourage us to perform well at those things. We can use this in our professional environment to improve our teams’ performance at certain important capabilities. But remember that it's important to measure the right things
---
*This post was originally published on [Retro Rabbit](https://retrorabbit.co.za) as a write-up for a talk I was meant to give at our internal conference, RR.conf*

---

## Background

If you track your runs on Strava, or count glasses on WaterLogged, you're already familiar with the idea that something happens when we measure things. Taking regular measurements around certain behaviours seems to help us continue and improve those behaviours — by acting as a reminder that this is something we're interested in continuing or improving, and by giving us positive feedback that motivates us to keep going, and also by giving us a baseline for performance the next time we engage in the activity in question. If I know I managed four sets of bench presses last week, that automatically becomes a target for my workout this week.

We know this works in our personal lives. So let's look at how this concept translates to a software consultancy context, and how we can use it to maximise value for our clients.

## Measuring Things is Magic

The central idea is that measuring things that we can influence, and making those metrics visible, magically makes us perform better along those metrics. We can guide our teams to deliver more value along key dimensions by carefully tracking those dimensions and feeding back the metrics to the team.

There are some important things to note.

1. **Sphere of control:** This concept will obviously only work for things that our team can at least influence. Measuring the weather every day is nice, but a team of frontend devs won't be able to make it sunny.
2. **Tight feedback loop:** It matters how quickly a team can get feedback on their performance. Ideally we want it to be continuous. And ideally we want the metrics to be updated automatically; this is a good use case for automation!
3. **Collaboration or competition?** There is something to be said for the old management technique of pitting two highly motivated teams against one another to motivate them to perform better. However, for this post, I'm only looking at how we can internally guide teams to work together to add more value.
4. **Intervention when required:** Despite the title of this post, things might not always work magically. If you don't see the desired improvement along a key metric, it's time to dig in and figure out why.

If you're familiar with key performance indicators (KPIs), then you've probably realised that this post is, in fact, about KPIs. Do not despair! KPIs sometimes get a bad rap in lean and trendy workplaces, but that's more to do with *what* gets measured; the central concept is quite sound. For example, measuring lines of code is clearly a bad way to coax good software out of a team (it says nothing about the quality of the code, and in fact a valuable refactor could easily reduce the number of lines in a codebase). This doesn't mean that we shouldn't measure things! We should just be clever about what we measure.

## What can we measure?

Let's see some examples of metrics that, when introduced into a team, might help us drive more value.

### ... In Software

Possibly the most talked-about metrics for software developers right now are the group of so-called DORA metrics. I've already [written about them here](/posts/dora-metrics), so I won't go into detail again. In short, they're a group of DevOps-oriented metrics that can guide teams to massively improve their to deliver high-quality software to customers at competitive speed. The metrics are deployment frequency, lead time to changes, change failure rate, mean time to recovery, and reliability (which was added to the group recently, and measures proportion of time that a system meets predetermined goals in terms of availability, performance, and accuracy).

If your team is already using the DORA metrics and you're looking for more, you can look into the capabilities outlined in [Accelerate by Nicole Forsgren et al](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339). Some examples of capabilities to measure are:

- Test data management
- Empowered teams
- Customer feedback
- Monitoring
- Collaboration among teams

### ... In Design

As a software developer, I don't have such a clear concept of which metrics and capabilities would best drive value within UX design teams, so I had a conversation with some of my colleagues to come up with some ideas. These are perhaps more like starting points for further conversation than direct suggestions.

We can try to track the quality of our user experience resulting from a team's designs by measuring the percentage of tasks that users complete successfully. This requires us to continually define user tasks, and for the product to record the analytics required to track users completing those tasks. The idea is that, if we see an improvement in this percentage, it indicates that our team's efforts result in a more usable product.

We can also use survey ratings, if those surveys are set up with UX-relevant questions. For example, after a user completes a tasks, a survey might ask them about the experience, with options such as "intuitive", "confusing", and so on.

Note that this isn't about measuring the usability of individual features; it's a way to get feedback about the *overall* quality of our design work. This can then act as data when we experiment with processes and procedures within the team; for example if we have a baseline of customer experience satisfaction, and we can show that more user testing raises that baseline, that tells us that user testing is working.

## Implementing it

If you want to introduce these concepts in your team, the most important thing is going to be to select your metrics carefully. Work out what capabilities are the most important to improve upon, and which metrics will most accurately convey the team's performance back to them.

Beyond that, here are some tips.

1. **Start small:** Introduce just one metric at a time, give the team time to make the numbers go up and build some confidence. Then try adding another.
2. **Create Visibility:** Create a dashboard or anything similar that makes sense for the metric and for your team. Make sure the team can see their own performance. Review it regularly, e.g. during standup or sprint review.
3. **Brag:** Make the metrics visible to stakeholders (e.g. product owners) as well. If the team makes the line goes up, make sure that the higher-ups are aware of your achievements.
4. **Debug:** If the line doesn’t go up, take steps to figure out why that is. Talk about it with your team. What problems are at play? What can we do to deal with them?

## Conclusion

Measuring things that we can influence, and making those metrics visible, tends to encourage us to perform well at those things. We can use this in our professional environment to improve our teams’ performance at certain important capabilities. But remember that it's important to measure the right things!
