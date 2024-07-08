---
title: "Swift protocol witnesses example 5: An implementation per type"
published: 2021-03-16
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: As we mentioned in a previous example, a limitation of normal protocols is that each class can only implement a protocol once. Here is an example of a protocol-like concept that is only implementable using a protocol witness.
---
This is part of a [series on protocol witnesses in Swift](/swift-protocol-witnesses/).

[<-- Example 4: With generics](/swift-protocol-witnesses/swift-protocol-witnesses-4/)


As we mentioned in a previous example, a limitation of normal protocols is that each class can only implement a protocol once. Here is an example of a protocol-like concept that is only implementable using a protocol witness.

Say I want to create an abstract expression of the notion that one type can be converted to another. We could define a protocol:

```
protocol Convertible {
  associatedtype To
  func convert() -> To
}
```

And we can conform a type to this protocol; for example, we can make `Int` convertible to `String`:

```
extension Int: Convertible {
  func convert() -> String {
    return “\(self)”
  }
}

let s: String = 1.convert()
```

But if we *also* want to make the same type convertible to another type, we’re out of luck. For example, we may want to do this:

```
extension Int: Convertible {
    func convert() -> Float {
        return Float(self)
    }
}

let f: Float = 1.convert()
```

But because we already created one conformance of `Int` to `Convertible`, we’re not allowed to create another. The compiler tells us `Redundant conformance of 'Int' to protocol 'Convertible’`.

`Convertible` is a silly example, but I have come across many real use cases in my code where I wanted to create type-specific implementations of a protocol. Luckily, with protocol witnesses, this is easy:

```
struct Converting<From, To> {
  let convert: (From) -> To
}

extension Converting where From == Int, To == String {
  static let intToString = Self { "\($0)" }
}

extension Converting where From == Int, To == Float {
  static let intToFloat = Self { Float($0) }
}

let s: String = Converting.intToString.convert(1)
let f: Float = Converting.intToFloat.convert(1)
```

Your next question might be: can I actually replace *all* my protocols with protocol witnesses? One particular issue that we haven’t discussed yet is whether we can model protocol inheritance in protocol witness world. It can be quite a crucial point, depending on your needs. As always, let’s see in the next example.

[Example 6: Composed protocols -->](/swift-protocol-witnesses/swift-protocol-witnesses-6/)