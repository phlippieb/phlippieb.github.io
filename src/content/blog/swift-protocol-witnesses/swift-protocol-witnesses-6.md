---
title: "Swift protocol witnesses example 6: Composed protocols"
published: 2021-03-16 
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: If you're thinking of replacing all your protocols with witnesses, you'll find that there is one feature of traditional protocols that we haven't covered in protocol witness world yet, namely inheritance.
 instead.
---
This is part of a [series on protocol witnesses in Swift](/posts/swift-protocol-witnesses/).

[<-- Example 5: An implementation per type](/posts/swift-protocol-witnesses/swift-protocol-witnesses-5/)

If you're thinking of replacing all your protocols with witnesses, you'll find that there is one feature of traditional protocols that we haven't covered in protocol witness world yet, namely inheritance.

In traditional protocol world, you could indicate that one protocol comprises another by defining an inheritance relationship, like this:

```swift
protocol HasID {
  var id: String { get }
}

protocol IDComparing: HasID {
  func isIDEqual(to other: HasID) -> Bool
}
```

If your comp-sci degree heralded object orientation as *The Way* like mine did, you'll be comfortable with what this syntax means, namely, that things with comparable IDs *are* things that have IDs, with some extra capabilities added. It is [debated](https://en.wikipedia.org/wiki/Composition_over_inheritance), though, whether this relationship is really best expressed through inheritance or composition.

In fact, in protocol witness world, we express this through composition, like this:

```swift
struct HasID {
  let id: () -> String
}

struct IDComparing {
  let hasID: HasID
  let isIDEqual: (HasId) -> Bool
}
```

Instead of inheriting our `IDComparing` protocol witness from `HasID` (which wouldn't be valid since we're dealing with structs), the `IDComparing` struct is *composed* of a `HasID` implementation instance, along with the additional requirements.

Let's look at a more familiar example — let's create protocol witness versions of Equatable and Hashable.

## Protocol witness versions of Equatable and Hashable

Hashable and Equatable are a well-known example of protocols with an inheritance relationship. [Apparently](https://forums.swift.org/t/why-does-hashable-require-equatable/16817/4), this is because of hash collisions: while rare, two different values might produce the same hash, and there seem to be use cases where we need to know that they are not, in fact, equal. So as an example, we'll convert these protocols into witnesses.

Let's start with Equatable. The protocol witness struct would look like this:

```swift
struct Equating<T> {
  let equals: (T, T) -> Bool
}
```

We could implement this protocol for Ints by leveraging the existing implementation:

```swift
extension Equating where T == Int {
  static let int = Self { $0 == $1 }
}
```

But we don't want to create a mapping like this for each Equatable type; that seems a little redundant. So let's rather define a default implementation:

```swift
extension Equating where T: Equatable {
  static var `default`: Self {
    .init { $0 == $1 }
  }
}
```

And finally, we'd use it like this:

```swift
Equating.int.equals(1, 1) // true
Equating.default.equals("a", "b") // false
```

Next, let's do Hashable. Here's the protocol witness struct:

```swift
struct Hashing<T> {
  let equating: Equating<T>
  let hashValue: (T) -> Int
}
```

Again, notice that it is composed of an instance of the Equating protocol witness, which indicates that for something to be Hashable, it must also be Equatable. 

Here's an implementation for Int:

```swift
extension Hashing where T == Int {
  static let int = Self(equating: .int, hashValue: \.hashValue)
}
```

And as before, here's a more general default implementation for types that are already Hashable (which means that they are also Equatable, and thus that they have a default `Equatable` implementation):

```swift
extension Hashing where T: Hashable {
  static var `default`: Self {
    .init(equating: .default, hashValue: \.hashValue)
  }
}
```

You might wonder if this is a sensible approach. This example especially highlights the fact that, when comparing two Ints or two Strings, there aren't really multiple possible answers. We don't need multiple implementations. One equals one is always true, and two equals three is always false, so it seems weird to inject that functionality into the Hashing struct.

My thoughts on this is that there are some cases where traditional protocols still make the most sense. Equatable is a good example, because there is usually* only a need for one implementation per type, and also because having access to the `==` operator is really convenient.

(* Usually, but not always: we may want to compare our book models only based on IDs, ignoring ratings)

On the other hand, the added boilerplate of having to specify which *instance* of a protocol witness to use when creating a new complex, composed witness instance might be worth it. It's explicit. If you're working with a protocol with multiple possible implementations, this forces you to consider which one you're going to use, and to spell that out in code for other developers down the line.

---

## Bonus example 7: Lightweight, locally-scoped protocols

Another small downside to traditional protocols is that they must be globally scoped; in other words, you have to declare a protocol at the root of a file. You can't do this:

```swift
class MyButton {
  protocol MyButtonProtocol { // Bonk!
    func onTap()
  }
}
```

Protocol witnesses though, being structs, can be declared wherever it makes the most sense, so this is fine:

```swift
class MyButton {
  struct MyButtoning { // These names are getting weird
    let onTap: () -> Void
  }
}
```

If you've got a large codebase, it might be nice to know you don't have to pollute the global namespace with protocols relating to very specific concepts. Nifty!

---

## Epilogue

And so, we've reached the end of this series on protocol witnesses. I started writing this when I'd just discovered the concept, and I'm writing this epilogue after incorporating them throughout the codebase in my current project. My medium-term review is that they're great. They definitely look a little strange to new-joiners on the team, but they're easy enough to wrap your head around that it hasn't been a problem so far. If nothing else, they're much easier to navigate than `associatedtype`-based errors!
