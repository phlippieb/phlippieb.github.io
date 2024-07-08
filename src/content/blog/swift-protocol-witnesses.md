---
title: Swift protocol witnesses in 6 examples
published: 2021-03-16
tags: [generics, protocol, protocol witness, swift]
listed: true
excerpt: In short, the idea is to represent a protocol as a struct. Clients that need to access functionality as defined by the protocol can do so by accessing members of an instance of the struct. Types do not declare conformance to protocols; instead, they provide global instances of the struct, binding their conforming implementations to those instances.
---
As much as I think that Swift is just *the raddest*, there is one part of the language system that I have always found unintuitive and difficult to use -- protocols with associated types. It’s the Swifty way to combine protocols and generics. I'm reasonably comfortable with protocols on their own, and I use generics extensively. No sweat. But when the two intersect, I always lose the plot. I'm going to pretend like it's not just the limit of my own ability to grasp complex language features, and claim here and now that this is a flaw in Swift's design. This cop-out allows me to make peace with a new approach that I'd like to try: *using a workaround*.

[The workaround in question comes from PointFree.co](https://www.pointfree.co/episodes/ep33-protocol-witnesses-part-1), and is called "protocol witnesses". In short, the idea is to represent a protocol as a struct. Clients that need to access functionality as defined by the protocol can do so by accessing members of an instance of the struct. Types do not declare conformance to protocols; instead, they provide global instances of the struct, binding their conforming implementations to those instances.

That's a mouthful. Let's looks at some code examples instead. 

[Example 1: The basics](/swift-protocol-witnesses/swift-protocol-witnesses-1/)

[Example 2: Instance-bound implementation](/swift-protocol-witnesses/swift-protocol-witnesses-2/)

[Example 3: Multiple implementations](/swift-protocol-witnesses/swift-protocol-witnesses-3/)

[Example 4: With generics](/swift-protocol-witnesses/swift-protocol-witnesses-4/)

[Example 5: An implementation per type](/swift-protocol-witnesses/swift-protocol-witnesses-5/)

[Example 6: Composed protocols](/swift-protocol-witnesses/swift-protocol-witnesses-6/)
