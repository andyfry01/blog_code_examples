import React, {useEffect, useState} from 'react';
import 'milligram/dist/milligram.css';
import {
  curry,
} from 'ramda';
import {
  Table,
  Thead,
  Tbody,
  Trow,
  Tcell,
  Theader,
} from './components/Table.components';
import { useRandomPersonApi } from './hooks'
import { buildUserData } from './utils'
/*
const tallyGenders = data =>
  compose(
    logRes,
    countBy(toLower),
    map(person => person.gender),
    prop('results'),
  )(data);
*/
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const App = () => {
  const [users, updateUsers] = useState([]);
  useRandomPersonApi({numPeople: 20, cb: updateUsers})
  
  const renderUsers = users => {
    if (users.length < 1) {
      return (
        <p>List of users (hopefully) on the way!</p>
      );
    }
    return users.map(user => {
      const data = buildUserData(user);
      return (
        <Trow>
          <Tcell><img src={data.pic} alt="user profile image" /></Tcell>
          <Tcell>{data.name}</Tcell>
          <Tcell>{data.username}</Tcell>
          <Tcell>{data.cell}</Tcell>
          <Tcell>{data.email}</Tcell>
          <Tcell>{data.address}</Tcell>
          <Tcell>{data.birthday}</Tcell>
        </Trow>
      );
    });
  };
  return (
    <div className="container">
      <Table>
        <Thead>
          <Trow>
            <Theader />
            <Theader>Name</Theader>
            <Theader>Username</Theader>
            <Theader>Cell</Theader>
            <Theader>Email</Theader>
            <Theader>Address</Theader>
            <Theader>Birthday</Theader>
          </Trow>
        </Thead>
        <Tbody>{renderUsers(users)}</Tbody>
      </Table>
    </div>
  );
};

export default App;
