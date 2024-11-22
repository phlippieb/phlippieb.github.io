---
title: CalendarDate
published: 2024-11-22
tags: [swift]
listed: true
excerpt: Swift code for handling Date objects at calendar date-granularity
---
*Swift code for handling Date objects at calendar date-granularity*

## Background

If you want to represent a date in Swift, the [`Date`](https://developer.apple.com/documentation/foundation/date) type is available, but this type is kind of weirdly named. It doesn't just represent a date on a calendar, but as per the documentation, a "specific point in time". And it is *very* specific. Some of the standard interfaces for manipulating `Date` values use `TimeInterval` as the differential, which is described as having sub-millisecond precision. If you only want to represent a specific date on a calendar, this can make the `Date` type a little unwieldy.

## CalendarDate

This is why I created a `CalendarDate` type in my DailyBudget project (which is heavily concerned with what *day* things happened on, but not so much what *time*). I've moved the [class definition and extensions to a GitHub Gist; you can find it here](https://gist.github.com/phlippieb/14d891fab87f6040f7fbdfad21abb067). I'm currently trying to smash out a new app for a simple idea that also involves dates, so the hope is that this way of dealing with calendar dates is fairly reusable.

You can also read the code below.

## Disclaimer

I am fairly ignorant of non-Gregorian calendars, and don't know whether this works correctly in all locales.

## Code

```swift
import Foundation

/// Provides ergonomics for treating Swift Dates at day-specific granularity
struct CalendarDate {
  let date: Date
  private var calendar: Calendar { .current }
}

// MARK: Creating instances -

extension CalendarDate {
  static var today: CalendarDate {
    .init(date: Calendar.current.startOfDay(for: .now))
  }
  
  init(year: Int, month: Int, day: Int) {
    self.init(
      date: Calendar.current.date(
        from: DateComponents(year: year, month: month, day: day))!)
  }
  
  func adding(days: Int) -> CalendarDate {
    CalendarDate(
      date: calendar.date(
        byAdding: DateComponents(day: days), to: date)!)
  }
}

// MARK: Days since -

extension CalendarDate {
  static func -(lhs: CalendarDate, rhs: CalendarDate) -> Int {
    Calendar.current.numberOfDaysBetween(rhs.date, and: lhs.date)
  }
}

private extension Calendar {
  func numberOfDaysBetween(_ from: Date, and to: Date) -> Int {
      let fromDate = startOfDay(for: from)
      let toDate = startOfDay(for: to)
      let numberOfDays = dateComponents([.day], from: fromDate, to: toDate)
      
      return numberOfDays.day!
  }
}

// MARK: Nice formating -

extension CalendarDate {
  func toStandardFormatting() -> String {
    if Calendar.current.isDate(self.date, equalTo: .now, toGranularity: .year) {
      // Omit year if in the same year
      return self.date.formatted(.dateTime.day().month(.wide))
    } else {
      return self.date.formatted(.dateTime.day().month(.wide).year())
    }
  }
}

// MARK: Comparisons -

extension CalendarDate: Equatable {
  static func ==(lhs: CalendarDate, rhs: CalendarDate) -> Bool {
    Calendar.current.isDate(lhs.date, equalTo: rhs.date, toGranularity: .day)
  }
}

extension CalendarDate: Comparable {
  static func < (lhs: CalendarDate, rhs: CalendarDate) -> Bool {
    lhs != rhs && lhs.date < rhs.date
  }
}

// MARK: Hashable -

extension CalendarDate: Hashable {
  /// Custom implementation with day granularity
  func hash(into hasher: inout Hasher) {
    calendar.dateComponents([.year, .month, .day], from: date)
      .hash(into: &hasher)
  }
}
```
