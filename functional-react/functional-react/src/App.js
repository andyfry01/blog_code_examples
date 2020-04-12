import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CodeMirror from "react-codemirror";
import 'codemirror/lib/codemirror.css'
import {transform}  from "@babel/standalone";

const test = 'const Calculator = props => { return <div>{props.number + props.children}</div>; };'
// console.log(eval(test))

// const Demo = props => {
//   const AddTen = <Calculator number={10}>{props.numbers[0]}</Calculator>
//   const AddTwenty = <Calculator number={20}>{props.numbers[1]}</Calculator>

//   return (
//     <div>
//       {AddTen}
//       {AddTwenty}
//     </div>
//   )
// }

// const Example = () => {
//   const numbers = [10, 20]

//   return <Demo numbers={numbers} />
// '

const App = () => {
  const [value, setValue] = useState(test)
  // console.log(transform);
  var output = transform('const test = () => (return <div>hello world!</div>)', { presets: ["react"] });

  console.log(output)
  return (
    <div className="App">
      Heloo
      <CodeMirror
        value={value}
        onChange={setValue}
      />
    </div>
  );
}

export default App;
