import './VimApp.css'
import React, {useEffect, ChangeEventHandler, useState, useCallback} from 'react'
import Vim, { COMMAND_MODE, VISUAL_MODE } from './model/Vim'; 
import VimOutput from './model/VimOutput';
import { NORMAL_MODE, INSERT_MODE } from './model/Vim';

const VimApp : React.FC<{ startingStr : string[] }> = ({startingStr}) => {

  //const [vim, setVim] = useState<Vim>(new Vim(startingStr))
  const [text, setText] = useState(startingStr);
  const [cursorPos, setCursorPos] = useState([0, 0]);
  const [mode, setMode] = useState(NORMAL_MODE)
  const [visualStart, setVisualStart] = useState([0, 0]);
  const [commandText, setCommandText] = useState("");
  const [commandCursorPos, setCommandCursorPos] = useState([0, 0])

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
      event.preventDefault()
      let key = event.key;
      if (event.ctrlKey) {
        key = key.concat('$CONTROL$');
      }
      let output = vim.execute(key);
      setText(output.text);
      // 0 = ROW, 1 = COL 
      setCursorPos([output.cursorPos.row, output.cursorPos.col]);
      setMode(output.mode); 
      setVisualStart([output.visualStart.row, output.visualStart.col]);
      setCommandCursorPos([output.commandCursorPos.row, output.commandCursorPos.col]);
      setCommandText(output.commandText);
    },
    [text]
  );

  const checkSpecialKey = useCallback(
    (event : any) => {
      let key = ""
      if (event.ctrlKey) {
        key = '$CONTROL$'
        let output = vim.execute(key);
      }
      //setControlKey?
    },
    [text]
  )

  function formatLine(line : string, index : number) {
    if (mode == VISUAL_MODE)
    {
      // TODO - make this more functional 

      let startPos = visualStart;
      let endPos = cursorPos; 

      if (startPos[0] > endPos[0])
      {
        let tmp = startPos; 
        startPos = endPos;
        endPos = tmp; 
      }

      if (startPos[0] == endPos[0])
      {
        if (startPos[1] > endPos[1])
        {
          let tmp = startPos; 
          startPos = endPos; 
          endPos = tmp; 
        }
      }

      if (index < startPos[0] || index > endPos[0])
      {
        return <span key={index}>{line}{'\n'}</span>
      }

      let startind = 0; 
      let endind = line.length; 
      let before = ''; 
      let after = ''; 
      let insel = ''; 

      if (index == startPos[0])
      {
        before = line.slice(0, startPos[1]); 
        startind = startPos[1];
      }
      if (index == endPos[0])
      {
        after = line.slice(endPos[1] + 1, line.length); 
        endind = endPos[1] + 1; 
      }

      insel = line.slice(startind, endind); 

      return <span key={index}>{before}<span className='cursorChar'>{insel}</span>{after}{'\n'}</span>
    }
    else 
    {
      if (index == cursorPos[0]) {
          let cursorPart = line.slice(cursorPos[1], cursorPos[1] + 1)
          if (cursorPart.length === 0)
            cursorPart = ' '
          return <span key={index}>{line.slice(0, cursorPos[1])}<span className='cursorChar'>{cursorPart}</span>{line.slice(cursorPos[1]+1)}{'\n'}</span>
      }
      return <span key={index}>{line}{'\n'}</span>
    }
  }

  function formatFooter() {
    console.log(mode);
    if (mode != COMMAND_MODE) {
      console.log("Should be here");
      return <p>--{mode}--</p>
    }
    else {
      console.log("Why?");
      let cursorPart = commandText.slice(commandCursorPos[1], commandCursorPos[1] + 1)
      if (cursorPart.length === 0)
        cursorPart = ' '
      return <p key={-1}>:{commandText.slice(0, cursorPos[1])}<span className='cursorChar'>{cursorPart}</span>{commandText.slice(cursorPos[1]+1)}</p>
    }
  }

  return (
    <div onKeyDown={checkKeyPress} className='page'>
      <pre>
      {text.map(formatLine)}
      </pre>
      <div className='footer'>{formatFooter()}</div>
    </div>);
}

export default VimApp
