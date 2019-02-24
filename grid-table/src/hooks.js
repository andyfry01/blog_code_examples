import React, { useEffect } from 'react'

const useRandomPersonApi = ({numPeople, cb}) => {
  useEffect(() => {
    const resToJson = res => res.json();
    const logRes = res => console.log(res);
    const num = num => `?results=${num}`;
    fetch(`https://randomuser.me/api/${num(numPeople)}`)
      .then(resToJson)
      .then(json => cb(json.results));
  }, []);
};

export {
  useRandomPersonApi
}
