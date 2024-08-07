---
title: "Swift: De-duplicate Tedious Type Declarations with In-line Configuration"
published: 2019-05-30
tags: [Swift, iOS, Configuration, Applying]
listed: true
excerpt: Adding a configured method to variable types to help you organise your code while keeping things concise.
---


_Adding a configured method to variable types to help you organise your code while keeping things concise._

---

## Closure initialisation

In our Swift codebase, we make extensive use of the “[closure initialisation](https://medium.com/the-traveled-ios-developers-guide/swift-initialization-with-closures-5ea177f65a5){:target="_blank"}” standard. For example, instead of writing this:

```swift
private lazy var nameLabel = UILabel()

override func viewDidLoad() {
   super.viewDidLoad()
   
   // Configure the name label:
   self.nameLabel.numberOfLines = 0
   self.nameLabel.textColor = .yellow
   // etc...
}
```

We would write this:

```swift
private lazy var nameLabel: UILabel = {
   let label = UILabel()
   label.textColor = .yellow
   // etc...
   return label
}()
```

It’s a good standard, one with many advantages. For example, it provides a clear, single location in the code where most, if not all, of the configuration for a particular UI element is done.
However, as you may have noticed, we are forced to write out the type of the variable twice —- once to declare the type of the variable and once to initialise its value.

This may be desired in some cases. The external-facing type being separated from the internal type, in combination with polymorphism (either through subclassing or through protocols), allows us to declare variables using the most useful general type and hide the specifics of the actual type to any clients. I might, for example, declare a `UILabel` property but initialise the value with an instance of my own `FancyLabel` subclass. Or, I might declare the property to be `UITableViewDataSource` and interchangeably use various conforming types as the actual value, without having to worry about how that affects clients of the property.

However, in practice, we don’t often get this advantage; we usually declare and initialise exactly the same type. If you create enough variables written in this style, it starts to get a little tedious. Furthermore, when using a type that is already tedious to type out, the tedium doubles. For example, try declaring a couple of these variables:

```swift
private lazy var requester: Requester<NameRequestType, NameResponseType> = {
   let requester = Requester<NameRequestType, NameResponseType>()
   requester.timeout = 100
   return requester
}()
```

How about a more finger-friendly standard?

---

## Map

We want to combine the advantage of _not_ using the closure initialisation standard —- namely, the ability for a variable’s type to be inferred from its initialisation —- with the advantages of the standard —- such as the ability to perform the configuration of an object as part of its declaration.

We already have a pattern for what this could like, courtesy of Swift’s semi-functional paradigm. The `map` function allows us to replace a multi-statement sequence such as this:

```swift
let users = self.database.getUsers()
var userIds: [String] = []
for user in users {
   userIds.append(user.id)
}
```

With this:

```swift
let userIds = self.database.getUsers().map { $0.id }
```

So taking our cue from this type of syntax, why don't we add a `configured` method to the types of variables we would like to configure upon declaration? It should be basically like being able to `map` over a single variable.

---

## Configured

Our configuration method will be very simple, and the implementation will be the same for all types. An easy way to add a method to arbitrary types is to declare a protocol, then extend that protocol with the method to add:

```swift
protocol InlineConfigurable {}

extension InlineConfigurable {
   func configured(_ configurator: (Self) -> Void) -> Self  {
        // Run the provided configurator:
        configurator(self)
        
        // Return self (which is now configured):
        return self
    }
}
```

Any type can now get this method for free by just conforming to `InlineConfigurable`. 

Let’s extend `NSObject`:

```swift
extension NSObject: InlineConfigurable {}
```

And just like that, most of the types provided by the various iOS SDKs are magically configurable. If we want this functionality for types we define ourselves, we can either inherit them from `NSObject` or simply conform them to `InlineConfigurable`.

And finally, here is how we use it:

```swift
private lazy var nameLabel = UILabel()
   .configured { $0.textColor = .yellow }

private lazy var textView = UITextView()
   .configured  { $0.delegate = self }
```

Blammo!

---

## Cocoapods

UPDATE 9 August 2019:

I made a CocoaPods version of this. It’s called `PHBApplying`, and you can use it like this:

```swift
import PHBApplying

// ...
private lazy var nameLabel = UILabel()
   .applying { $0.text = "A label" }
```

I changed the name from `configured` to `applying` because, as [Maciej Najbar pointed out in the comments on Medium](https://medium.com/@MaciejNajbar){:target="_blank"}, this concept is called *apply* in Kotlin (thanks Maciej!)

I also discovered that this concept has already been implemented as a CocoaPod called [Then](https://github.com/devxoul/Then){:target="_blank"}. Their existing implementation is a notch above my own, but I disagree with the naming, because `then` is commonly associated with asynchronous operations.

See PHBApplying on [GitHub](https://github.com/phlippieb/PHBApplying){:target="_blank"} or [CocoaPods](https://cocoapods.org/pods/PHBApplying){:target="_blank"}.

---

Note: This article was originally published on [Medium](https://medium.com/better-programming/swift-hacks-de-duplicate-tedious-type-declarations-with-in-line-configuration-13f66370754){:target="_blank"}.
