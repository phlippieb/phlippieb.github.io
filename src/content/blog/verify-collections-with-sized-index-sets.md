---
title: Verify collections with sized index sets
published: 2023-05-11
tags: [swift, unit testing]
listed: true
excerpt: Let's implement a concept that I'll call sized index sets* Another way to think about them is to call them exact numbers of indices. They're a little confusing, because they represent two ideas that seem different, but are really two sides of the same coin.
---
In this post, I implement a rather slippery concept in Swift: index sets with exact sizes. 
Why? 
Partly because it'll let us stretch our Swift-muscles a bit.
Partly because the use case presented here actually came up (more or less in this shape) as part of my work, and I found it to be an interesting little puzzle.

To understand what I mean by "index sets with exact sizes", I'll set up a simple example use case.

## Use case - collection verification

Say I find that a lot of my unit tests focus on verifying the contents of collections.
Not just in an abstract, general way, but in an element-by-element fashion.
For example, I might frequently test my view models by checking that it produces precisely the item models that I expect; something like:

```swift
func testNoContent() {
    viewModel.state = .noContent
    let items = viewModel.items
    XCTAssertEqual(items.count, 1)
    XCTAssertEqual(items.first!.title, "No content")
}
```

Write enough of these tests, and you'll notice some boilerplate emerging: 
you're frequently checking how many elements are in a collection, and then checking the contents of each element one-by-one.
This check is rather inelegant.
To verify each element, you pull it from the collection by index (with the `[0]` operator), hoping it exists.

For demonstration purposes, though, let's change the use case code to something simpler, with a few more elements:

```swift
func testSmallCollection() {
  let collection = [1, 2, 3]
  XCTAssertEqual(collection.count, 3)
  XCTAssertEqual(collection[0], 1)
  XCTAssertEqual(collection[1], 2)
  XCTAssertEqual(collection[2], 3)
}
```

## Helper method, version one

There's an opportunity to consolidate these kinds of tests with a helper method.
Let's write a simple first version of a mixin:

```swift
protocol CollectionVerifying {}

extension CollectionVerifying {
    func verify<C: Collection>(_ collection: C, count: Int, _ verify: (Int, C.Element) -> Void) {
        XCTAssertEqual(collection.count, count)
        collection.enumerated().forEach(verify)
    }
}
```

This method first checks that you have the expected number of elements.
Then it enumerates over those elements, producing little (index, element) pairs, and passes them to a given verification block.
Using it looks like this:

```swift
func testSmallCollection() {
  verify([1, 2, 3], count: 3) { index, element in
    switch index {
    case 0: XCTAssertEqual(element, 1)
    case 1: XCTAssertEqual(element, 2)
    case 2: XCTAssertEqual(element, 3)
    default: XCTFail()
    }
  }
}
```

Okay, not bad. 
Granted, it's not much shorter than the original, but we got rid of lots of duplication.
We have standardised how we check the number of elements, and also how we can iterate over each element alongside its index in the collection. 
No need to manually pluck each element out of the collection anymore.

What irks me, however, is the need for the default case at the end of the switch.
It will always be required.
This is because we use Int as our index type, and there are always going to be more Ints than we have elements in our collections.

It actually points to a subtle design flaw.
Not a serious one, but an interesting one nonetheless.
Logically, our concepts of the expected size of the collection (i.e. `count: 3`) is tightly linked to the body where we handle all the elements (`case 0, case 1, case 2`).
But the code does not adequately reflect this relationship.
I can add a handler for a new case (e.g. `case 3: XCTAssertEquals(element, 4)`) to the switch, and it will appear at a glance as if the test proves that this element is in the collection.
But it won't be, and the test will fail to indicate that (i.e. the test will still pass), because I did not update the `count` argument to 4.
These two logically linked concepts can become out of sync, due to the way the code is designed.
This is the subtle design flaw.

So can we find a way to specify exactly how many indices we care about in such a way that the default case falls away?
Can such a concept also tie into how we assert the size of the collection?

## Helper method, version two: vision

The dream here is to change our client code to something like this:

```swift
func testSmallCollection() {
  verify([1, 2, 3], count: 3) { index, element in
    switch index {
    case 0: XCTAssertEqual(element, 1)
    case 1: XCTAssertEqual(element, 2)
    case 2: XCTAssertEqual(element, 3)
    }
  }
}
```

This would be an improvement, because changing the expected count would also force us to change the handler.
The two would be mechanically linked.

Spoiler alert: we won't be able to achieve this exact syntax, but we will be able to get rid of the default case.
In practice, since numbers like `0`, `1` and `2` are Int literals in Swift, we will have to declare new things that are almost like those, but not quite.

## Sized index sets

In order to get this to work, we will have to implement a concept that I'll call *sized index sets*. 
Another way to think about them is to call them *exact numbers of indices*.
They're a little confusing, because they represent two ideas that seem different, but are really two sides of the same coin:

