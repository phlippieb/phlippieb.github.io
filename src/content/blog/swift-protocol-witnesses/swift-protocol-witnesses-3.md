---
title: "Swift protocol witnesses example 3: Multiple implementations"
published: 2021-03-16
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: Protocol witnesses, as we have discussed them so far, already offer a notable benefit over protocols. With normal protocols, a class can only conform to a protocol in one way. With protocol witnesses, on the other hand, we create an explicit instance for each way that a class conforms to a protocol, so we can create arbitrarily many different implementations of a single class to a single protocol.
---
This is part of a [series on protocol witnesses in Swift](/swift-protocol-witnesses/).

[<-- Example 2: Instance-bound implementation](/swift-protocol-witnesses/swift-protocol-witnesses-2/)

Protocol witnesses, as we have discussed them so far, already offer a notable benefit over protocols. With normal protocols, *a class can only conform to a protocol in one way*. With protocol witnesses, on the other hand, we create an explicit instance for each “way” that a class conforms to a protocol, so we can create arbitrarily many different “implementations” of a single class to a single protocol.

To demonstrate this, we’ll modify our `CanFoo` example:

```
struct CanFoo {
  let foo: () -> Void
}

class Fooer {
  func foo(debug: Bool = false) {}

  lazy var canFoo = CanFoo { self.foo() }
  lazy var canFooDebug = CanFoo { self.foo(debug: true) }
}

class FooClient {
  var fooer: CanFoo!
}

let client = FooClient()
let fooer = Fooer()
client.fooer = (debug) ? fooer.canFooDebug : fooer.canFoo
```

Admittedly, the `debug` scenario is a little contrived, but the point is: the same class (`Fooer`) conforms to the same protocol (`CanFoo`) in two different ways, and because those two different ways are stored in two different explicit protocol witness instances, we can pick which one we’d like. This is simply not possible with normal protocols; we are only allowed to write `extension Fooer: CanFoo` once. If we want different implementations, we need different classes.

So far so good, but also so far this has had nothing to do with generics. Isn’t this series about protocols with generics? Why yes! That brings us to our next example.

[Example 4: With generics -->](/swift-protocol-witnesses/swift-protocol-witnesses-4/)