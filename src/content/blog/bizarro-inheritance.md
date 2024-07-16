---
title: Bizarro inheritance
published: 2024-06-25
tags: [swift, software design, ergonomics]
listed: true
excerpt: When you really think about it, what *is* inheritance in object orientation? Intuitively, we tend to think of it as an "is a"-relationship. A car *is a* vehicle. A house *is a* building. A dog *is an* animal. But from a programming language perspective, the way it works can be expressed in a different way — as "has a" + fancy syntax.
---

When you really think about it, what *is* inheritance in object orientation? Intuitively, we tend to think of it as an "is a"-relationship. A car *is a* vehicle. A house *is a* building. A dog *is an* animal. But from a programming language perspective, the way it works can be expressed differently — as "has a" + fancy syntax.

Let's look at the car/vehicle relationship and turn it on its head. Traditionally, you'd express it like this (Pretend we don't need initialisers):

```swift
class Vehicle {
  var numberOfPassengers: UInt
}

class Car: Vehicle {
  var numberOfWheels: UInt
}
```

This lets us create a car and access its properties, as well as its *parent's* properties:

```swift
let car = Car()
print(car.numberOfWheels) // Property defined for `Car`
print(car.numberOfPassengers) // Property defined for `Vehicle`
```

Now, let's change it to a *has a* relationship. While we're at it, let's change the classes to structs, because we're basically dropping down to a lower level of abstraction.

```swift
struct Vehicle {
  var numberOfPassengers: UInt
}

struct Car {
  var vehicle: Vehicle
  var numberOfWheels: UInt
}
```

Instead of inheriting from `Vehicle`, our `Car` type is now *composed* of a vehicle plus its own fields. To access the parent's fields, we now need to be more explicit:

```swift
let car = Car(...)
print(car.numberOfWheels) // We can still access a Car's properties directly
print(car.vehicle.numberOfPassengers) // But we need to access Vehicle's properties through the composition property
```

We can make this setup work more like inheritance by providing getters:

```swift
extension Car {
  var numberOfPassengers: UInt {
    get { vehicle.numberOfPassengers }
    set { vehicle.numberOfPassnegers = newValue }
  }
}
```

And we can add some standardisation by introducing protocols:

```swift
protocol IsVehicle {
  var numberOfPassengers: UInt { get set }
}

struct Vehicle: IsVehicle {
  // ... this stays the same
}

struct Car: IsVehicle {
  var vehicle: Vehicle

  var numberOfPassengers {
    get { ... } // this is as above
    set { ... }
  }

  var numberOfWheels: UInt
}
```

And we could make things more convenient with default protocol implementations:

```swift
protocol HasVehicle {
  var vehicle: Vehicle { get set }
}

extension HasVehicle: IsVehicle {
  var numberOfPassengers {
    get { vehicle.numberOfPassengers }
    set { vehicle.numberOfPassengers = newValue }
  }
}
```

I think the last part is the most interesting. It shows us that

- If we provide some boilerplate default plumbing, HasVehicle and IsVehicle are equivalent
- This means that `composition + nice syntax ≈ inheritance`
- You can implement an inheritance relationship from scratch using basic language tools
- OO languages basically just give you syntax to achieve this implicitly rather than explicitly

This also gives us a different perspective to think about the limits of traditional inheritance. Many OO languages forbid multiple inheritance; the argument is that if there is a conflicting field, which parent class is it derived from? But using composition as a stand-in for inheritance, especially if we eschew all the protocol niceness, we can easily have "multiple inheritance", and disambiguate conflicting parent properties by just referencing the parent explicitly. As in:

```swift
struct FillableShape {
  func draw() { ... }
}

struct OutlineShape {
  func draw() { ... }
}

struct MyShape {
  var fillable: FillableShape
  var outline: OutlineShape
}

// We can specify which `draw` to use
MyShape(...).fillable.draw()
MyShape(...).outline.draw()

// Or we can define what `draw` means for MyShape
extension MyShape {
  func draw() {
    fillable.draw()
    outline.draw()
  }
}
```

This is similar to how the [Protocol Witness](/posts/swift-protocol-witnesses/) pattern gives us a lower level, more explicit way to think about protocols. Language features like inheritance and protocol conformance help us write less code, but sacrifices some customisation by opting for sensible default implementations. We can always go down to a lower level and make things explicit.
