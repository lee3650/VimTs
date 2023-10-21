import VimOutput from "./VimOutput"; 
import { NORMAL_MODE, VISUAL_MODE, COMMAND_MODE } from "./Vim";
import Point from "./Point";
import { HandleMove } from "./Utility";

const HandleCommand = (curstate : VimOutput, command : string, commandCursorPos : Point, commandText : string) : VimOutput => {
    switch (command)
    {
        case "Escape":
            curstate.mode = NORMAL_MODE;
            curstate.commandText = "";
            curstate.commandCursorPos = new Point(0, 0);
            return curstate;
        case 'Backspace':
            if (curstate.cursorPos.col > 0) { // Stay on the screen
                let newText = curstate.text
                newText[curstate.cursorPos.row] = curstate.text[curstate.cursorPos.row].slice(0, curstate.cursorPos.col - 1) + curstate.text[curstate.cursorPos.row].slice(curstate.cursorPos.col);
                curstate.cursorPos = new Point(curstate.cursorPos.row, curstate.cursorPos.col - 1);
            }
            return curstate
        case "Enter":

        default:
            commandCursorPos.col = commandCursorPos.col + 1;
            commandText = commandText.concat(command);
            return curstate
    }
}

export default HandleCommand; 