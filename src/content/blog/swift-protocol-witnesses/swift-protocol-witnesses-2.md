---
title: "Swift protocol witnesses example 2: Instance-bound implementation"
published: 2021-03-16
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: For this example, we’ll create a little ecosystem around a logger dependency. From our client’s perspective, a logger must simply be able to log messages. But our concrete logger implementation will have its own state, and because of that, we will be forced to associate the logger protocol with an instance of a concrete logger. This means that we won’t be allowed to cheat by giving the logger a static implementation, like we did in the previous example.
---
This is part of a [series on protocol witnesses in Swift](/posts/swift-protocol-witnesses/).

[<-- Example 1: The basics](/posts/swift-protocol-witnesses/swift-protocol-witnesses-1/)

For this example, we’ll create a little ecosystem around a logger dependency. From our client’s perspective, a logger must simply be able to log messages. But our concrete logger implementation will have its own state, and because of that, we will be forced to associate the logger protocol with an instance of a concrete logger. This means that we won’t be allowed to cheat by giving the logger a static implementation, like we did in the previous example.

Let’s first paint the picture using normal protocols.

## Before

Using normal Swift protocols, our little ecosystem looks like this:

```
protocol Logging {
  func log(message: String)
}

class LoggingClient {
  var logger: Logging!

  func doSomething() {
    logger.log(message: “42”)
  }
}

class PrintLogger: Logging {
  func log(message: String) {
    print(message)
    logCounter += 1
  }

  var logCounter = 0
}

let client = LoggingClient()
let printLogger = PrintLogger()
client.logger = printLogger
client.doSomething() // Prints “42”
printLogger.logCount // 1
```

Note that `PrintLogger` keeps track of how many times it has logged. This is a silly example, but it acts as a stand-in for any number of realistic scenarios: a real logger might keep the last hundred or so logs around to include in a crash report; or it might have a settable filter to customise which log levels we want to see. The point is, *it has state*, and as such, it matters that we’re dealing with a specific instance of a `PrintLogger`.

What does this look like with protocol witnesses?

## After

Starting with the protocol, our witness struct will look like this:

```
struct Logging {
  let log: (String) -> Void
}
```

In other words, a conforming instance of the `Logging` protocol should provide a closure to call when a client wants to log a string.

We have to make one change to `LoggingClient`, because its `logger` dependency is now an instance of a struct, where that struct has a stored closure called `log`; it is no longer a function, so it doesn’t have a labeled parameter anymore. The only part that changes is how we call `log`:

```
// Before: logger.log(message: “42”)
logger.log(“42”)
```

This is a small but notable downside to using protocol witnesses in the way we demonstrate here: closures don’t have labeled parameters. We can, of course, work around this by providing an outward-facing method with the nicest labeled parameters we can think of, which simply calls the internally-stored closures under the hood. So while we’re talking about it, let’s refactor our protocol witness:

```
struct Logging {
  init(log: (String) -> Void) {
    self._log = log
  }

  func log(message: String) {
    self._log(message)
  }

  private let _log: (String) -> Void
}  
```

Depending on the severity of your OCD, this may or may not be what you want. I personally prefer to rely on Swift’s synthesis as much as possible, so I’d rather not write custom `init`s for structs where Swift already provides default `init`s.

Alright, next up is the magic bit. Time to create a concrete “conformance” instance of `Logging` for our concrete `PrintLogger` class. We’ll remove the `: Logging` from the class declaration, as we’re no longer dealing with a normal protocol. Then we will create a static method on `Logging` to provide an implementation of the protocol.

```
class PrintLogger {
  func log(message: String) {
    print(message)
    logCounter += 1
  }

  var logCounter = 0
}

extension Logging {
  static func printLogger(_ logger: PrintLogger) -> Logging {
    return Logging(log: logger.log)
  }
}
```

When comparing this to the conformance instance from example 1, there are two important differences to note:

1. Instead of a static instance, we now have a static method.
2. Instead of initialising the `Logging` instance that is returned with a literal closure, we pass the whole `log` method from the concrete logger to the initialiser.

The second point sounds complicated, but it’s quite easy to understand. Because of how `Logging` is defined, Swift provides multiple valid syntaxes to initialise an instance. The following three initialisation statements are equivalent and equally valid:

```
// Given some `logger`,
let logging1 = Logging(log: { logger.log($0) }
let logging2 = Logging { logger.log($0) }
let logging3 = Logging(log: logger.log)
```

Cycling back to the first point, we said that we now provide a concrete protocol witness of `Logging`, which relies on the implementation provided by `PrintLogger`, using a method… but why? Well, recall that we said that it matters that `PrintLogger` implements `Logging` as an *instance method*, not as a *static method*. So to assign the implementation of the `log(message:`) function from a `PrintLogger` instance to a `Logging` instance, we will need a `PrintLogger` instance. One way to obtain such an instance is to provide it as a parameter to a method, like we have done here.

Let’s inject a `PrintLogger` as an implementation of `Logging` into our client:

```
let client = LoggingClient()
let printLogger = PrintLogger()
client.logger = .printLogger(printLogger)
```

A different approach that we might take is to provide `Logging` conformance as an instance method of `PrintLogger` instances themselves:

```
extension PrintLogger {
  var logging: Logging {
    return Logging(log: self.log)
  }
}

let client = LoggingClient()
let printLogger = PrintLogger()
client.logger = printLogger.logging
```

I think the second approach might make more sense in this scenario. Even though the two approaches are similar, I feel like the second approach more cleanly expresses that the conforming class implements the protocol. Imagine that we create a few more implementations of things that can be used as loggers. If we follow the first approach and make all the implementations available from the `Logging` type, it seems like we are collecting a “menu” of implementations on the protocol type, which has no business knowing how it is implemented. By comparison, adding protocol conformance as an instance member on each new type is more analogous to adding protocol conformance to types with normal protocols; the concrete type knows the details of how it conforms to the protocol, so this conformance is expressed as an extension of the concrete type.

## Recap

Now we've made up for playing dirty in the first example by demonstrating a more realistic use case, where a protocol witness is satisfied by an instance method of a conforming class. The "conformance" to the protocol witness requires an instance of the conforming type, so we implemented that conformance in a way that requires the client to provide the instance. Of course, if the client doesn't need access to that instance, we could have approached it differently, by creating an anonymous instance to be used in the conformance method. Either way, we are now able to conform objects to protocol witnesses in a way that we can leverage the state of those objects.

Ok, but why? It’s neat to be able to create explicit instances of protocol conforming implementations, but does this give us anything? Well, stick around for the next example and find out!

[Example 3: Multiple implementations -->](/posts/swift-protocol-witnesses/swift-protocol-witnesses-3/)
