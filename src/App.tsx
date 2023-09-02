import './App.css'
import React, {useState} from 'react'
import Vim from './model/Vim'; 
import VimOutput from './model/VimOutput';

const startingStr = 'Hello Vim!\nTry moving the cursor.'

function App() {

  const [state, setState] = useState<string[]>(new VimOutput(startingStr.split('\n'), ))
  const [vim, setVim] = useState<Vim>(new Vim(startingStr))

  let handleKey = (ev : KeyboardEvent) => {
    let key = ev.key
    let output = vim.execute(key)
    setText(output.text)
  }

  return <html></html>
}

export default App
