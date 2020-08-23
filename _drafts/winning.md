---
layout: article
title: "Four ways to win at software development"
comments: true
tags: []
---

_Taking cues from general strategies about winning, and applying them to software development_

Are you winning? 

This can be a rather vague question with regards to our work as software developers, but in that vague sense, you probably have an answer. 
The notion of winning is timeless, and has been applicable to all the struggles of humankind through the ages, ranging from friendly games to deadly wars.
Naturally, there are countless wisdoms relating to winning -- 
strategies, mindsets, and words of advice that have stood the test of time.
Why not see what we can draw from those, and apply to our work in the software world?

In the sections below, I will discuss four different pieces of advice, each taken from a different context where winning is the goal.
Each of these contexts teaches us a lesson about success, which can also be applied to software development.
These lessons will henceforth be referred to as The Four Ways. 

May these Four Ways of Winning bring you oneness and harmony in your craft.

# The Way of Git Gud

The first strategy is the most obvious, but it's worth talking about anyway.
Not a reference to the version control system, the Way of ["Git Gud"](https://knowyourmeme.com/memes/git-gud) is taken from online gaming. 
It is simple: in order to win, you must put in the work to get better.

## Practice and learning

Practice is obviously important.
Practice makes perfect -- we all know this.
You can basically guarantee your success as a developer by following Malcolm Gladwell's famous recipe: just add 10,000 hours of practice.

Learning is equally important.
You probably find yourself working in a fast-paced, contuously-changing industry.
You might not be interested in every new programming language or plugin that comes out, but even if your environment or tech stack is highly specialised, you can probably benefit from at least _some_ of the breakthroughs or insights to be had in other fields.
If you plan to Git Gud, it pays to keep learning.

## ... On the job

Despite the importance of continuous practice and development, chances are that you don't do much of it outside your day job.
Our jobs can be very demanding, and it is understandable that we don't have any interest in doing more of it when we get home.

<!-- TODO -- feels like a good point, but doesn't work here.
You might have been sent out for training a few times.
I have, and I was blown away by the positive impact it had on my work.
But training is expensive and we don't do it very often. 
-->

So many of us simply practice on the job.
But the job doesn't make for very good practice.
Of course it doesn't.
There are real-world constraints, deadlines, expectations and priorities to take into account.
You don't have much freedom to try out new things, persue tangential interests, or grok concepts that will not directly advance your sprint tickets.
Failure, which is so integral to learning, is to be avoided in the context of work.
And the project you work on has its own, specific way of doing things, so any practice that you get mostly just makes you better at working on that project.

## Extra credit

If you want to Git Gud, you need some extra practice and learning.
There are many ways you can do this, and you are almost guaranteed to benefit from anything that you do.
For practice, you can do [Code Katas](http://codekata.com/), get involved in open source software, and work on side projects for starters.

And for continuous learning, online courses can be good -- they have inherent structure to guide you through the content. 
But depending on your goals and interests, an entire course [might be overkill](https://www.influencive.com/why-no-one-finishes-online-courses). 
Instead of trying to become a specialist in a single field parallel to your job, I suggest that you just keep on learning many different, small things --
by reading.
Read a lot.
Find good weekly developer blogs, browse Medium, follow interesting developers on Twitter, subscribe to newsletters, join subreddits.
If it puts new information and perspectives on your horizon that you would not have found during the course of your normal workday, read it.

## Balance

The Way of Git Gud is difficult, because it demands that you _add_ to your workload.
If you have the dedication and energy to do so, then good.
Most likely though, you will need to find a way to work The Way into your work-life balance, lest burnout rear its ugly head.

In the best case scenario, your workplace might see the benefit in letting you carve out some time for regular practice.
After all, everyone benefits if it makes you a better developer.
[Some companies](https://www.inc.com/adam-robinson/google-employees-dedicate-20-percent-of-their-time-to-side-projects-heres-how-it-works.html) have made this a part of their culture;
depending on what your workplace is like, you might be able to introduce it into yours.

If not, you might be able to work _some_ practice and learning into your normal schedule.
Waiting for a slow compiler?
Blocked until the development server comes back up?
Normally take a few minutes to browse the internet while you have coffee in the morning?
There are often little gaps in the day; see if you can fill them with reading.
If not, you could argue that a few minutes of reading a day -- even if it's not directly related to your current ticket, or even project -- has its own long-term benefits that make you a better developer for the rest of the day.

Similarly, while you should definitely not use every new tech stack, architecture or design pattern that you read about on your main project, you might occasionally see an opportunity to try something you have learnt about in the code you're writing.
It might not be the fastest way to finish the current feature or fix the bug, but it could lay the groundwork for a better codebase down the line.

Lastly, if you're not able to get the benefit of practice without putting in extra hours, it is up to you to decide how much time you are willing to give.
Every bit helps;
you don't have to code deep into the early hours every night.
I find that I have occasional bursts of motivation where I enjoy working on side projects.
I like to ride out those waves to get some practice or experience in something that interests me.
Sometimes I end up with a repo that I can show off on my Github page, and sometimes I just gain a little perspective.
Then, when my motivation has dissipated, I simply stop.
By doing this a few times a year, I follow the Way of Git Gud.

TODO: this section could use more links to branch out from some of the ideas

# The Way of Bowling with the Bumpers On

The loss of innocence for me was the day I was too old to play ten-pin bowling with the bumpers on. 
Before that moment, I was carefree.
It didn't matter that my aim was abismal; the bumpers kept the ball on track, and I was almost guaranteed to hit something.
But with the bumpers taken away, there were suddenly consequences. 
If I missed, I missed. 
My mistakes _counted_.

On the one hand, once you get better at bowling, the consequences become part of the game. 
It wouldn't much be fun if you couldn't lose!
After you've sunk a few balls into the gutter, hitting on-target becomes _rewarding_;
the taste of failure gives meaning to success.

But on the other hand, not everything we do should have that risk.
Wouldn't it be good, in some cases, if we could be confident that failure, or at least catastrophic failure, is impossible?
In particular, work is different from play;
when someone is paying, our mistakes have an associated cost.
If we can elminate the very possibility of making certain mistakes, why wouldn't we?

The Way of Bowling with the Bumpers On is about winning by cheating.
When you follow this Way, you attempt to guarantee that you will win by making it impossible to lose.

We do this by making certain types of mistakes impossible. Here follows some ways to achieve that, ordered from most to least robust.

## Leverage type systems

Type systems make certain types of errors impossible.
(reference replies to this tweet by uncle Bob: https://twitter.com/unclebobmartin/status/1135894377329508355)

some type systems (dependent types) can define behaviour, which means that the compiler can eliminate certain types of incorrect behaviour.
look for examples; I have a feeling NonEmpty is one

value objects can be used to forbid interactions between certain concepts that shouldn't interact by default;
i think e.g. creating a type for time in milliseconds prevents you from accidentally adding it to seconds,
or like we have different types of keys for networks; representing them with different types makes them non-interchangable

check out for more:
https://twitter.com/fmarreco/status/1136763543615938562

## Make invalid states unrepresentable

enums rather than ints

- type safety eliminates 
- limiting functions to only take valid inputs
- using language features (or linting as stopgap), testing, CI to eliminate certain types of errors
- are there other ways to follow this Way? can't think of any right now.

# The Way of Separa et Impera

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
