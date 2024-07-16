---
title: "An easy-to-use routing system in Swift"
published: 2020-06-11
tags: [Swift, iOS, Routing]
listed: true
excerpt: How we eschewed pre-built routing frameworks for a hand-rolled system based on protocols, enums and default implementations that is tailor made to our codebase
---

_How we eschewed pre-built routing frameworks for a hand-rolled system based on protocols, enums and default implementations that is tailor-made to our codebase_

Developing software is a process, and so is becoming a better developer. I have fallen in most of the pitfalls that I have encountered on the iOS development trail so far, and I’m still slowly climbing out of them as I continue. It’s all part of the process, right?

One of the pitfalls that our codebase has suffered from for a long time, is the hilariously-titled “[Massive View Controller](https://khanlou.com/2015/12/massive-view-controller/){:target="_blank"}” problem — the classic mistake of making a view controller responsible for almost everything that can happen while a user is looking at it. One of the most oft-cited responsibilities that does **not** belong in a view controller’s code is routing to other screens. This post is about our implementation of a routing system which takes this responsibility out of our view controllers.

Our implementation is probably not the most universally applicable framework out there. It has been built to utilise other systems that we already had in place, specifically for navigation, which is likely to be incompatible with a lot of other software out there. But I think that talking about our implementation is a nice opportunity to talk about some good guidelines that we were able to follow, and to demonstrate that the best solution for you might not be the best solution for everyone.

---

# Background

First off, our UIs are 100% programmatic, and virtually all of our navigation is based on `UINavigationControllers`. So to move from one screen to another, in our original, naive implementation, the first view controller would create the second view controller, get its current navigation controller, and push. It doesn’t always seem so bad, but we soon ran into what you might call some serious inconveniences.

We had introduced [feature flags](https://www.martinfowler.com/articles/feature-toggles.html){:target="_blank"} as a core aspect of our development process (and once you use feature flags, you’ll never go back!). A common trick for us when implementing a major rewrite to an existing screen is to follow this process:

1. Use refactor to rename the existing view controller to `<ViewControllerName>Old` (post-fixing “Old”)
2. Create a new file and class for the updated view controller
3. Create a feature flag to toggle between the old and new view controller
4. When navigating to the view controller in question, check whether the feature flag is enabled, and instantiate the old or new controller as needed

I won’t delve into the advantages of building new features behind feature flags in this post, but believe me that it is worth it: this keeps our pull requests manageable, our releases roll-back-able, and our app configurable to an unbelievable extent.

You may have spotted the issue, though, considering our naive navigation approach. In step four, when we say “when navigating to the view controller in question”, what we really mean is “find every instance in the app where the view controller in question is instantiated and pushed to a navigation stack”. Depending on the size of your app, this can be a good few hours’ work. It is also very error-prone, and it’s been more than once that we’ve released builds where users could access old and deprecated screens by following a route that we’d missed.

Moreover, instantiating a view controller might not be a simple task. It might require dependency injection, authentication validation, contextual logic, or a host of other complexities. When you make navigation the responsibility of each individual view controller, then each view controller has to deal with this complexity. It’s a waste of effort, and ensuring that it is handled consistently throughout the codebase is virtually impossible.

It became clear to us that we would need something better. We’ve read about _routers_ as a solution to this very problem, and so we decided to give it a go.

---

# A hand-rolled solution is in order

One thing you’ll notice when you read up about routing solutions is that it is usually implemented at an almost _infrastructural_ level. The solutions seem great, but if we were going to use any of the ones we came across, it would be an all-or-nothing commitment. I have grown to be skeptical of [big rewrites](http://chadfowler.com/2006/12/27/the-big-rewrite.html){:target="_blank"}, and would always prefer something that can be implemented at a small, partial scale as a proof of concept.

We also came across solutions that provide far more features than we needed. Since almost all of our navigation relies on navigation controllers, we don’t need the added abstraction of supporting segues, and would rather do without it.

Our app’s existing navigation API was also not very compatible with the existing solutions we have found, and those solutions don’t leverage our API. For example, we have created a questionable but convenient method for obtaining the “current” navigation controller. This is obviously very handy when you need a router to push a controller to the stack, but of course no existing libraries would know to use that.

So we set out to design a routing solution with the following requirements:

- **Partially-implementable:** We wanted to be able to implement routing to just one screen. This allowed us to test and tweak the implementation in its early phases, and to convert from the old naive navigation to the new routing incrementally, rather than having to book off a sprint or two to convert everything at once.
- **Modular:** We have a lot of screens in the app. Having a single router that handles every possible destination is bound to be a massive headache. We also have a few rare exceptions where navigation is not performed by pushing a controller to a navigation stack, but by presenting something modally, or even by changing the root controller of the window, such as showing a sign-in screen, and then navigating to the main app, but not allowing the user to return to the sign-in screen. So we needed to be able to create multiple different routers to group similar destinations, and to separate different navigation methods.
- **User-friendly:** We had an opportunity to factor the complexity of initialising view controllers out of our other view controllers, and into the new routers. This meant putting a lot of the dependency management (e.g. obtaining user keys) in the routers, and hiding that complexity from the routers’ clients. When a client needs to navigate to a screen, the request should be formulated without having to specify anything that the router cannot figure out for itself.

---

# Implementation

First off, let’s define protocols for the core concepts. What are the core concepts? Well, let’s think about what want to achieve: we want a way to go to a screen. So we are dealing with the concept of a place to go to, or a **destination**. And we also need a thing that will take us to that destination, which we will simply call a **router**.

Here is a protocol for a destination:

```swift
/// Conforming types represent destinations that we can routed to.
/// (Conforming types can be enums, structs, etc)
protocol RoutingDestinationProtocol {}
```

There is no interface, and conforming types can be basically anything. In practice, all of our destination types ended up being enums, but you could make a strong case for using structs; for example, if all of your destinations share the same context info, you could define a struct with a field for that context, and add an inner enum to differentiate destinations.

Here’s a protocol for a router:

```swift
/// Conforming instances can be used to route to destinations of a particular RoutingDestinationProtocol-conforming type.
protocol RouterProtocol {
   associatedtype RoutingDestination: RoutingDestinationProtocol
   func route(to destination: RoutingDestination)
}
```

This one’s a bit more interesting. Conceptually, a router is a thing that routes to a destination. Looking at this protocol, a particular type of router is associated with a particular type of destination, which it can route to.

In principle, we can create different types of routers associated with the same types of destinations, each using different navigation implementations, animations, and so on. If we ever need it, we can create a navigation controller-based router, a modal-based router, and a segue-based router, all for the same set of destinations. In practice, we will usually create a single router/destination pair for each area of the app.

For example, for actions related to chat, we could have a ChatRoutingDestination enum, and a ChatRouter class that routes to those destinations:

```swift
enum ChatRoutingDestination: RoutingDestinationProtocol {
   case viewChat(userId: String)
   case startNewChat
   // etc.
}

class ChatRouter: RouterProtocol {
   associatedType RoutingDestination = ChatRoutingDestination
   static let shared = ChatRouter()
   func route(to destination: RoutingDestination) {
      switch destination {
         case .viewChat(let userId):
            // navigate to the "view chat" screen for this user
         case .startNewChat
            // navigate to the "start new chat" screen
      }
   }
}
```

There’s some stuff missing, but the concept is now starting to emerge. To use this router from anywhere in the app, we would simply have to call this:

```swift
ChatRouter.shared.route(to: .viewChat(userId: userId))
```

So now it’s easy to define destinations and routers, but we don’t know how to make them work yet. Keeping in mind that, in our app, navigation controllers are king, we need to do two things to actually implement a router:

1. Create a view controller for the destination
2. Push the view controller to a navigation stack

An intuitive way to do this would be to put the obvious code in `route(to:)`. Continuing our previous example, that could look like this:

```swift
func route(to destination: RoutingDestination) {
   switch destination {
      case .viewChat(let userId):
         self.viewChat(userId: userId)
         // etc.
   }
}

private func viewChat(userId: Int) {
   let viewChatController = ViewChatController(userId: userId)
   AppNavigation.navigationController?.pushViewController(viewChatController, animated: true)
}
```

This is pretty neat and easy to expand on, and at this point, fully functional! Nice.

Note the reliance on `AppNavigation`; this is the existing convenience I mentioned earlier. It is probably a bit hacky, but I would also argue that there is a certain cleanness in separating the actual UIKit-dependent navigation implementation into a separate, shared service. And like I said, we had it, and we wanted to use it. If you don’t have something like this, I’m sure it wouldn’t be too difficult to wire up navigation inside the router using what you have available; for instance, you could pass a navigation controller to the router when calling `route`.

There’s still something about this implementation that didn’t sit quite right with us, though. Pretty much every routing function we write will run the exact same `pushViewController` bit, so we can try and [dry](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself){:target="_blank"} that out a bit. Moreover, while we’re conceptually defining the routing destinations in the RoutingDestination type, here we are asking the Router type to interpret what those destinations actually mean; the router has to decide which view controller to instantiate.

What we would really like is this: A routing destination should know how to create the controller associated with the destination. And a router should know how to navigate to such a controller.

Let’s start with the destinations. We define a protocol called `ViewControllerProvider`:

```swift
/// Instances can asynchronously provide a view controller.
/// This is used in routing to get concrete view controllers for conceptual destinations.
protocol ViewControllerProvider {
   typealias ResultHandler = (Result<UIViewController>) -> Void
   func provideViewController(resultHandler: @escaping ResultHandler)
}
```

The idea is simple: conforming `ViewControllerProvider` types opt to provide a view controller upon request. We decided to make the result asynchronous to allow us to fetch required data from the server, if needed. To that end, we also wrap the provided controller in a Result, in order to account for failable instantiations, such as when the required data is not available.

(Side note: we’re using a hand-rolled implementation of Result which is different from the built-in Swift one, but using the more common version should be a simple update.)

Now we can conform our example destination type to this protocol:

```swift
extension ChatRoutingDestination: ViewControllerProvider {
   func provideViewController(resultHandler: @escaping ResultHandler) {
      switch self {
      case .viewChat(let userId):
         self.provideViewChatController(userId: userId, resultHandler: resultHandler)
      // etc.
      }
   }
  
   private func provideViewChatController(userId: Int, resultHandler: ResultHandler) {
      let viewChatController = ViewChatController(userId: userId)
      resultHandler(.success(viewChatController))
   }
}
```

Basically, we just moved the view controller creation step out of our router and into our destination, and we provided a protocol to allow clients to make use of this functionality. At this point, we could simply change our router to call `destination.provideViewController`, check the result for a successfully-created view controller, and explicitly push it to the navigation stack. But as we said, that pushing to stack will look exactly the same every time, and we’d like to avoid having to type it out repeatedly.

So next, let’s define a protocol for things that can navigate to places:

```swift
/// An interface for classes that can navigate to given view controllers.
protocol ViewControllerNavigator: class {
   func navigateTo(_ viewController: UIViewController)
}
```

Then, using the [_deep magic_](https://en.wikipedia.org/wiki/Magic_(programming)#Variants){:target="_blank"} of default protocol implementations, we can implement `route(to:)` for any router that meets two conditions: the router itself is a ViewControllerNavigator, and its associated destination is a ViewControllerProvider. We create the following default implementation:

```swift
extension RouterProtocol 
   where Self: ViewControllerNavigator, RoutingDestination: ViewControllerProvider {
   func route(to destination: RoutingDestination) {
      destination.provideViewController { [weak self] result in
         if case .success(let viewController) = result {
            self?.navigateTo(viewController)
         }
      }
   }
}
```

So now, if a router knows how to navigate to a controller, and its destinations know how to create controllers, we don’t have to implement `route(to:)` at all!

Let’s also create a concrete class that conforms to this navigation protocol:

```swift
/// A base class for router instances that use the top navigation controller to navigate to view controllers.
class NavigationControllerRouterBase {}

extension NavigationControllerRouterBase: ViewControllerNavigator {
   func navigateTo(_ viewController: UIViewController) {
      AppNavigation.navigationController?.push(viewController, animated: true)
   }
}
```

Any router class that inherits from this base class now automatically conforms to ViewControllerNavigator, and knows how to navigate to a view controller. If we associate such a class with a concrete RoutingDestination type, we don’t need to re-implement any of the routing.

Continuing our chat routing example, the chat router becomes this:

```swift
final class ChatRouter: NavigationControllerRouterBase, RouterProtocol {
   typealias RoutingDestination = ChatRoutingDestination
}
```

Any new routers that we will create requires equally little code. And furthermore, if we want a different mechanism for navigating, we just need a new concrete base class, which only has to implement `navigateTo`. For instance, if we want routers that navigate to their destinations by modally presenting them, we could just need to create the following base class:

```swift
/// A base class for router instances that present modally to navigate to view controllers.
class ModalPresentingRouterBase {}

extension ModalPresentingRouterBase: ViewControllerNavigator {
   func navigateTo(_ viewController: UIViewController) {
      AppNavigation.topViewController?.present(viewController, animated: true)
   }
}
```

Any router that inherits from this base class and has an associated RoutingDestination type that conforms to ViewControllerProvider will now automatically know how to do the routing. Sweet!

---

# Evaluating the solution

Let’s recap what we set out to achieve. We wanted a routing system that is

1. Partially-implementable
2. Modular
3. User friendly

This system is clearly partially-implementable. Essentially, I partially implemented a router just for a single chat screen in the code snippets above. We can incrementally add onto that by adding more cases to the `ChatRoutingDestination` enum, or by adding new router/destination pairs. Thanks to the deep magic of default protocol implementations, every little bit that we add is immediately functional. We can slowly start to convert our navigation, screen by screen.

It is also highly modular. We can group similar screens together under a single RoutingDestinationType as we please, while keeping dissimilar screens in separate types. We can also create different router classes to provide different handling for groups of screen with different navigation mechanisms.

And lastly, this allows us to factor out much of the details involved in setting up a view controller. The `ViewControllerProvider` implementation of RoutingDestination is the perfect place to perform dependency injection, context setup, and so forth, taking those concerns away from the client.

---

# Conclusion

While there are many out-of-the-box routing implementations, each codebase is different, and our codebase had special requirements and special affordances. The system demonstrated here will certainly not be implementable, without change, in just any codebase, but the approaches we used might be useful to you.

By leveraging some of Swift’s powerful features, such as default protocol implementations, we were able to create a powerful routing system that suited our needs perfectly. Using a pre-built system is certainly convenient, but a custom system that you create for yourself might be the better choice.

---

Note: This article was originally published on [Medium](https://medium.com/@phlippie.bosman/an-easy-to-use-routing-system-in-swift-37e7e2d5259){:target="_blank"}.
