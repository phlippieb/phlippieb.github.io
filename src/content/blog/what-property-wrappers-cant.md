---
title: What property wrappers can't do
published: 2021-05-06
tags: [property wrapper, swift]
listed: true
excerpt: Every time I see an opportunity to make something easier with PWs (which is what the cool kids call them), it turns out that my use case is just not supported. Why not? Because in Swift, a property cannot be both wrapped and lazy.
---
As a Swift enthusiast, you already know about [property wrappers](https://docs.swift.org/swift-book/LanguageGuide/Properties.html). But have you been using them? I have not -- but not for lack of trying. Every time I see an opportunity to make something easier with PWs (which is what the cool kids call them), it turns out that my use case is just not supported.

Why not? Because in Swift, a property cannot be both wrapped *and* lazy.

That doesn't sound a like a big deal -- and it isn't! property wrappers are clearly very useful, even with that restriction! -- but it does mean that for some use cases, PWs are not a solution. Let's see an example.

## Example use case with debouncers

We make extensive use of debouncers in our project. There's a bit more sophistication in our actual codebase, but we'll drum up a simple example below. Suppose a debouncer is defined like this:

```swift
class Debouncer {
  func debounce() {}
}
```

In practice, we would want to register a callback when the debouncer times out, but for this example, all we want to do is send a signal to the debouncer.

Now suppose we have a class with a few values that, when updated, should send signals to a debouncer:

```swift
class SomeView {
  var title = "" {
    didSet { self.debouncer.debounce() }
  }

  var body = "" {
    didSet { self.debouncer.debounce() }
  }

  let debouncer = Debouncer()
}
```

This might represent a sort of view model where we don't want data updates to spam the UI, or perhaps a state model where we send API requests when data changes. Either way, what we have is a group of properties that signal to the same debouncer when they are updated, where that debouncer is locally scoped.

While I was implementing this, I thought that this felt like the type of thing that a property wrapper might solve. I envisioned that we could change the class code to this:

```swift
class SomeView {
  @DebounceChanges(to: self.debouncer) var title = ""
  @DebounceChanges(to: self.debouncer) var body = ""
  let debouncer = Debouncer()
```

This would make the code less cumbersome to write, while still keeping the intent clear: for each property in the class, if the value changes, we signal that change to the given debouncer.

## Seems easy enough

So I set about implementing it, and it seemed easy enough. My PW looked something like this:

```swift
@propertyWrapper struct DebounceChanges<T> {
  init(wrappedValue: T, to debouncer: Debouncer) {
    self.wrappedValue = wrappedValue
    self.debouncer = debouncer
  }

  var wrappedValue: T {
    didSet { self.debouncer.debounce() }
  }

  private let debouncer: Debouncer
}
```

Reassuringly, this compiled fine. But then I started to write a test, and a familiar sinking feeling started to arise -- Swift doesn't support this.

## Swift doesn't support this

For my test, I wrote a test class:

```
class SUT {
  let debouncer = Debouncer()
  @DebounceChanges(to: self.debouncer) var x = 1
}
```

But of course, `self.debouncer` isn't available to `x`'s declaration, because `self` isn't available yet. Normally I would get around this by making the property lazy, which allows it to reference self, but as I stated in the beginning of this post, Swift doesn't support wrapped properties being lazy.

I played around with autoclosures, normal closures, etc, but there is just no getting around the fact that I need the property to reference `self`, and with PWs, this is outright impossible.

## Another example

The reason why this sinking feeling was familiar was because I had embarked on this disappointing journey before. There is a very peculiar crash that you can reproduce pretty easily, that I had hoped to solve with PWs, only to be let down.

Suppose you have a class that listens for keyboard frame changes, allowing you to react:

```swift
class KeyboardListener {
  /// - Parameter onUpdate: Your code here
  init(onUpdate: @escaping (CGFloat) -> Void) {
    ...
  }

  /// Call this when the screen becomes visible
  func start() {
    ...
  }

  /// Call this when the screen becomes invisible
  func stop() {
    ...
  }
}
```

Now suppose this is how you use this listener:

```swift
class MyScreen: UIViewController {
  lazy var keyboardListener = KeyboardListener { [weak self] offset in
    ...
  }

  func startKeyboardListenerIfNeeded() {
    if someCondition {
      keyboardListener.start()
    }
  }

  deinit {
    self.keyboardListener.stop()
  }
}
```

Critically, you don't start the listener immediately, maybe to avoid performance issues, but to be safe, you always stop it when the class is deinitialised. This seems like a dilligent and responsible choice, but you have now introduced a crash. If you deinit the screen without having lazily created the keyboard listener first, the lazy initialiser (which references self) will crash.

The exact requirements for this crash seem to be as follows:

1. Class inherits from `NSObject` (as `UIViewController` does)
2. Class has a lazy var that references self
3. The lazy var is not initialised
4. The lazy var is referenced (for the first time) during the class' deinit

Again, this seemed like a good candidate for a PW. This almost looks like it'll solve the issue:

```swift
@propertyWrapper class Lazy<T> {
    init(wrappedValue: T) {
        self.initializer = { wrappedValue }
    }
    
    var wrappedValue: T {
        if let value = self.valueIfInitialized {
            return value
        } else {
            let value = self.initializer()
            self.valueIfInitialized = value
            return value
        }
    }
    
    private let initializer: () -> T
    private(set) var valueIfInitialized: T?
}
```

Until you try to use it to solve the actual use case:

```
class Test {
  @Lazy var keyboardListener = KeyboardListener { [weak self] offset in
    ...
  }
}
```

You'll see `self` light up with the error "cannot find self in scope" (:

## So

So in conclusion, PWs seem to be really cool, but every time I find a use case that I try to use them to solve, I hit my head against the restriction that a var cannot be a PW and lazy (or in fact reference `self` in any way) at the same time. May you have more luck than me.