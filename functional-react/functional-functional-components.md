# Functional Functional React

## Intro

Now that the hooks API has been out for a couple months and I've gotten a chance to use hooks in my day-to-day job, it's really started to warp and transform my conception of the React component itself. 

Over the years I've tried to limit myself to functional stateless components where I can, but inevitably the main workhorse of any React app pre-16.8 is going to be a class component that contains the state of your app, and these class components are therefore going to be where you spend a lot of your development time and thought. But now that you can have state WITHIN a functional component, I've written nothing but functions for weeks now.  

Maybe it was staring at functions all day instead of classes that did it, maybe learning the new API shifted around some grey matter in an opportune kind of way, but whatever the cause: I practically had a mini-stroke the other day. A revelation of sorts. One of those "Handel seeing the face of God" moments where all of a sudden the whole JSX API was stripped away, and I saw React components for what they really are: not components, but functions! Plain old, ordinary functions with a little sprinkling of magic courtesy of the framework. 

It's kind of a stupid epiphany: of course they were functions this whole time. What else could they be? But when you know they're functions, and you realize that you can *call* them like functions, it opens up an exciting alternate universe full of wacky and strange possibilities. React is a very functional framework to begin with, but once you sacrifice a little bit of the JSX syntax to the gods of FP, it rocks the foundations of your world. Higher order components – an advanced method of component composition that eventually fell out of style due to the complexity that it introduces – become instantly more attractive and even _easy_ to implement. The very idea of a prop transforms from this esoteric thing with a funny syntax to a plain old function argument. The Context API seems suddenly quaint and limiting when faced with the prospect of sharing state between components via a closure instead. 

I'm calling this concept "Functional Functional React" in my head. Using some of the foundational concepts of functional programming along with functional React components, you can achieve some awesome results with very few lines of code, at the expense of the familiarity and comfort of the typical JSX-oriented approach to writing (and most significantly: _composing_) React components. 

I'm not going to say that this is the best way to write a React app. I make no claims about it being easier or more intuitive or at all preferable to the "traditional" methods, which are numerous and well documented. However, it is *different*, and I think there's real value to seeing things differently. Who knows! Maybe you won't adopt this technique fully, but you might find some of it appealing enough to incorporate into a traditional React app. At the very least, I want to pull back the curtain on the React framework a little bit and demystify the all-powerful Component, that we might all better understand what's really going on in our applications. 

## Part one: React component composition

Stop me if you've heard this one before: "React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components." The bedrock, foundational concept of React is composition. Instead of making monolithic classes with generic methods and inheriting from these classes, you're encouraged to think of components as lego blocks: if you need new functionality, combine existing components/lego blocks together to achieve the desired result. 

Implemented well, the elements of your app become these atom-like particles: tiny, simple, purpose-built units of code that can be combined together to form bigger "molecules," which can be combined together with yet *more* molecules, so on and so forth. 

What does this look like in practice? Maybe we can start with what composition ISN'T and then work backwards from there. Say we want to build a shopping list, and we need to have both ordered and unordered lists. Here's a possible implementation:  

```jsx
import React from "react";

const things = ["Milk", "Eggs", "Cheese"];

const UnorderedList = props => {
  const listItems = props.items.map(listItem => <li>{listItem}</li>);

  return <ul>{listItems}</ul>;
};

const OrderedList = props => {
  const listItems = props.items.map(listItem => <li>{listItem}</li>);

  return <ol>{listItems}</ol>;
};

const NotComposition = () => {
  return (
    <div>
      <UnorderedList items={things} />
      <OrderedList items={things} />
    </div>
  );
};

```

Sure, it does what we need it to do, but not that well. There's duplicated code for building the lists for instance, which doubles the overhead maintenance. Say we wanted to make all of the list items bold, or add checkboxes to them. We'd have to do that in two places, both `UnorderedList` and `OrderedList`. Not only that, but we needed to make two components just for the different list types, when really the only way that they differ is in the type of list they render. 

It gets hairier when you start to consider what happens if we need a *unique* version of one of these components, but we don't want to impact other existing components with the change. You'll be hard pressed to come up with an easy backwards-compatible refactor to either of those components if you need *some* of them to render bold list items for instance: 

```jsx
const OrderedList = props => {
  const listItems props.bold 
    ? props.items.map(listItem => <li className="bold">{listItem}</li>)
    : props.items.map(listItem => <li>{listItem}</li>);

  return <ol>{listItems}</ol>;
};
```

Hairy indeed. Confusing to the uninitiated, very verbose, and painful to maintain. 

