---
title: Double optional bindings or something idk
published: 2024-06-25
tags: [swift, swiftui, software design]
listed: true
excerpt: I soon ran into a use case where I wanted to use an optional to control showing an edit sheet, and to indicate to that sheet whether it should edit or create an item. Interestingly, this implies that the correct type for the item binding is an optional of an optional item — Double optionals or something idk. The outer optional is the binding that controls showing the sheet. The inner optional indicates whether the item to edit is new or an existing item.
---

## TL;DR

I recently found this freaky little pattern while working on my [Daily Budget](notion://www.notion.so/github.com/phlippieb/daily-budget-app/) app:

```swift
struct Main: View {
  @State var editingItem: Item??

  var body: some View {
    VStack { ... }
    .sheet(item: $editingItem) {
      EditItem($editingItem)
    }
  }

  func onCreateNewItem { editingItem = .some(nil) }
  func onEditItem(_ item: Item) { editingItem = .some(item) }
}

struct EditItem: View {
  @Binding var item: Item??

  var title: String {
    if case .some(.some) = item {
      return "Edit item"
    } else {
      return "New item"
    }
  }

  @State private var text = ""

  var body: some View {
    VStack { ... }
    .onAppear {
      if case .some(.some(let item)) = item {
        text = item.text
      }
    }
  }

  func onSave() {
    if case .some(.some(let itemToUpdate)) = item {
      itemToUpdate.text = text
      // [save item to container here]
    } else {
      let newItem = Item(text: text)
      // [save item to container here]
    }

    // Dismiss:
    item = nil
  }
}
```

## Optional binding as a way to signal whether a sheet is shown

One way in which SwiftUI uses the optional type is to signal whether a sheet is shown. This is demonstrated above by the code `.sheet(item: $editingItem)`. SwiftUI asks you to provide a state or binding variable that is optional. Giving this variable a non-nil value tells SwiftUI to show the sheet for that value, and setting it to nil (e.g. from within the presented view's code, via a binding) signals that the sheet should be dismissed.

## Optional as a way to signal whether an edit view is for creating a new object or editing an existing one

Another use of the optional type, as recommended in SwiftUI docs, is to provide context for an editor view.

In an app where users can create and edit some sort of item, the same view can typically be used for both cases with only small differences. When creating a new item, the title should probably be something like "New item"; fields (such as text fields) should be populated with default values; and the save action should create a new item with the user's values. When editing an existing item, the title should change to "Edit item" or "Edit (item name)"; fields should be populated with the values of the item; and the save action should update the existing item.

A clean way to differentiate these cases is to use an optional value. Nil indicates that a new item is being created, and non-nil indicates that an existing item is being edited.

## Both

During my travels, I soon ran into a use case where I wanted to use an optional to control showing an edit sheet, *and* to indicate to that sheet whether it should edit or create an item. Interestingly, this implies that the correct type for the item binding is an optional of an optional item — Double optionals or something idk. The outer optional is the binding that controls showing the sheet. The inner optional indicates whether the item to edit is new or an existing item.

Which gives us this in the code above:

```swift
struct Main: View {
  @State var editingItem: Item??
  ...
}
```

Freaky.

## Interpreting it

The double optional has 3 possible cases, with the following meanings in this context:

```swift
switch item {
case .some(.some(let item)):
// Show the editor for the existing item `item`

case .some(.none):
// Show the editor for a new item

case .none:
// Hide the editor
}
```

## Dealing with this type in a preview

To show one of these weird little views in an Xcode preview, you need to provide a *binding* for a value. I found the `.constant` static method for creating Bindings to be convenient:

```swift
// Main view preview
#Preview {
  Main(item: .constant(nil))
}

// Edit view preview
#Preview {
  // As a "create new item" view:
  EditItem(item: .constant(.some(nil)))

  // ... or as an "edit existing item" view:
  EditItem(item: .constant(.some(Item()))
}
```