---
title: "Publish an iOS app fast by offloading key features"
published: 2024-07-31
tags: [Swift, iOS]
listed: false
excerpt: todo
---
An MVP is a minimum viable product. It is the least amount of functionality that can be shipped to users so that your software still stands on its own. Aiming for a small initial release can be great; you get to market sooner, putting you in a better position to figure out where to invest your effort.

Implementing an MVP is not just about cutting out features, though. If you plan your project well, you can include key functionalities without needing to do much implementation, by offloading them. This post is about a few things you can offload to get your app out the door faster.

## Authentication and a backend: use CloudKit instead

If the main reason why you need your users to sign in is so that you can sync their data over a backend service, re-think this requirement, at least for your first release. By using CoreData or SwiftData for local persistance, roping in CloudKit is typically very easy. Your majority target are likely the only people using their devices, so associating their data with their iCloud accounts is not only reasonable, it also provides a more seamless user experience.

## Settings screen: use the system settings instead

This one might actually be harder than the alternative if you're not familiar

## In-app webview: open in external browser instead

Displaying your app's content in an in-app webview may have the advantage of keeping the user in the app, but it comes with the downside of significantly more complex entitlements, and there are good reasons not to offer a full browser inside your app. Just use a `Link` component to open your app's website in the user's preferred browser instead.

## Notifications: guide users to set up reminders instead

Your app might benefit from displaying notifications reminding them to do something (for example, in my Daily Budget app, users may like daily reminders to log their expenses). Delivering notifications directly from your app will probably be a better experience, but you can fake it pretty well with Apple's Reminders app. If a user creates a reminder while your app is open, the reminder will contain a link that will open your app. You can even leverage paths to open to the exact view that the user should see when they tap the reminder.

## ?: use Shortcuts instead

