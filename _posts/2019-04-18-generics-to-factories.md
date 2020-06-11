---
layout: post
title: "Swift: moving generics types from angled brackets to factory method parameters"
tags: [Swift, iOS]
---

### Generics are powerful and expressive, but occasionally, they can get a little ugly. This article suggests a simple way to instantiate objects of generic types in Swift so that the roles of the generic types are clear, and to allow for more visually pleasing formatting.

---

Now, I’m not saying that generics are always unintuitive or ugly. Anyone with a basic grasp of generics would be able to look at the following snippet and see exactly what role the type `T` plays:

{% gist 3502a05a9e2129563ad60880ebdd4e2d %}

Clearly, the function will swap the two given values; `T` simply specifies the type of those values.

But if you’re using generics to generalise something more advanced, you may soon run into something like this:

{% gist 793975af5d4a0be69257c8f4e57b33f2 %}

Not the sexiest code to begin with, sure, but the fact that the generic type parameters must go between the `<...>` directly after the class name, and that Xcode has no nice way of formatting generic type parameters on separate lines, and that we can’t label the types to indicate what should go where, turns this into an unreadable mess.

---

Fortunately, we can solve all of these issues by using factories to instantiate generic objects. To demonstrate, let’s begin with a contrived example.

Let’s say we have a variety of enums in our app, and we occasionally find it useful to map those enums to one another. For example, here are two:

{% gist b5bfd3b63ed9bd2894dadc1b19db8c71 %}

We don’t want to write a new class to handle mapping between each possible combination of enums, so we create a generic mapper:

{% gist 8fdfc4c137539e2c806da4d430b55231 %}

This mapper is instantiated with the types of both the source and destination enums, as well as a closure or function that performs the actual mapping. This is obviously not a terribly useful mapper, but to be fair I did say this was a contrived example!

The traditional way to create and use our mapper would then be as follows:

{% gist 4137640eb86f1104151fd7e0abf52e93 %}

So again, we’re putting the generic type parameters after the class name on a single line, which would quickly become an eyesore when using long type names. We’re also not indicating the roles of those types; if someone, for some reason, defined Mapper so that Destination precedes Source as the first type parameter, we would probably get stuck debugging our init code for a long time before we realised what went wrong.

So here is how we can label the generic parameters, and move them out of angled brackets and into normal function parameters, by using a factory to create objects of our generic class. We write a simple factory:

{% gist e348141ef088fd54fb994111b01e4f44 %}

Note that the `make` function is generic: it relies on two type parameters, `T` and `U`. We reference those types in the parameter list as `T.Type` and `U.Type`. This means that, when we call this function, we will explicitly tell it what those types should be.

We also make sure to accept any other parameters required to initialise a mapper object; in this example, that’s the `mapping` parameter.

Now, since this function is generic, you might be worried that we’ll still need to specify the type parameters in `<angled brackets>`, just like before. But since we’re “using” both types in the function’s parameters by specifying `sourceType` and `destinationType`, the compiler can infer the types of `T` and `U`.

Also notice how nicely we get to label those type parameters now!

Using the factory looks like this:

{% gist cf4c67e2a7401c8f1158881c79d3c371 %}

Maybe it doesn’t look like much, but in my view this makes the code much cleaner and more human-readable.

One note for those planning on using this: Using a factory class is important. If you opt to add the factory method (`make`) on the generic class (`Mapper`) instead of in a dedicated factory (`MapperFactory`), you will run into compiler issues. This is because the generic class is generic (duh!) and, even though you’re using a static function and specifying all the generic types to use via the function parameters, the compiler still expects you to specify _which_ generic class to call the function on. So you would still have to provide the generic parameters in angled brackets, which is defeating the purpose.

---

Note: This article was originally published on [Medium](https://medium.com/@phlippie.bosman/swift-generics-moving-type-parameters-out-of-angled-brackets-and-into-factory-methods-a2f7f8b06961).