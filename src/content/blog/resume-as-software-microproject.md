---
title: The resume as a software micro-project
published: 2024-05-03
tags: [html, css, project management]
listed: true
excerpt: The process of producing a CV to apply for a role is a lot like releasing software to production. Rather than being a once-off assignment, the content of a CV is quite fluid. Experience and skills get added, yes, but furthermore, each job application requires you to cater the resume to appeal to the specific job.
---
## A new CV

The interesting thing about starting up a new CV from scratch, as with any fresh document, is that you get to think anew about *how* to write it. It's hard to even begin to write something before you've decided which platform or software or system to write it *in*. 

It's been about 8 years since I last made a CV and even back then, I was a proponent of [separating content from representation](https://ben.balter.com/2014/03/31/word-versus-markdown-more-than-mere-semantics/#separating-content-from-presentation); my last CV was a LaTeX source file from which I generated PDFs. 

This time, I wanted something even simpler to edit, and wondered if I could straight-up use [Markdown](https://hiltmon.com/blog/2012/02/20/the-markdown-mindset/), which I already use for most things. So I dug around, and I was satisfied that it could work: I could write my content in (mostly) Markdown (with some HTML as needed), and then use `pandoc` and `wkhtmltopdf` to render it down to a PDF document, applying my own CSS to style it to my liking.

## A software project is born

Here I realised that this little ecosystem is quite similar to a traditional software project, if at a microscopic scale. The Markdown and CSS files play the role of source code files, and the `pandoc` command (wrapped in a script) is akin to compiling code to produce a release artifact. But the similarities don't end there.

See, the process of producing a CV to apply for a role is a lot like releasing software to production. Rather than being a once-off assignment, the content of a CV is quite fluid. Experience and skills get added, yes, but furthermore, each job application requires you to cater the resume to appeal to the specific job. 

There are two use cases for content editing at play: 
1. Adding to the totality of your experience that the CV could capture (and also editing and tweaking the existing content), for the benefit of all applications in general, and
2. Paring down and honing the document to the most relevant bits for a specific application

Notably, changes made for the first use case probably should be propagated to the second use case, if those edits are happening simultaneously, but changes from the second use case should be discarded once the job application is complete. For example, say I'm applying as an engineer at Yoyodyne. I might trim my experience down to my last two projects and delete the rest. During this edit, I notice a spelling mistake in my name! I should fix this typo *in general*, for all future applications, and also apply this change to the trimmed-down version I intend to use for my current application. But the projects I deleted in my Yoyodyne application might actually be relevant for my next application at Acme, so once I'm done with the current application, I discard that case-specific version and start a new application afresh.

## It's TBD!

This probably sounds familiar, because it is exactly catered for by [Trunk Based Development](https://trunkbaseddevelopment.com/). As such, I realised that I could apply the same processes we already use to run software projects not just to edit my "main" resume file, but for all the edits I'll need for various job applications. The main branch should contain the full, unabridged CV. Job applications are "releases" — I'll cut a release branch and trim the CV down to target a specific role. While a release is ongoing, "hotfixes" are changes that should apply to the CV content in general, not just this application, and they are made to main and merged downstream to all release branches. Once the release branch is ready, the "artifact" is the PDF that I send out. After this point, the release branch can be deleted.

## Taking it further

I've been interested in Ben Balter's concept of [managing like an engineer](https://ben.balter.com/2023/01/10/manage-like-an-engineer), and this microproject offered a small but practical scenario to play it out. So, starting small, I connected a GitHub Project Board to my repo, and started using GitHub Issues to track tasks. The project is simple enough that all "management decisions" can be documented in the readme, so I didn't go as far as adding [ADRs](https://cloud.google.com/architecture/architecture-decision-records), but I did document the project processes in said readme.

There is also room for some interesting automations. The first one that springs to mind is that if a change is made to the main branch while there are release branches, Actions could be used to create pull requests from main into all those branches, to ensure that "hotfixes" are applied before anything gets "released". However, honestly, unless it becomes an issue, I think automation would be more effort than it's worth.

Lastly, there is a small chance that a curious potential employer might snoop around and discover the resume repository containing the full CV, giving me a chance to show off a little more than the aggressively-pruned one-pager that would otherwise be all that they see. To that effect, and to demonstrate what the hell I'm even talking about in this post: 

[Here is my resume as a software micro-project](https://github.com/phlippieb/resume).
