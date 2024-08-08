---
title: 'Daily Budget v1.4: New widget, tips, notes, quick entry, and more'
date: 2024-08-08
tags: [daily-budget]
excerpt: Daily budget v1.4 is rolling out on the App Store soon. This update is quite packed! Here are the shiny new things. New widget. Designed to complement the "Available Today" widget, the new "Spent Today" widget shows you your total expenses for the day. Pro tip combine these widgets in a stack!
---
[Daily budget](https://dailybudget.phlippieb.dev) v1.4 is rolling out on the App Store soon. This update is quite packed! Here are the shiny new things.

## New widget

Designed to complement the "Available Today" widget, the new "Spent Today" widget shows you your total expenses for the day.

Pro tip: combine these widgets in a stack!

## Saving tips

See saving tips for your active budgets! These tips are based on your current status — if you're under budget, they'll tell you how much you can save for tomorrow; and if you're over budget, they'll tell you how many days it'll take to get back on track.

## Notes

You can now add notes to your budgets and expenses.

## Improved editing screens

Creating and editing your budgets and expenses is just a little nicer now:

- Easily move between text fields with the arrows in the keyboard toolbar
- Toggle the quick entry setting while adding an expense to add another one immediately after saving
- You can no longer pull down to dismiss if you have unsaved changes, meaning you won't accidentally delete your hard work!

## Tapping on a widget now takes you to the corresponding budget

A small but important update. If you're viewing one budget, and then tap on a widget for another budget, the app will now show you the budget you tapped.

## Start app on only active budget

Another small but nice update. If you only have one active budget, the app will open to that budget. You can always navigate back to the list of all budgets from there.

## Under the hood: URL handling

To implement some of these improvements, I had to add support for URL handling. So now if you know the UUID of a budget (a feature that should come soon), you can tap on a link like `dailybudget://budget?uuid=asdf` and you will be taken to your budget.

It doesn't really show yet, but will form a good foundation for future updates such as Shortcuts support.
