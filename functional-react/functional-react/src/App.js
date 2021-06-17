// check out themes at:
// https://github.com/PrismJS/prism-themes

import React, { useState } from 'react';
import "prismjs"
import "prismjs/components/prism-jsx.min";
import "./theme.css"
import PrismCode from "react-prism";

const example = [
  "const Demo = props => {",
  " const AddTen = <Calculator number={10}>{props.numbers[0]}</Calculator>",
  " const AddTwenty = <Calculator number={20}>{props.numbers[1]}</Calculator>",
  " return (",
  "    <div>",
  "      {AddTen}",
  "      {AddTwenty}",
  "    </div>",
  " )",
  "}",
  "\n",
  "const Example = () => {",
  " const numbers = [10, 20]",
  "\n",
  " return <Demo numbers={numbers} />",
  "}"
].join('\n')

const App = () => {
  const [value, setValue] = useState(example)

  return (
    <div className="App">
      <pre>
        <PrismCode className="language-jsx">
          {example}
        </PrismCode>
      </pre>
    </div>
  );
}

export default App;
