---
title: Your app needs feature toggles
published: 2022-01-21
tags: []
listed: true
excerpt: Let's talk about what feature toggles are, three good reasons why they're essential for mobile apps, and a strategy for implementing them.
---
*This post was originally published on [Retro Rabbit](https://retrorabbit.co.za)*

---

Mobile apps and feature toggles are like bread and butter — sure, you can have one without the other, but you might just choke and die, alone in your kitchen. At your funeral, your best friend calls the incident an "avoidable tragedy". Everyone nods in solemn agreement.

If you've been developing mobile apps for a while, you probably know this. Feature toggles have probably saved your butt more than once. But if not, we'll get into the nitty gritty — let's talk about what feature toggles are, three good reasons why they're essential for mobile apps, and a strategy for implementing them.

## What are feature toggles?

In short, a [feature toggle](https://martinfowler.com/articles/feature-toggles.html), also known as a [feature flag](https://en.wikipedia.org/wiki/Feature_toggle), is a bit of code that lets you switch another bit of code on or off. That's basically it. We're talking about glorified if-statements.

But this deceptively simple concept comes with insane power. It allows you to conditionally hide a button, enable a feature, toggle between different algorithms under the hood, follow a different navigation flow, and so on. Depending on your implementation, you can do this statically, dynamically, rolled-out to increasingly large user bases, or whatever fits your needs.

Let's get into some reasons why they're not only useful, but essential.

## Why feature toggles?

Here are some of the benefits you should expect when your codebase uses feature toggles.

### (1) Change live apps without re-deploying

If your feature flag implementation allows you to toggle features remotely, for live users, then it should be obvious that you have now magically gained the ability to change the behaviour of your app without needing to deploy a new build. Unlike web developers, us poor mobile code monkeys must often wait [uncomfortably long](https://appreviewtimes.com/) for new builds to be approved by our respective app stores, so the ability to effect change instantaneously is a biggie.

The most obvious benefit here is that you can make quick workaround changes to address serious problems. Say you discover that, if users try to tap *that one button*, the app crashes. It's live, and it's affecting users *now*. You're ready to fix it now, but users aren't going to see the fix until tomorrow, or maybe even the day after that. In the mean time, your app is crash city. But wait! You have a feature flag around that button, so you know that you can just flip the toggle, publish it to the live users, and the offending button will magically disappear from their devices! That journey was unreachable anyway, and you can re-enable it once your proper fix has been deployed. Feature toggles to the rescue!

There are other scenarios, less life-or-death, where this ability to remotely modify your app is still quite powerful. Maybe you're running a big onboarding campaign with a new client, and you want them to experience a tailored flow. Maybe you're demoing to investors, and you want to show them a sneak preview of an unstable new feature. Maybe one of your third-party authentication services is down, and you need to disable that login flow until it comes back up. By wrapping a feature in a feature toggle, you can decide what your users see on the fly.

### (2) Phased rollout and other tricks

Building on the first benefit, if you can toggle something for everyone at once, you can also toggle it for *some* users.

This means that you can do [phased rollouts](https://www.split.io/glossary/controlled-rollout/), where you release a new feature to just a small percentage of users at first, and then incrementally increase the user base that sees it. Why? Well, for starters, imagine if that crash we talked about earlier was only introduced to 1% of your users when it was caught; suddenly it seems more like a minor incident that was detected early, and less like a startup-killing emergency. Bugs tend to emerge in live environments, so you *will* find new bugs after you release that new shiny build, but you can limit the amount of actual users who experience those bugs, fix them early, and gain confidence in your feature as you roll out to more users.

You can also do all sorts of shiny A/B tests. You might want to know whether your new flow has a better conversion rate than the old. Easy! Just set up an analytics pipeline to track conversions for each flow, and give some your users the new flow. No need to guess; the data will tell you what works.

Another trick you can do is set up a group of internal users who have special tools available to them. You might find it useful to be able to long-press on a component to view a debug dump of its data, or to share your app's data store via email for inspection, or to broadcast the live logs to your computer console. If you think of these capabilities as features, then you can wrap them in toggles and only enable those features for a short list of blessed user IDs. Easy!

### (3) Merge more often

Everyone knows that long-living branches are evil, but what can we do? Well, we can do feature toggles!

This one requires your team to be onboard with the idea, but in my experience it is worth it. The basic concept is this: you're allowed to merge an in-progress branch, as long as it doesn't affect the behaviour of the app for anyone. You can achieve that condition by putting all your new work behind a feature toggle, hard-coding that feature toggle to "off", and putting in daily merge requests. Your team gets a nice bite-sized PR that they can easily digest, you don't run into hideous merge conflicts, and the overall behaviour of the app remains the same until someone actually flips that feature toggle. No harm, no foul.

---

How can I implement feature toggles? Let's look at some ways you could implement feature toggles in your codebase.

## Super basic

Like we said: feature toggles are glorified if-statements. For a very basic implementation, you could define an enum or a struct of static boolean values that indicate whether a feature is on or off, and then reference that when you present the feature. For example, in Swift:

```swift
/// All features are listed in this struct
struct Feature {
  static let sketchyButton = true
  static let newLoginFlow = false
  // Etc...
}

// Example usage
if Feature.sketchyButton {
  view.addSubview(self.sketchyButton)
  // Etc...
}
```

This is very easy to do, and already gives you the ability to merge half-finished code without affecting the behaviour of your app.

## Intermediate

To reap most of the benefits of using feature toggles, we need the ability to change them *remotely*. An easy way to set that up would be by pulling in [Firebase's Remote Config](https://firebase.google.com/products/remote-config) tool. This gives you a well thought-out dashboard for changing values remotely without the need for creating new a server, as well as a robust syncing implementation on the frontend. Alternatively, your team could implement a dashboard server tailored to your needs.

Moreover, we also want to differentiate between environments such as Development and Production. Let's assume those are the only two we care about for now.

This gives us a 2-by-2 matrix of parameters to take into account when we ask whether a feature is on. A feature might be enabled or disabled locally, remotely, in dev, and in prod. This sounds complex, but don't worry: all you need to know is that a feature must be enabled locally *and* remotely in the current environment.

This approach gives us some levers for enabling or disabling a feature in a particular environment.

- If we disable the feature locally, it will always be disabled, regardless of what our remote config says. By "locally", we mean a hard-coded boolean value, like in the basic implementation above. This is very important!  - It allows us to ship a build with work-in-progress code without worrying that end-users will see a half-baked feature, even if we do switch on the feature toggle remotely.
- If the feature is enabled locally, then the feature's status depends on whether we enable or disable it remotely. This is how we change the app on the fly without a re-deploy.
- Because of the environment split, we can locally-enable a feature in dev and toggle it remotely, but leave it locally-disabled in prod, for example.

Some rough code to illustrate the concept:

```swift
/// List all features here:
enum Feature: String {
  case sketchyButton
  case newLoginFlow
  // etc
}

/// Utility class to check whether a feature is enabled:
class Features {
  // Dependency to check remote status of feature toggle
  // Assumed to be environment-specific
  var remote: FirebaseRemoteConfigService!

  public static func isEnabled(_ feature: Feature) -> Bool {
    return isEnabledLocally(feature)
        && isEnabledRemotely(feature)
  }

  private static func isEnabledLocally(_ feature: Feature) -> Bool {
    #if DEV
    // Local status in DEV environment
    switch feature {
      case .sketchyButton: return true
      case .newLoginFlow: return false
    }
    #else
    // Local status in PROD environment
    switch feature {
      case .sketchyButton: return false
      case .newLoginFlow: return false
    }
    #endif
  }

  private static func isEnabledRemotely(_ feature: Feature) -> Bool {
    if remote.remoteConfigExists(feature.rawValue) {
      // The feature is defined on the remote dashboard.
      // Return its value.
      return remote.getValue(feature.rawValue)
    } else {
      // The feature is not defined on the remote dashboard.
      // Default to true.
      return true
    }
  }
}

// Usage example:

if Features.isEnabled(.sketchyButton) {
  view.addSubview(self.button)
  // etc...
}

if Features.isEnabled(.newLoginFlow) {
  self.routing = .newLoginFlow
} else {
  self.routing = .oldLoginFlow
}
```

The specifics of how you read the toggles from the remote dashboard will depend on your actual implementation, but an interesting thing to note here is that we specifically handle the case where the feature is not defined on the remote dashboard. In fact, when using this in practice, you will probably omit adding any features on the remote dashboard unless you specifically want to disable them. We assume that the default status of a feature is true, or on, for two reasons:

1. Ease of use. Adding a new feature does not require you to do anything in the remote dashboard; the feature will be on unless you specifically need it to be off.
2. Retiring feature toggles. Feature toggles can often be considered as a form of technical debt. A feature that is wrapped in a toggle will eventually prove itself to be stable, and you will want to remove the complexity of "maybe" having it in your app; this is especially true if the toggles switches between an old and a new implementation, and you want to delete the old code. When you do that, you can also delete the feature on the dashboard (if it's even there), and this will logically signal that the feature is enabled. It keeps things consistent.

## Advanced

This is looking good, but we can still soup up our toggle system a little more. Let's introduce a new mechanism to affect whether a feature is on: **parent features**.

If we use really fine-grained features, it often makes sense to group them under a big "parent" feature. For example, say we're working on a new profile feature. We can create a toggle for the screen itself, but also for the button on a *different* screen that would take us to the new screen. We can switch the toggle off for the button on a specific screen without switching the whole feature off, but it wouldn't make much sense to disable the whole feature while keeping the button — where would the button even take the user?

To address this scenario, we can let some features act as parents for other features, and then require that the parent should be on, else its children are all considered to be off. In code:

```swift
class Features {
  public static func isEnabled(_ feature: Feature) -> Bool {
    return isEnabledLocally(feature)
        && isEnabledRemotely(feature)
        && isParentEnabled(of: feature) // <- this is new
    }
  }

  // ...

  private static func isParentEnabled(of child: Feature) -> Bool {
    guard let parent = parent(of: child) else {
      // The child doesn't have a parent. Default to true.
      return true
    }

    return isEnabled(parent)
  }

  private static func parent(of child: Feature) -> Feature? {
    switch child {
      case .profileButton: return .profile
      default: return nil
    }
  }
}
```

What did we do? Firstly, we made it a new requirement that, for a feature to be on, its parent must also be on; this means that we can disable all children of a parent feature by just disabling the parent feature. Secondly, we added a way to check whether a feature's parent is on. This method checks whether the feature even has a parent; if it does not, then it doesn't matter, so we return true. If it does, then we just use the already-existing `isEnabled` method to check whether the parent is on, which will perform all the necessary checks, such as whether it's enabled locally and remotely in the correct environment, and even whether its parent is on, in case we have a grandparent scenario. Recursion, baby! Lastly, we added a method that lets us specify which features are the parents to which children, when applicable.

Depending on your needs, there is still a lot of room for additional complexity. For example, you may want an exclusion-relationship between features, such that feature A will automatically be disabled when feature B is enabled, while still allowing both to be off if needed. Or you may want to create an in-app dashboard to override whether features are on or off, so that you can test or demo code that should not be accessible to other users in the same environment. All of this logic can live in the `Features` class without affecting its public API.
