import './App.css'
import React, {useEffect, ChangeEventHandler, useState, useCallback} from 'react'
import Vim from './model/Vim'; 
import VimOutput from './model/VimOutput';
import { NORMAL_MODE, INSERT_MODE } from './model/Vim';

const startingStr = ['Hello Vim!', 'Try moving the cursor.'];

function App() {

  //const [vim, setVim] = useState<Vim>(new Vim(startingStr))
  const [text, setText] = useState(startingStr);
  const [cursorPos, setCursorPos] = useState([0, 0]);
  const [mode, setMode] = useState(NORMAL_MODE)

  let vim = new Vim(startingStr.join('\n'));

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", checkSpecialKey);
    return () => {
      window.removeEventListener("keyup", checkSpecialKey);
    };
  }, []);

  const checkKeyPress = useCallback(
    (event : any) => {
      let key = event.key;
      if (event.ctrlKey) {
        key = key.concat('$CONTROL$');
      }
      let output = vim.execute(key);
      setText(output.text);
      setCursorPos([output.cursorPos.row, output.cursorPos.col]);
      setMode(output.mode)
    },
    [text]
  );

  const checkSpecialKey = useCallback(
    (event : any) => {
      let key = event.key;
    },
    [text]
  )

  function formatLine(line : string, index : number) {
    if (index == cursorPos[0]) {
        let cursorPart = line.slice(cursorPos[1], cursorPos[1] + 1)
        if (cursorPart.length === 0)
          cursorPart = ' '
        return <p key={index}>{line.slice(0, cursorPos[1])}<span className='cursorChar'>{cursorPart}</span>{line.slice(cursorPos[1]+1)}</p>
    }
    return <p key={index}>{line}</p>
  }

  return (
    <div onKeyDown={checkKeyPress} className='page'>
      {text.map(formatLine)}
      <div className='footer'>--{mode}--</div>
    </div>);
}

export default App
