---
title: A simple state machine in Swift
published: 2021-03-15
tags: [state machine, swift]
listed: true
excerpt: I try to write Swift code in a more protocol-oriented way these ways, to make it easier to decouple things down the line. So let's start by declaring an interface for our state machine
---
When it comes to state machines, I always get the feeling that I'm missing something - they're supposedly hairy, tricky things that take a while to wrap your head around.

So I decided to try and make one in Swift. In fact, I decided to make a reusable, generic state machine type that can be used to represent all kinds of state machines.

## Version 1

I try to write Swift code in a more protocol-oriented way these ways, to make it easier to decouple things down the line. So let's start by declaring an interface for our state machine:


```swift
protocol StateMachine {
  associatedtype State
  associatedtype Event
  
  var state: State { get }
  func handle(event: Event)
}
```

A state machine is a thing that stores state and updates that state when it receives events. As a client, you can ask the machine what its current state is, and you can tell it handle an event, which may result in the state being updated.

Now, a concrete implementation:

```swift
class StandardStateMachine<State, Event>: StateMachine {
  typealias NextState = (State, Event) -> State
  
  init(state: State, nextState: @escaping NextState) {
    self.state = state
    self.nextState = nextState
  }

  func handle(event: Event) {
    self.state = self.nextState(self.state, event)
  }

  private(set) var state: State
  private let nextState: NextState
}
```

Very simple: a concrete state machine is created with a function that determines the next state, given a current state and an event, as well as the initial state.

And that's pretty much it! We can now create concrete state machines; for example, this one models simple traffic light states:

```swift
enum TrafficLightState {
  case red, green, yellow
}

enum TrafficLightEvent {
  case change
}

let machine = StandardStateMachine(state: .red) {
  (current: TrafficLightState, event: TrafficLightEvent) in
  switch (current, event) {
  case .red: return .green
  case .green: return .yellow
  case .yellow: return .red
  }
}

print(machine.state) // red
machine.handle(.change)
print(machine.state) // green
machine.handle(.change)
print(machine.state) // yellow
machine.handle(.change)
print(machine.state) // red
```

## Version 2

Another way to implement state machines is to make our state responsible for knowing how handle its own events. Let's express that with a protocol:

```swift
protocol StateMachineState {
  associatedtype Event
  func next(for event: Event) -> Self
}
```

That's promising. Now let's define an updated state machine protocol. Because states know how to determine their own "next states", we can provide a default implementation for state machines to handle events.

```swift
protocol StateMachine {
  associatedtype State: StateMachineState
  var state: State { get set }
}

extension StateMachine {
  mutating func handle(event: State.Event) {
    self.state = self.state.next(for: event)
  }
}
```

The downside here is that the protocol must now declare the state property as settable, so clients can manipulate state directly without having to follow the rules of the state machine. There's also quite a bit of ugly grammar, such as the `mutating` modifier that is required. (We can get around that by making `StateMachine` class-bound; the trade-off is that we won't be able to make state machine structs.)

## Version 3

So let's take a step back. We have a simple, unassuming protocol for state machines from version 1, and we have a smarter protocol for states from version 2. The easiest way to cook a nice state machine implementation out of those ingredients would be to do the mixing in a class instead of a protocol extension.

```swift
class StandardStateMachine<State: StateMachineState>: StateMachine {
  init(state: State) {
    self.state = state
  }

  func handle(event: State.Event) {
    self.state = self.state.next(for: event)
  }

  private(set) var state: State
}
```

Relying on the state type to tell us how to determine the next state for a given event has allowed us to clean up this class a bit. No need to pass a closure to specify state logic any more.

Reworking our traffic light example:

```swift
enum TrafficLightState {
  case red, green, yellow
}

enum TrafficLightEvent {
  case change
}

extension TrafficLightState: StateMachineState {
  func next(for event: TrafficLightEvent) -> TrafficLightState {
    switch (self, event) {
    case (.red, .change): return .green
    case (.green, .change): return .yellow
    case (.yellow, .change): return .red
  }
}

let machine = StandardStateMachine(TrafficLightState.red)
```

## Which is best?

The differences between version 1 and 3 are that, in version 3, state types are aware of their participation in state machines, and are tightly coupled to their corresponding event types. In version 1, any state type can be combined with any event type with custom logic to fit the use case; in fact, the same pair of state and event types can be reused with different logic for different state machines.

So version 1 is more flexible. But in practice, we might not need this flexibility, and may in fact prefer it if the different puzzle pieces of state machines lock together more tightly. So as always, it depends ¯\\\_(ツ)_/¯