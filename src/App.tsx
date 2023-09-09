import './App.css'
import React, {useEffect, ChangeEventHandler, useState, useCallback} from 'react'
import Vim from './model/Vim'; 
import VimOutput from './model/VimOutput';

const startingStr = 'Hello Vim!\nTry moving the cursor.'

function App() {

  //const [vim, setVim] = useState<Vim>(new Vim(startingStr))
  const [text, setText] = useState(startingStr)
  const [stringPos, setStringPos] = useState(0)

  let vim = new Vim(startingStr)

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
      console.log('Jello');
      let key = event.key
      let output = vim.execute(key)
      console.log(output.text.join('\n'));
      setText(output.text.join('\n'))
      setStringPos(output.stringPos)
      //setText(`${text}${event.key}`);
    },
    [text]
  );
  
  //const checkKeyPress = (e : any) => {
  //  console.log('LOL');
  //  const { key, keyCode } = e;
  //  let output = vim.execute(key)
  //  setText(output.text.join('\n'))
  //};



  return  (<div onKeyDown={checkKeyPress}><p >{text.slice(0, stringPos)}<u>{text.slice(stringPos, stringPos+1)}</u>{text.slice(stringPos+1)}</p></div>);
}

export default App
