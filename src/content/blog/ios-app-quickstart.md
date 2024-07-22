---
title: "Publish your iOS app faster by offloading key features"
published: 2024-07-22
tags: [Swift, iOS]
listed: true
excerpt: todo
---
A [minimum viable product](https://en.wikipedia.org/wiki/Minimum_viable_product) (MVP) is a product containing the least amount of functionality that can be shipped to users so that your software still stands on its own. Aiming for a small initial release can be great; you get to market sooner, putting you in a better position to figure out where to invest your effort.

Implementing an MVP is not just about cutting out features, though. If you plan your project well, you can include key functionalities without needing to do much custom implementation, by relying on vanilla features included in the iOS development ecosystem. This post is about some things you can offload to get your app out the door faster.

## Authentication and a backend: use CloudKit instead

If the main reason why you need your users to sign in is so that you can sync their data over a backend service, re-think this requirement, at least for your first release. If you use CoreData or SwiftData for local persistance, then roping in CloudKit is very easy. Your target audience will likely be the only users using their devices (i.e. multiple user accounts inside your app is probably an edge case that you don't need to cater for yet), so associating their data with their iCloud accounts is not only reasonable, it also provides a more seamless user experience.

## Custom UI: use vanilla SwiftUI instead

At some point, you'll want your app to have its own character in terms of look and feel. But good UI requires thoughtful design, a complete design system that responds well to different device sizes and accessibility use cases, et cetera. As it happens, Apple devices already ship with such a system, and you get it for free when you use SwiftUI components for their intended purposes. It may seem a bit vanilla, but Apple have put a lot of thought and care into their stock UI system, enabling you to build and release an app by only worrying about the functionality at first. The look and feel can always be overhauled later. 

## Settings screen: use a settings bundle instead

Okay, full disclosure, learning how to set up a [settings bundle](src/content/blog/ios-app-quickstart.md) might take some getting used to if you've never done it before. But once you get the hang of it, you'll find that iOS provides a fairly capable system for users to configure options for your app, and for you to access those configurations. Plus, and this is just my opinion, it'll make your app feel more like a serious entry in the iOS ecosystem.

## In-app webview: open in external browser instead

Displaying your app's content in an in-app webview may have the advantage of keeping the user "in the app", but it comes with the downside of significantly more complex entitlements, and there are good reasons not to offer a full browser inside your app. Just use a [Link](https://developer.apple.com/documentation/swiftui/link) component to open your app's website in the user's preferred browser instead.

## Notifications: guide users to set up reminders instead

Your app might benefit from displaying notifications reminding them to do something (for example, in my [Daily Budget app](https://dailybudget.phlippieb.dev), users may like daily reminders to log their expenses). Delivering notifications directly from your app would be a better experience, but to kick things off, you can fake it pretty well with Apple's Reminders app. If a user creates a reminder while your app is open, the reminder will contain a link that will open your app. You can even leverage paths to open to the exact view that the user should see when they tap the reminder.

## Third-party crash reports: use the built-in crash reporting instead

Most apps nowadays use a third-party analytics and crash report service to get insights into their stability and performance. There are many good reasons to upgrade to such a service once your user base grows enough to warrant it. To get started though, you could rely on [Apple's crashes utility](https://developer.apple.com/news/?id=nra79npr), which lets you investigate and debug crashes directly inside Xcode, as long as the affected users opted in to share their usage information. 
