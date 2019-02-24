import {
  view,
  lensProp,
  lensPath,
  prop,
  toLower,
  compose,
  map,
  countBy,
  curry,
} from 'ramda';

const buildUserData = data => {
  const dob = lensPath(['dob', 'date']);
  const formatDOB = curry(dob => dob && new Date(dob).toLocaleDateString());
  const formattedDOB = compose(formatDOB, view(dob));
  const firstName = lensPath(['name', 'first']);
  const lastName = lensPath(['name', 'last']);
  const username = lensPath(['login', 'username']);
  const cell = lensProp('cell');
  const email = lensProp('email');
  const state = lensPath(['location', 'state']);
  const city = lensPath(['location', 'city']);
  const street = lensPath(['location', 'street']);
  const pic = lensPath(['picture', 'thumbnail']);
  return {
    name: `${view(firstName)(data)} ${view(lastName)(data)}`,
    username: view(username)(data),
    cell: view(cell)(data),
    email: view(email)(data),
    address: `${view(street)(data)} - ${view(city)(data)} - ${view(state)(
      data,
    )}`,
    birthday: formattedDOB(data),
    pic: view(pic)(data),
  };
};

export {
  buildUserData
}
