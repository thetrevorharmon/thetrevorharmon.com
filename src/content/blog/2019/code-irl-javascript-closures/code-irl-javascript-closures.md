---
title: 'Code IRL: Javascript closures'
slug: code-irl-javascript-closures
date: 2019-05-01T10:55-07:00
type: Post
status: Published
description: A real world example of how to use Javascript closures to write better code.
image:
  source: ./A-roll-of-raffle-tickets.jpg
  alt: A roll of raffle tickets
  attribution:
    author: Fancycrave
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/yB5cYEq7y2U
---

Sometimes it's hard to find a real world example for certain code concepts. Here's an example of using Javscript closures in the wild.

## A Brief Introduction to Closures

As a starter, a Javascript closure is a function that returns another function. The returned function can reference variables from the parent function, even if those variables are considered out of scope. As an example, look at this little function:

```javascript
const makeAdder = function (startingNumber) {
  return function (number) {
    return number + startingNumber;
  };
};

const myAdder = makeAdder(10);
console.log(myAdder(2));
```

Here I'm defining a closure named `adderFactory` that takes in a `startingNumber` and returns a function that adds a parameter named `number` to that `startingNumber`. When I call `adderFactory(10)`, I'm "enclosing" the value of `startingNumber` in my function (which in this case is the value `10`).

When I call `myAdder(2)`, I can access that `startingNumber` even though that variable is techincally out of scope. Why? When my `adderFactory` returned that adder function, it enclosed the value of 10 with it. I could make a new adder:

```javascript
const myNewAdder = makeAdder(100);
console.log(myAdder(20));
```

Even though these were made with the same factory, because I've created two distinct functions, two distinct (enclosed) values for `startingNumber` will exist.

_If you want to read more on closures, [W3 Schools][1] and [MDN docs][2] both have good articles that explain how they work in more detail._

## Filtering Tickets

I was recently doing some array manipulation and needed to do some complex filtering. I had two arrays with tickets, and each ticket had an `id` and a `number` property (representing different data). I needed a way to filter my `oldTickets` array to only include tickets found in my `newTickets` array. I chose to use the built in [Array .filter method][3] and iterate over the two arrays.

_Note: I realize that the big O here is n², which is pretty inefficient. For what I was working on, that was ok._

Here's the starting code that I wrote in order to filter my arrays (included are some declarations for the ticket arrays, to demonstrate what the data looks like):

```javascript
const oldTickets = [
  {id: 1, number: '2'},
  {id: 2, number: '3'},
];

const newTickets = [{id: 1, number: '2'}];

const tickets = oldTickets.filter((oldTicket) => {
  const isOldTicketFound = newTickets.find((newTicket) => {
    return (
      oldTicket.id === newTicket.id && oldTicket.number === newTicket.number
    );
  });

  return isOldTicketFound;
});
```

The `.filter` method expects a boolean to know if it should keep the current item or discard it. The `.find` method looks in the `newTickets` array, checks if the current `oldTicket` is found, and returns `true` or `false` accordingly.

_Note: both `.filter` and `.find` iterate over the tickets, which is where `oldTicket` and `newTicket` come from._

## Identifying a Pattern

After writing the code, I recognized that I had the ticket comparison code in multiple places. I wanted to write a generic ticket equality checker, but I realized that I needed to be able to access both `newTicket` and `oldTicket`. While this could be solved by writing a function that takes two arguments, `newTicket` and `oldTicket`, I decided to make use of closures instead. This would allow me to declare a function with `oldTicket` "saved" inside of it.

I started off by writing my closure function:

```javascript
const makeTicketEqualityChecker = (oldTicket) => {
  return (newTicket) => {
    return (
      oldTicket.id === newTicket.id && oldTicket.number === newTicket.number
    );
  };
};
```

This function takes in an argument of `oldTicket` and then returns a function. The inner function references `oldTicket` from the outer function, so it retains the original `oldTicket` argument for executing later.

## Using the Closure

After writing that closure, I could make use of it in my original filter function:

```javascript
const tickets = oldTickets.filter((oldTicket) => {
  const isEqualToOldTicket = makeTicketEqualityChecker(oldTicket);

  const isOldTicketFound = newTickets.find((newTicket) =>
    isEqualToOldTicket(newTicket),
  );

  return isOldTicketFound;
});
```

On line 2 I assign the return function of `ticketEqualityFactory` to `isEqualToOldTicket`. By this point I've enclosed the value of `oldTicket` inside of `isEqualToOldTicket`. When I call `isEqualToOldTicket` in my `.find` function, it takes in the value of `newTicket`, compares it against the "saved" value of `oldTicket`, and returns if they are equal or not.

[1]: https://www.w3schools.com/js/js_function_closures.asp
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
