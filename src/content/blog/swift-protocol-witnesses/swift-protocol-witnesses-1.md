---
title: "Swift protocol witnesses example 1: The basics"
published: 2021-03-16 
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: To illustrate the concept of protocol witnesses, we’ll start with an example that’s so simple that it’s almost cheating. We’ll first show some code “before”, using traditional Swift protocols to setup a little ecosystem. Then we’ll convert the system to “after”, so that it is defined using protocol witnesses instead.
---

This is part of a [series on protocol witnesses in Swift](/swift-protocol-witnesses/).

# Example 1: The basics

To illustrate the concept of protocol witnesses, we’ll start with an example that’s so simple that it’s almost cheating. We’ll first show some code “before”, using traditional Swift protocols to setup a little ecosystem. Then we’ll convert the system to “after”, so that it is defined using protocol witnesses instead.

## Before

Say we have a protocol for things that can “foo”, and a class that depends on a thing that can “foo”.

```
protocol CanFoo {
  func foo()
}

class FooClient {
  var fooer: CanFoo!

  func doSomething() {
    fooer.foo()
  }
}
```

Let’s make a class that implements the protocol (i.e. conforms to it), and inject an instance of that class into the client:

```
class DefaultFooer {
  func foo() {}
}

extension DefaultFooer: CanFoo {}

let client = FooClient()
client.fooer = DefaultFooer()
```

So now we have a tiny setup that uses protocols to create a system of abstract dependencies with concrete implementations.

Now, let’s convert this setup to use protocol witnesses instead.

## After

The first thing we’ll do is express the protocol requirement (namely that conforming instances should be able to “foo”) in a struct instead of a protocol.

```
struct CanFoo {
  let foo: () -> Void
}
```

This might look a little weird, but it’s really not that different from our protocol. Think of it this way: an instance of this struct, when we eventually instantiate one, will contain the implementation of the functionality we require. So this struct is like a blueprint for a requirement. Much like with a protocol, the struct specifies a group of requirements, each of which has a name (`foo`) and a type signature (`() -> Void`). And of course, the type signature of `foo` here is identical to the signature in the protocol; a function with no parameters and no return type is expressed as `() -> Void` in Swift.

Next, let’s revisit `FooClient`, the client that relies on `CanFoo` as a dependency. We actually don’t have to make any changes to this class. The dependency exposes the same interface that was previously exposed by the protocol. Isn’t that convenient?

We will have to make some changes to the default implementation class, though. This is the part where we cheat a little to make things easier — we’re going to give `DefaultFooer` a static method, instead of an instance method.

```
class DefaultFooer {
  static func foo() {}
}
```

Now for the magic. Since `CanFoo` is no longer a protocol, we don’t confirm `DefaultFooer` to it in the traditional sense. Remember how I said that the protocol witness struct is like a *container* for a specific implementation of a protocol? Let’s create a static instance of the protocol witness struct that contains an implementation of the foo-functionality, using the concrete implementation provided by our class:

```
extension CanFoo {
  static let defaultFooer = CanFoo(foo: { DefaultFooer.foo() })
}
```

Ok, what just happened? What happened is that we extended the protocol witness type, adding a static instance of this witness. Being a struct with a stored closure, we are required to provide an implementation of the `foo` method when initialising such an instance. The implementation that we provided was a closure that simply calls the static member `foo` on `DefaultFooer`.

We now have an instance of an *implementation* of `CanFoo` that we can use in our code. This instance is available directly from the protocol witness type, which makes it handily ready when we need it (but we could have provided this implementation instance somewhere else, if we wanted to, and we’ll get into that).

Time to inject this dependency into the client:

```
let client = FooClient()
client.fooer = .defaultFooer
```

Since our implementation is available as a static member on the protocol witness type itself, we can conveniently access it as `.defaultFooer`. (This is of course equivalent to typing `client.fooer = CanFoo.defaultFooer`.)

## Recap

Let’s summarise what we did to convert our setup from being based on Swift protocols to using protocol witnesses. 

We converted our protocol itself to a struct, converting each requirement from the protocol into an uninitialised instance member of the struct. This is how we force concrete implementations of our protocol to provide the concrete functionality expressed by the protocol.

We didn’t need to change the client that depends on the protocol’s functionality. It is, however, worth noting that the client now has a dependency that is a struct, as opposed to a protocol.

Instead of making our implementing (or conforming) class explicitly conform to the protocol, we created an instance of the protocol witness, where the required functionality is initialised with a call to the concrete implementation provided by the implementing class. This new instance can be thought of as a concrete, named instance of an implementation of the abstract protocol. Thus, it needs to exist somewhere in our code, and we chose to store it in an extension to the protocol witness itself, as a static instance, which makes it conveniently accessible by name later.

Lastly, we needed to inject our concrete implementation of the protocol into our client. Since our implementation is simply an instance of the protocol witness type, we could assign it directly to the corresponding property of the client. And since our implementation is handily accessible from the protocol witness type as a static member, we refer to it by its property name.

We cheated a little bit with this example. Our protocol required the method `foo` to be an *instance member*, but our conforming type provided it as a *static member*. This made it simpler to write the closure when creating an implementation of the protocol. But in practice, we will often need to conform types to protocols by leveraging the *instance members* of those types — in other words, by calling non-static methods, or updating non-static properties on individual objects. Let’s look at another example that addresses this need in the next example.

[Example 2: Instance-bound implementation -->](/swift-protocol-witnesses/swift-protocol-witnesses-2/)