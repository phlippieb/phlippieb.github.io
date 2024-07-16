---
title: Acronyms in camel case should not be uppercased
published: 2022-09-09
tags: [coding standards]
listed: true
excerpt: This is a (strong) opinion I hold with regards to coding conventions. You know what an acronym is — it's just an abbreviation consisting of letters from a longer phrase, such as URL (uniform resource locator), NASA (National Aeronautics and Space Administration), or GIF (Jraphics Interchange Format - just kidding).
---
This is a (strong) opinion I hold regarding coding conventions.

You know what an [acronym](https://en.wikipedia.org/wiki/Acronym) is — it's just an abbreviation consisting of letters from a longer phrase, such as URL (uniform resource locator), NASA (National Aeronautics and Space Administration), or GIF (Jraphics Interchange Format - just kidding).

The [camel case](https://en.wikipedia.org/wiki/Camel_case) standard is widely used in programming when a single name is made up of two or more natural words. Think AirPods, MapsDelegate, and so on.

What if the thing you're naming contains an acronym? You have two options: either uppercase the entire acronym, or treat it as a normal word, that can be capitalised as needed. In other words, you can either write `sendHTTPRequest` or `sendHttpRequest`.

I strongly feel that uppercasing the whole acronym is the wrong choice. Here's why.

# Inconsistency depending on placement

If you're in team uppercase, how do you treat an acronym at the beginning of a name? All conventions I've seen opt for an if/else-approach: if the name *starts* with an acronym, make the whole thing lowercase (`httpRequest`); else, make the whole thing uppercase (`sendHTTPRequest`). It's inconsistent; the same acronym is written differently in two names that are almost identical.

If you're following this convention, you're already treating the acronym as a lowercase-able word, but only in select circumstances. You might as well follow through and always treat it the same as any other word.

# Unclear separation between words

Camel case is only readable to the extent that you can distinguish between the words. If you forget to capitalise one of the words, the whole name becomes a mess. I still remember a real world example where gRPC generated a method called `rpcTouser`. Every new team member would ask "what the hell is a touser?" In case you don't get it, which you probably don't, it was meant to read `rpcToUser`.

So we can reasonably agree that leaving the boundary between two words *un*-capitalised leads to confusion. Why, then, are we OK with the inverse — with smudging the boundary by leaving everything uppercase? In `sendHTTPRequest`, your eye has to go hunting through the forest of tall letters to find the one that starts the new word, and you have to mentally carve it off from the ones that make up the previous word. In `sendHttpRequest`, each capital letter signals the start of a new, easily-parsable group, same as with any other camel case name. You don't even have to think about it.

Look me in the eye and tell me that you could honestly spot the `to` in the middle of `XMLToHTTP` without reading it twice.

# Consecutive acronyms

This one speaks for itself. Comparing `DBURL` against `DbUrl`, one leaves you unsure how many acronyms you're even looking at, and the other doesn't.

# BuT hOw WiLl I kNoW iT's an AcRoNym?

One argument against treating acronyms as lowercase-able, is that it might not be clear that you're dealing with an acronym. Don't over-engineer for this edge case. You'll know.

If the acronym *really* doesn't look like an acronym when written in lowercase, you're probably already using it as a noun when talking to your team, so does it really matter? If it **really** matters, treat your special snowflake edge case as an edge case, and leave the rest of our acronyms out of it.