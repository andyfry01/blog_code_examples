import React, {createContext, useContext} from 'react';
const TableContext = createContext();

const Table = props => {
  return <table>{props.children}</table>;
};

const Thead = props => {
  return <thead>{props.children}</thead>;
};

const Tbody = props => {
  return <tbody>{props.children}</tbody>;
};

const Trow = props => {
  return <tr>{props.children}</tr>;
};

const Tcell = props => {
  return <td>{props.children}</td>;
};

const Theader = props => {
  return <th>{props.children}</th>;
};

export {Table, Thead, Tbody, Trow, Tcell, Theader};