So! How do we use composition to make these brittle, single-use components more flexible? Maybe with this implementation: 

```jsx
import React from "react";

const things = ["Milk", "Eggs", "Cheese"];

const List = props => {
  const Tag = props.type;
  return <Tag>{props.children}</Tag>;
};

const ListItem = props => {
  return <li>{props.children}</li>;
};

const buildList = things => things.map(thing => <ListItem>{thing}</ListItem>);

const Composition = () => {
  return (
    <div>
      <List type="ol">{buildList(things)}</List>
      <List type="ul">{buildList(things)}</List>
    </div>
  );
};
```

Ah, much better! We have less code – which is a virtue in and of itself – and the code we do have is more flexible. We've got way more room to breath, both if we want to make a change that affects ALL components *and* if we want a change that only affects a SINGLE version of a component.

Say that we want to add a custom CSS class to all list components. That requires two touches in the previous example, but only one here: 

```jsx
const List = props => {
  const Tag = props.type;

  return <Tag className="super-cool-list">{props.children}</Tag>;
};
```

Or maybe we want one of our lists to have links in the list items, but not the other. This required a hairy, monolithic change in the first version of our code, but just a tiny compositional touch here:

```jsx
const withLink = list => list.map(item => <a href="#">{item}</a>);
const buildList = list => list.map(item => <ListItem>{item}</ListItem>);

const Composition = () => {
  const itemsWithLinks = withLink(list);
  const linkItems = buildList(itemsWithLinks);
  const normalItems = buildList(list);

  return (
    <div>
      <List type="ol">{linkItems}</List>
      <List type="ol">{normalItems}</List>
    </div>
  );
};
```

## Part two: vanilla function composition

If you understood the above section, congratulations! You understand function composition, or at least function composition as implemented through the lens of React. But what was going on that whole time, really? We put a couple lego bricks together in the manner prescribed to us by the React docs, but what's going on beneath the framework to make this possible? There is WAY more to function composition than just assembling React components, and there is WAY more to be gained from function composition than is apparent from the picture of composition that React presents us with. 

So, maybe we should take a look at what plain, vanilla JS function composition looks like. As before, let's start with a function that can't be composed, and then move on to a version that CAN be composed: 

```js
const add = (x, y) => x + y;

add(10, 5);  // -> 15
```

Nothing too surprising going on there, right? Just a function that takes two arguments and adds them together. What does a composed version of this look like? 

```js
const add = x => y => x + y;
const addTenTo = add(10);

addTenTo(5);  // -> 15
```

Don't freak out if this doesn't make a lot of sense: it is pretty weird and uncomfortable at first blush. All those fat arrows one after the other made me break out in hives the first time I saw them.

What's happening is that we've written a function which takes a value, returns a function, to which we can pass another value, which will THEN return our final computed value.

Confused yet? Feeling the burden of the New pressing down your fragile human brain? Relax! You really do understand this already if you made it this far. It may come as some surprise, but this is exactly what's going on when you pass a child to a React component. The only difference is that the composition is wrapped up in an API: 

```jsx
import React from "react";

const Calculator = props => {
  return <div>{props.number + props.children}</div>;
};

const Demo = props => {
  const AddTen = <Calculator number={10}>{props.numbers[0]}</Calculator>
  const AddTwenty = <Calculator number={20}>{props.numbers[1]}</Calculator>

  return (
    <div>
      {AddTen}
      {AddTwenty}
    </div>
  )
}

const Example = () => {
  const numbers = [10, 20]

  return <Demo numbers={numbers} />
};
```

It may not look like it, but this is a massive, earth-shatteringly powerful concept. I guarantee you will not write code the same way ever again once you grasp it: function composition is just too useful to ignore once you see the light. What composition has allowed us to do here is nail down the factors that we DO know ahead of time (the numbers 10 and 20 in our calculator example above), and hold them in waiting until the numbers that we DON'T know arrive. A simple but incredibly powerful concept. 

I could spend paragraphs waxing philosophical on topics like partial application and point-free composition and functors, but there are a lot of fantastic resources out there to show you the hows and whys of function composition, and they're going to do a better job of explaining the fundamentals than I will. Two of my favorites are [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch04.html) and [FunFunFunction](https://www.youtube.com/watch?v=iZLP4qOwY8I). I'd recommend that you check either of them out (or even both!).

## Part three: piping and mapping

We're getting close to Functional Functional React components, I swear! There's one more thing to cover first: piping. Piping is a method of function composition that treats functions as though they were steps in a list, or workers on an assembly line. 

