const {
  toUpper,
  join,
  juxt,
  head,
  tail,
  lensProp,
  view,
  curry,
  toLower,
  compose,
  countBy,
  map,
  prop,
} = require('ramda');
const fetch = require('node-fetch');

const resToJson = res => res.json();
const num = num => `?results=${num}`;
const tracer = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const capitalize = compose(join(''), juxt([compose(toUpper, head), tail]));

const getName = view(lensProp('name'));
const getTitle = view(lensProp('title'));
const getFirst = view(lensProp('first'));
const getSurname = view(lensProp('last'));

const tallyMarriedWomen = compose(
  console.log,
  view(lensProp('mrs')),
  countBy(toLower),
  map(x => x.name.title),
  prop('results'),
);

const tallyGenders = compose(console.log, countBy(toLower), map(x => x.gender), prop('results'))

const getNames = data =>
  compose(
    console.log,
    map(
      x =>
        `${capitalize(getTitle(x))} ${capitalize(getFirst(x))} ${capitalize(
          getSurname(x),
        )}`,
    ),
    map(getName),
    prop('results'),
  )(data);

fetch(`https://randomuser.me/api/${num(30)}`)
  .then(resToJson)
  .then(data => {
    console.log('here are the formatted names:')
    getNames(data);
    console.log('here is the tally of the genders:')
    tallyGenders(data);
    console.log('we have this many married women:')
    tallyMarriedWomen(data);
  });
