---
title: "Swift protocol witnesses example 4: With generics"
published: 2021-03-16
tags: [generics, protocol, protocol witness, swift]
listed: false
excerpt: It’s time to deal with generics, and this is really where the advantage of the protocol witness pattern becomes apparent. Protocol witnesses, being expressed as dirt-basic structs, make it much less confusing to work with generic types. To highlight the differences, we will build up this example with the two paradigms shown side-by-side, almost.
---
This is part of a [series on protocol witnesses in Swift](/swift-protocol-witnesses/).

[<-- Example 3: Multiple implementations](/swift-protocol-witnesses/swift-protocol-witnesses-3/)


It’s time to deal with generics, and this is really where the advantage of the protocol witness pattern becomes apparent. Protocol witnesses, being expressed as dirt-basic structs, make it much less confusing to work with generic types. To highlight the differences, we will build up this example with the two paradigms shown side-by-side, almost.

In this example, we’ll define an abstract protocol for a state machine (borrowing from a [previous post](/a-simple-state-machine-in-swift/)).

## Abstract dependency definition

Let’s define the abstract protocol — as a protocol:

```
protocol StateMachineProtocol {
  associatedtype State
  associatedtype Event
  
  var state: State { get }
  func handle(event: Event)
}
```

… vs as a protocol witness:

```
struct StateMachineProtocolWitness<State, Event> {
  let state: () -> State
  let handleEvent: (Event) -> Void
}
```

Notably, to convert the get-only property `state`, we change its type slightly to a closure or function that returns a `State` value. This means that we will have to access the value by calling `state()` instead of `state`, but otherwise it is functionally equivalent. Again, if we wanted to, we could provide a client-facing getter variable that wraps our internal state-providing closure.

## Some concrete state types

Next, we’ll define a simple state and event type for our state machine implementations to use:

```
enum OnOffState {
  case on, off
}

enum OnOffEvent {
  case toggle
}
```

Our concrete state machine, which will be implemented for `OnOffState` and `OnOffEvent`, will simply toggle its state from on to off and vice versa.

## Client

Now we will define a client that depends on a state machine. But this client will not just depend on any state machine - it needs a state machine for `OnOffState`s and `OnOffevent`s, specifically.

This is where normal protocols start to show their limitations. Because our `StateMachineProtocol` has associated types, a statement like this is invalid in Swift:

```
var stateMachine: StateMachineProtocol!
```

This is fair, because it doesn’t even express what we need it to — namely, which associated types we need the state machine to be implemented for. If we try to pull this move, the compiler tells us that `Protocol 'StateMachineProtocol' can only be used as a generic constraint because it has Self or associated type requirements`.

Thus, to define our client in protocol world, we have to write this:

```
class OnOffStateMachineProtocolClient<StateMachine: StateMachineProtocol>
where StateMachine.State == OnOffState,
      StateMachine.Event == OnOffEvent
{
    var stateMachine: StateMachine!
}
```

Phew! When this started, I certainly didn’t think about my client as a generic class, and yet here we are.

By contrast, if we live in protocol witness world, we can define our client like this:

```
class OnOffStateMachineProtocolWitnessClient {
    var stateMachine: StateMachineProtocolWitness<OnOffState, OnOffEvent>!
}
```

Isn’t that just *so much* better? The code is almost *English* in its clarity — here we have a class with a state machine property, where that property is an implementation of the state machine protocol with the types that we specify.

## Concrete dependency implementation

Now, let’s create a concrete state machine implementation. Still borrowing from that previous post, we’ll keep the implementation lazy and let it accept its state transition logic as an init parameter, along with the initial state to use.

```
class StateMachine<State, Event> {
  typealias NextState = (State, Event) -> State

  init(state: State, nextState: @escaping NextState) {
    self.state = state
    self.nextState = nextState
  }

  func handle(event: Event) {
    state = nextState(state, event)
  }

  private(set) var state: State
  private let nextState: NextState
}
```

## Protocol conformance

This class already has a `state` property and `handle(event:`) function, so conforming it to `StateMachineProtocol` is simple:

```
extension StateMachine: StateMachineProtocol {}
```

(Side note. You could consider this an advantage of using normal protocols. We are able to leverage language-level features, and exploit the fact that the class’s members match the requirements in our protocol, to save ourselves from writing extra code to provide this protocol conformance. On the other hand, what if we have a mismatch between the names we want to use in our protocol definition and our implementation class? We’d either have to compromise on our preferred naming at one of the two sites, or create duplicative members on the implementing class, named according to the protocol’s definition, that redirect to the members named according to the class’s preference. This argument is pretty philosophical, but I can think of an example from my real codebase where a class has a `start` method from one protocol and a `startListening` from another, both of which do the same thing.)

Over in protocol witness world, we need to create an explicit implementation instance. We’ll opt to provide this implementation from the state machine instances themselves:

```
extension StateMachine {
  func stateMachineProtocolWitness() -> StateMachineProtocolWitness<State, Event> {
    StateMachineProtocolWitness<State, Event>(
      state: { self.state },
      handleEvent: { self.handle(event: $0 })
```

Admittedly less sexy than we had it in protocol world — it feels a little duplicative to pass `state` to `state` and `handle(event:)` to `handleEvent` — but nothing too outrageous here.

## Dependency injection

Let’s make a concrete state machine dependency:

```
let onOffStateMachine = StateMachine<OnOffState, OnOffEvent>(state: .on) {
  (state, _) in (state == .on) ? .off : .on
}
```

Now we’re ready to inject this dependency into our clients.

Starting on the protocol side, we try to write

```
var protocolClient = OnOffStateMachineProtocolClient()
```

But we are immediately hit with this mildly infuriating error: `Generic parameter 'StateMachine' could not be inferred`. We were forced to make the client generic to accommodate the generic protocol dependency, and now we are forced to specialise an instance of the client with the concrete dependency we intend to use:

```
var protocolClient = OnOffStateMachineProtocolClient<StateMachine<OnOffState, OnOffEvent>>()
protocolClient.stateMachine = onOffStateMachine
```

Considering our goal — which is to decouple the client from its dependency — this is definitely not ideal. If we, for example, created a different state machine implementation that conformed to the same protocol, we would not be able to inject it into our client class instance. Hopefully it is becoming apparent why we have embarked on this journey; a better way to handle generic, abstract dependencies is clearly needed.

And speaking of a better way, let’s do the injection on the protocol witness side:

```
var protocolWitnessClient = OnOffStateMachineProtocolWitnessClient()
protocolWitnessClient.stateMachine = onOffStateMachine.stateMachineProtocolWitness()
```

Despite the introduction of generics, this code is essentially the same as what we’ve seen in all the previous examples. The client remains oblivious of any specific implementation of the protocol — no need for additional generic specialisation.

## Recap

Hopefully this example has demonstrated how protocol witnesses, once you can grok the basic concept, allow us to use protocol-like concepts with generics without the headaches that can so easily accompany `associatedtype`s in protocols. We’ve also covered the fact that they allow us to write multiple implementations of the same protocol, with a slightly contrived example. We can now dive deeper into that point. For a generic protocol, protocol witnesses allow us to provide per-type conformance.

[Example 5: An implementation per type -->](/swift-protocol-witnesses/swift-protocol-witnesses-5/)