If you've worked with jQuery before, you recognize the pattern already: 

```js
$(document).ready(function() {
  $('body')
    .css('background-color', 'red')
    .css('height', '500px')
    .css('width', '500px')
    .addClass('big-red-box')
})
```

The main idea is that we grab the body element, perform changes, and put it back on the screen. One step after the other in an unbroken chain. Each of those jQuery methods (`$.css`, `$.addClass`) takes the selected DOM element, operates on it, and passes on the transformed element to the next function. The very cool (and underappreciated) thing that jQuery achieves with this API is flexibility and interoperability. We could have done any of those steps in any order with the same result, and we can even add steps in between: 

```js
$(document).ready(function() {
  $('body')
    .css('height', '500px')
    .addClass('rotated-red-box')
    .css('transform','rotate(45deg)')
    .css('width', '500px')
    .css('background-color', 'red')
})
```

Function piping works the exact same way, just with a different syntax. Let's grab Ramda's `pipe` function and see what this looks like: 

```js
const ramda = require('ramda');
const { pipe } = ramda;

const add = x => y => x + y
const add10To = add(10)

const makeBigNumber = pipe(
  num => add10To(num),
  num => add10To(num),
  num => add10To(num)
);

console.log(makeBigNumber(5)); // -> 35
```

We could even apply it to our previous jQuery example: 

```js
$(document).ready(function() {
  const makeBigRedBoxFrom = pipe(
   element => element.css('background-color', 'red'),
   element => element.css('height', '500px'),
   element => element.css('width', '500px'),
   element => element.addClass('big-red-box')
  )

  makeBigRedBoxFrom($('body'))
})
```

Again, massively powerful tool! A utility like `pipe` (or its nerdier twin sister, `compose`) not only gives us the ability to perform these chained function calls, it also acts as a kind of mental portal into a functional universe. If you stick your head far enough inside, and take a few heaving breaths, you acquire the mindset to code in a pipeline-oriented style, which is almost more important. Using a tool adapts your mind to the tool as much as it enables you to build, so it is important to use a tool that is "good to think with" to paraphrase Claude Lévi-Strauss. 

If you're interested in going into pipelines in more depth, Christopher Okhravi does a fantastic job [in this video](https://www.youtube.com/watch?v=myGSs8lu62M). As of the time of writing, it is also under consideration to be included as a built in language feature of [Javascript](https://github.com/tc39/proposal-pipeline-operator), and IS a built in language feature in languages like [F#](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/#function-composition-and-pipelining).

So, what does this have to do with React? When you render a component tree, what you're really doing is a chained function call. One that can go dozens or hundreds of function calls deep depending on the structure of your app. 

How many levels of function calls happen in the following app? 

```jsx
const neatThings = ['solar power', 'self-driving cars', 'rocket ships']

const Body = () => {
  const list = neatThings.map(thing => <li>{thing}</li>)
  return (
    <Fragment>
      <h1>Welcome to my cool application!</h1>
      <p>Here's a list of neat things:</p>
      <ol>
        {list}
      </ol>
    </Fragment>

  )
}

const Application = () => {
  return (
    <div className="app">
      <Body />
    </div>
  )
}

ReactDOM.render(document.getElementsByTagName('body')[0], Application)
```

If you said seven, you'd be correct! If we look at every function call, every component (including both custom components like `Body` and baked-in JSX components like `div`s and `ol`s) and trace things down as far as we can go, it would look like this: 

ReactDOM -> Application -> div -> Body -> Fragment -> ol -> li

Looks a bit like a pipeline right? 

```jsx
const app = pipe(
  ReactDOM, 
  Application, 
  div, 
  Body,
  Fragment, 
  ol, 
  li 
)
```

What if we wrote components and whole applications as lists of function calls, instead of nested JSX tags? It is completely possible! Remember, components at the end of the day are just functions. And anything that's "just a funciton" can be called like one too: 

```jsx
const component = arguments => {
  return (
    <div>
      Hello, {arguments.children}
    </div>
  )
}

ReactDOM.render(document.getElementsByTagName('body')[0], component('world'))
```

So, if this works, then this should work too: 

```jsx
const component = arguments => {
  return (
    <div>
      Hello, {arguments.children}
    </div>
  )
}

const application = arguments => {
  return (
    <div>
      <p>Functions are cool right?</p>
      {arguments.children({children: 'world'})}
    </div>
  )
}

const app = pipe(
  application,
  component
)

ReactDOM.render(document.getElementsByTagName('body')[0], app())
```