- A sized index set is a set of contiguous indices, starting from 0, with a specific and known size — e.g. `[0, 1, 2]`
- It is also, more simply, just the number of elements in such a set

Surprisingly, these two concepts are equivalent. 
You can't have a set of `[0, 1, 2]`, which has 3 items, while claiming it has 4 items. 
You also can't claim to have a set of 3 items, and also claim that it contains the indices 1, 3, and -1.
The number of items dictates the elements in the set, and vice versa.

### Using it as a size

A useful effect of this equivalence is that we can pass a concrete set to our verifier function in order to specify the expected size of a collection.
If we define a set like this:

```swift
enum TwoIndices {
    case zero, one
}
```

... then we can indicate that we expect a collection to contain two items like so:

```swift
verify([1, 2], count: TwoIndices.self) { ... }
```

Following so far?

### Using it as an iterable set

The other side of the coin is that we should be able to iterate over all elements in such an index set.
Swift has the `CaseIterable` protocol for exactly this purpose.
If our index type is `CaseIterable`, then we can zip its elements (which represent all the indices we expect to be present in a collection) together with the elements of a collection, and pass those along to a verification block.

### Defining the types

We're going to define a bunch of distinct `enum`s to represent the concrete sets — one enum for the set of two indices, another for the set of three, and so on.
We want to be able to pass any of these concrete enums into our helper function, so we'll need a common interface that they all conform to.
The only requirement of this interface happens to be that it must be `CaseIterable`.
We can define the common interface as a simple typealias:

```swift
typealias SizedIndexSet = CaseIterable
```

Then we can define a couple of concrete sets that conform to this protocol.
I have lazy fingers, so I'll keep all the names short, and also close to the raw Ints that we wanted to use above:

```swift
enum __2: SizedIndexSet {
    case _0, _1
}

enum __3: SizedIndexSet {
    case _0, _1, _2
}

enum __4: SizedIndexSet {
    case _0, _1, _2, _3
}

// etc...
```

Unfortunately, we'll have to make a new enum for each sized set we'll need.
I'm not a level 50 template wizard yet.

You'll notice that the enum names start with double underscores. 
Hold that thought. 
We're reserving the single underscore names for the next bit.

If we make our helper method expect a `SizedIndexSet` as its `count` argument, we can call it like this:

```swift
verify([1, 2, 3], count: __3.self) { ... }
```

The `.self`-bit isn't quite what we want at the call site, so let's define a bunch of global properties that does it for us:

```swift
let _2 = __2.self
let _3 = __3.self
let _4 = __4.self
// etc...
```

This is what we reserved the single underscores for.
Now we can call our helper like this:

```swift
verify([1, 2, 3], count: _3) { ... }
```

It's not 100% in line with our original vision, but it's as close as we can get.

### Updating the helper

Our helper method can now assert the collection's size against the *implicit* size of the index set, and then zip together the indices with the elements for the verification block.

We'll add one small tweak — if the count verification fails, we want it to light up in the calling unit test, not in this helper.
So we'll get the file and line from the callsite and pass it to the helper's invocation of XCTAssert.

Let's update it:

```swift
func verify<C: Collection, I: SizedIndexSet>(
  _ elements: C,
  count: I.Type,
  file: StaticString = #file,
  line: UInt = #line,
  _ verify: (I, C.Element) -> Void
) {
  XCTAssertEqual(elements.count, I.allCases.count, file: file, line: line)
  zip(I.allCases, elements).forEach(verify)
}
```

And that's all there is to it.

## Helper method, version two, in practice

With these updates, calling our helper method now looks like this:

```swift
func testSmallCollection() {
  verify([1, 2, 3], count: _3) { index, element in
    switch index {
    case ._0: XCTAssertEqual(element, 1)
    case ._1: XCTAssertEqual(element, 2)
    case ._2: XCTAssertEqual(element, 3)
    }
  }
}
```

Yes, we need icky underscores with our Ints.
As far as I can tell, there's no getting around it.

However, I submit for your consideration:
We no longer have to provide a default case for our switch statement. Swift can verify, through static analysis compiler magic, that we have handled exactly every valid case, given our expectations about the number of elements in the set.
And it is no longer possible to claim to expect 3 elements, but try to handle 4. The expected count and the actual handled elements are now intricately linked in a way that reflects their real relationship. They're two sides of the same coin, in code as it is in concept. Amen.

## Last thoughts

Did I just do an inordinate amount of refactoring to remove a single line from our checks? Yes.
But it taught me a lot about the limits of the language, it forced me to wrap my head around a slippery concept masquerading as two different concepts, and was overall a good exercise in seeing that a small annoyance with duplicative code actually points to a deeper design problem.

So was it worth it? Also yes.

Get the full code [here](https://github.com/phlippieb/collection-verifier-swift/).