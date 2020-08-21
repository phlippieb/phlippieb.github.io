---
layout: post
title: "Four ways to win at software development"
comments: true
tags: []
---

_Taking cues from general strategies about winning, and applying them to software development_

todo: intro
can add something about "Ways" in the monk/dnd sense here

Are you winning? 

This can be a vague question with regards to our work as software developers, but in that vague sense, you probably have an answer. 
The notion of winning is as old as time, timeless even, and is applicable to all the eternal struggles of humanity, ranging from friendly games to deadly wars. 
Naturally, there are countless wisdoms relating to winning
-- wisdoms, strategies, approaches and pieces of advice that have stood the test of time. 
Why not see what we can draw from those, and apply to our day jobs?

In the sections below, I will discuss four different pieces of advice, each taken from a different context where winning is the goal.
Each of these contexts teaches us a lesson about success, which can also be applied to software development.
These lessons will henceforth be referred to as The Four Ways. 

May the Four Ways bring you oneness your craft.

Boet.

---

# The Way of Git Gud

The first strategy is the most obvious, but it's worth talking about anyway.
Not a reference to the version control system, the Way of ["Git Gud"](https://knowyourmeme.com/memes/git-gud) is taken from online gaming. 
It is simple: in order to win, thou shalt put in the time and get better.

- the importance of experience
- practicing on the job
- deliberate practice
- practical ways to apply this

# The Way of the Bumpers

The loss of innocence for me was the day I was too old to play ten-pin bowling with the bumpers on. 
Before that moment, I was carefree.
It didn't matter that my aim was abismal; the bumpers kept the ball on track, and it would eventually hit something. 
But with the bumpers taken away, there were suddenly consequences. 
If I missed, I missed. 
My mistakes _counted_.

On the one hand, once you get better at bowling, the consequences become part of the game. 
It wouldn't much be fun if you couldn't lose!
After you've sunk a few balls into the gutter, hitting on-target becomes _rewarding_.
But on the other hand, not everything we do _needs_ to be ultra risky.
Sometimes it would be good if we could strike out on a venture and be confident that failure, or at least catastrophic failure, is impossible.

The Way of the Bumpers is essentially about winning by cheating.
When you follow this Way, you attempt to guarantee that you will win by making it impossible to lose.

- using language features (or linting as stopgap), testing, CI to eliminate certain types of errors
- see if I can find that tweet from uncle bob about how languages do not eliminate errors; it had some good responses to the contrary
- are there other ways to follow this Way? can't think of any right now.

# The Way of Separa

The battlefield is, for better or for worse, perhaps the best judge for evaluating a particular winning strategy.
When wars have been won and lost by adherence to some words of wisdom, surely it deserves our attention.
And perhaps the most famous strategy to follow when waging war, endorsed by Niccolò Machiavelli, followed by Julius Caesar, advocated for by Immanuel Kant, and is still widely used today, is this:

Divide ut regnes. Separa et impera. Divide and rule.

The advice works well in warfare, politics, sports, and many other situations of conflict, for obvious reasons.
When faced with a single enemy, your chance of success is directly correlated to how formidable that foe is.
Break the enemy up, divide them into factions, and each part now only poses a fraction of the original threat.
Find a way to deal with each faction one-by-one -- or better yet, turn them against one another -- and you have converted a single epic battle into a few easy ones.

In The Way of Separa, we refuse to face our problems as single, united adversaries.
Instead, we break them down into multiple smaller battles, which are easily overcome.

- even more effective in software dev because, once divided, we are guaranteed the luxury of dealing with each problem one by one, on our own time.
- break features and bugs down into components (also good for the problem of estimation)
- psychological aspect -- feel like you're winning, not fighting
- early victories yield lessons that help in subsequent battles
- also applies down to the level of algorithms, e.g. quicksort
- also applies to architecture -- a system of distinct modules is easier to (what's the phrase for bringing something unruly under controler?) than a monolithic system where everything is in the same scope
- even the pomodoro technique


# The Way of the Tortoise

When I first heard the tale of [the hare and the tortoise](https://www.shortstoriesforkids.net/stories-for-kids/the-tortoise-and-the-hare/), I didn't buy it.
The tortoise won because the hare took a nap.
So what?
It was fluke!
Had the hare demanded a rematch, I was sure the tortoise's defeat would have been so devastating, it would have to have changed schools.

But now I'm beginning to understand that it is not the lesson -- slow and steady wins the race -- that is at fault here.
The tale of the hare and the tortoise is simply not a very good fable.
I propose that we use an updated story to get the point across:
the tale of the [Scott and the Amundsen](https://www.history.com/news/the-treacherous-race-to-the-south-pole). 
It goes like this.

A long time ago, there were two explorers named Robert Falcon Scott and Roald Amundsen.
They decided to have a race to lead the first expedition ever to reac the South Pole.
But while they were headed to the same place, their journeys were quite different.
Scott tried to win by going as fast as possible, everything considered:
on days when his team was well-rested, when there was good weather and terrain, he pushed hard and covered a lot ground.
But on days when they were tired, or the weather was poor, or the path was difficult, they took it slow, or even stayed in camp for the day.
Amundsen, on the other hand, knew his team and what they were capable of, and determined that they could cover 20 miles a day.
And so they did.
On good days, when they could have easily pushed further, they stopped after 20 miles.
And on bad days, even though they had to push hard to make it, they pushed for 20 miles.
Amundsen won, and Scott died on his way back.

The real story is far more nuanced, but as a fable, I think this telling succeeds at getting the entire point across.
It's not just _slow_ that wins the race.
It's slow and _steady_.

The Way of the Tortoise is to prioritise consistency.
It is to be as slow as you have to, to be steady.

While the real story of Scott and Amundsen is not so black-and-white that it boils down to how far each team marched every day, the general idea behind "20 mile marches" is solid. 
For example, consistency is a pretty good predictor of whether a business will succeed or fail.
Things like innovation, creativity, and adaptability play their role, but [Collins and Hansen](https://www.jimcollins.com/books/great-by-choice.html) found that what really makes the difference -- especially when the going gets tough -- is having a plan, and then sticking to it with unwavering, fanatic discipline. 
Similarly, any financial advisor worth their salt will tell you to invest consistently over a long period of time; 
even with small amounts, consistent deposits are far more effective than sporadic, large contributions to your savings.

We can easily take take too much comfort in this wisdom, by focusing more on the _slow_ than the _steady_.
Consistency is difficult. It means that we must push to deliver on our bad days.
It is only towards that end that it makes sense to hold back on our good days;
we should take things easy when things are easy in order to gather strength for they are not.

- what does this look like in dev?
- take care of you mental health and energy
	- jb rainsberger
- be conservative with estimates, and take care of your technical debt, to avoid crunches
- keeping a balanced sprint? if work is important, try to make a little progress every sprint
- micro habits for non-main work

# Conclusion

todo