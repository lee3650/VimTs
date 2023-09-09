import './App.css'
import React, {useEffect, ChangeEventHandler, useState, useCallback} from 'react'
import Vim from './model/Vim'; 
import VimOutput from './model/VimOutput';

const startingStr = ['Hello Vim!', 'Try moving the cursor.'];

function App() {

  //const [vim, setVim] = useState<Vim>(new Vim(startingStr))
  const [text, setText] = useState(startingStr);
  const [cursorPos, setCursorPos] = useState([0, 0]);

  let vim = new Vim(startingStr.join('\n'));

  //function handleKey (ev : ChangeEventHandler<HTMLInputElement>) {
    //let key = ev.key
    //let output = vim.execute(key)

    //setText(output.text.join('\n'))
  //}

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, []);

  const checkKeyPress = useCallback(
    (event : any) => {
      let key = event.key;
      let output = vim.execute(key);
      setText(output.text);
      setCursorPos([output.cursorPos.row, output.cursorPos.col]);
    },
    [text]
  );

  function formatLine(line : string, index : number) {
    if (index == cursorPos[0]) {
        return <p key={index}>{line.slice(0, cursorPos[1])}<span className='cursorChar'>{line.slice(cursorPos[1], cursorPos[1] + 1)}</span>{line.slice(cursorPos[1]+1)}</p>
    }
    return <p key={index}>{line}</p>
  }

  return (
    <div onKeyDown={checkKeyPress} className='page'>
      {text.map(formatLine)}
    </div>);
}

export default App
