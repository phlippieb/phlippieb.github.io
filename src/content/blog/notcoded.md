---
title: Let’s make a Swift property wrapper that ignores variables when en/decoding
published: 2021-05-14
tags: [codable, hashable, property wrapper, swift]
listed: true
excerpt: In this post, we create a property wrapper that can be used to “skip” properties when encoding or decoding an object. This is useful when we want to add properties to an object that we don’t need to encode, especially if those properties are not codable themselves.
---
In this post, we create a property wrapper that can be used to “skip” properties when encoding or decoding an object. This is useful when we want to add properties to an object that we don’t need to encode, especially if those properties are not codable themselves.

## The Codable protocol, and Swift’s automatic conformance synthesis

Let’s first go over the basics of the Codable protocol, and see Swift’s ability to synthesise conformance to this protocol.
Say you’re defining a model in Swift:

```swift
struct MyModel {
   let id: Int
   let name: String
}
```

You then decide that this model should be “codable” — you want to be able to encode it into an encoder, or decode it from a decoder. Luckily, Swift is very smart and makes this really easy. All you have to do is declare that the model is Codable:

```swift
struct MyModel: Codable {
   let id: Int
   let name: String
}
```

Swift has synthesised the implementation of the protocol for us, because each field in the struct already conforms to Codable. We can confirm that it works by using the built-in JSON encoder:

```swift
let model1 = MyModel(id: 1, name: "Bob")
let encoder = JSONEncoder()
let encoded = try! encoder.encode(model1)
let decoder = JSONDecoder()
let decoded = try! decoder.decode(MyModel.self, from: encoded)
```

If we inspect the decoded value, we will see that it contains the same values as the original.

## Adding a non-Codable property, why we want to ignore it when encoding

Swift’s ability to synthesise conformance to the Codable protocol, without us having to write any code other than simply adding : Codable after the struct name, is incredibly convenient, but it comes with a caveat. Each property in the struct or class must be Codable itself. If we add a property that is not Codable, we lose the magic conformance.

Let’s do that now:

```swift
struct MyModel: Codable {
   let id: Int
   let name: String
   
   /// Cached formatted name
   var formattedName: NSAttributedString? = nil
}
```

NSAttributedString does not conform to Codable, so Swift can no longer synthesise conformance. The whole struct lights up with the error `“Type ‘MyModel’ does not conform to protocol ‘Codable’”`.

If we want to persist all the data on this model, we are forced to implement the protocol stubs (namely encode(to:) and init(from:) ) for our struct. And in doing so, even though we added just one non-codable field, we are now responsible for encoding and decoding every single field.
However, taking a closer look at the change we just made, we might realise something: we don’t actually want to persist the new field! We just want to use it as a cache to store some formatted text while the model is being displayed. If we could somehow tell Swift that this field doesn’t matter when encoding the object — that it should be skipped — then we might regain that automatic synthesis.

The goal, then, is to be able to declare our model like this, and have Swift still handle the encoding and decoding for us automatically:

```swift
struct MyModel: Codable {
   let id: Int
   let name: String
   
   /// Cached formatted name
   @NotCoded var formattedName: NSAttributedString
}
```

## Implementation time

How do we implement this? For starters, it’s clearly going to be a property wrapper. Moreover, for this to work, the wrapped property must conform to Codable, so that Swift is able to synthesise protocol conformance for any struct with a NotCoded property. And crucially, when we implement conformance for the property wrapper, we don’t actually care about the implementation; we’ll basically lie to Swift and say that a NotCoded property is Codable, and then actually make it not do any of the encoding or decoding work.

But this raises a problem: if we’re not actually going to decode anything, what should the value of a NotCodedproperty be when it’s decoded? We’ll need some kind of default value. The simplest way to do that in Swift is by defaulting to nil , and that’s what we’ll do here, but if you already have something like a DefaultInitable protocol in your project that allows you to call init() on conforming instances, you could work that in.

So now it’s implementation time:

```swift
/// A property wrapper for properties of a type that should be "skipped" when the type is encoded or decoded.
@propertyWrapper
public struct NotCoded<Value> {
  private var value: Value?
  public init(wrappedValue: Value?) {
    self.value = wrappedValue
  }
  public var wrappedValue: Value? {
    get { value }
    set { self.value = newValue }
  }
}

extension NotCoded: Codable {
  public func encode(to encoder: Encoder) throws {
    // Skip encoding the wrapped value.
  }
  public init(from decoder: Decoder) throws {
    // The wrapped value is simply initialised to nil when decoded.
    self.value = nil
  }
}
```

Due to the fact that we represent un-decoded fields with nil , we have to make a small change to our model struct; the cached value is made optional:

```swift
struct MyModel: Codable {
   let id: Int
   let name: String
   
   /// Cached formatted name
   @NotCoded var formattedName: NSAttributedString?
}
```

## What else can we do with this pattern?

We can use this pattern to mark a field as “skipped” so that Swift can synthesise protocol conformance for our types. Aside from Codable, we can also do this Hashable (e.g. if a struct contains fields that are not Hashable themselves), and so on.

But aside from retaining automatic protocol conformance synthesis, we can also use this pattern to change the behaviour of our code. Let’s consider a NotHashed property wrapper. We can, of course, wrap any property to skip hashing it, including properties that would otherwise modify an object’s hash. 

So say we have a model like this:

```
struct BookModel {
  let id: Int
  let name: String
  let rating: Int
}
```

Depending on our use case, we may not want to include a book’s rating when we’re hashing. For example, as you know, when a type is Hashable, it is also Equatable. If we want to check whether two books are the same for the purposes of, say, finding duplicates in an array, we don’t want two books with the same ID and name to be considered different just because they have different ratings.

So, once we have defined our NotHashed wrapper based on the pattern demonstrated above, we could modify our model to look like this:

```swift
struct BookModel: Hashable {
  let id: Int
  let name: String
  @NotHashed let rating: Int
}
```

Obviously you should be careful when doing something like this; perhaps add clear documentation explaining that some fields are excluded from the object’s hash. But if you need to skip fields when hashing, encoding, decoding, etc, hopefully this pattern makes your life easier.
