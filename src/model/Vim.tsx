import VimOutput from "./VimOutput"; 
import Point from "./Point";
import HandleVisual from "./VisualMode";
import HandleCommand from "./CommandMode";
import { HandleMove } from "./Utility";

export const NORMAL_MODE = 'normal'; 
export const INSERT_MODE = 'insert'; 
export const VISUAL_MODE = 'visual'; 
export const COMMAND_MODE = 'command';

export default class Vim {
    text : string[]; 
    commandText : string;
    cursorPos : Point; 
    commandCursorPos : Point;
    mode : string;
    stringPos : number;
    isCntrlKeyDown : boolean;
    visualStart : Point;
    previousText : string[][];

    constructor(startText : string)
    {
        this.text = startText.split('\n');
        this.commandText = "";
        this.cursorPos = new Point(0, 0);
        this.commandCursorPos = new Point(0, 0);
        this.mode = NORMAL_MODE;
        this.stringPos = 0;
        this.isCntrlKeyDown = false;
        this.visualStart = new Point(0,0); 
        this.previousText = [this.text];
    }

    exec_arrow_movement(commands : string) {
        switch (commands) {
            case 'ArrowDown': // move cursor down
                if (this.cursorPos.row < this.text.length - 1) { // check if bottom of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row + 1].length) {// check if current cursor column position is past the length of the row under current
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.text[this.cursorPos.row + 1].length);
                    }
                    else {
                        //console.log('Please?')
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.cursorPos.col);
                    }
                }
                break;
            case 'ArrowUp':
                if (this.cursorPos.row != 0) {// check if top of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row - 1].length) {// check if cursor col is past length of row above
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.text[this.cursorPos.row - 1].length);
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.cursorPos.col);
                    }
                }
                break;
            case 'ArrowRight':
                //console.log('Pressed l');
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Make sure it isnt larger than the string itself
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
                }
                break
            case 'ArrowLeft':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                }
                break;
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
    }

    exec_cntrl_insert_mode(commands : string) : VimOutput {
        
        switch (commands) {
            case 't':
                this.text[this.cursorPos.row] = "\t" + this.text[this.cursorPos.row]
                this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
            case 'd':
                if (this.text[this.cursorPos.row][0] == '\t') {
                    this.text[this.cursorPos.row] = this.text[this.cursorPos.row].substring(1)
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                    return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
            default:
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
        }
    }

    exec_insert_mode(commands : string) : VimOutput {
        if (this.isCntrlKeyDown) {
            return this.exec_cntrl_insert_mode(commands)
        }
        switch (commands) {
            case 'Escape':
                this.mode = NORMAL_MODE
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown)
            case 'Backspace':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    let newText = this.text
                    newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col - 1) + this.text[this.cursorPos.row].slice(this.cursorPos.col);
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else if (this.cursorPos.row > 0) {
                    let newText = this.text
                    let rowLen = 0;
                    rowLen = newText[this.cursorPos.row].length
                    newText[this.cursorPos.row-1] = newText[this.cursorPos.row-1].concat(newText[this.cursorPos.row])
                    let temp = '';
                    for (let i = this.cursorPos.row; i < newText.length - 1; i++) {
                        temp = newText[i+1];
                        newText[i] = temp;
                    }
                    //+ this.text[this.cursorPos.row].slice(this.cursorPos.col)
                    this.cursorPos = new Point(this.cursorPos.row - 1, newText[this.cursorPos.row - 1].length - rowLen); 
                    newText.splice(-1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
            case 'Delete':
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Stay on the screen
                    let newText = this.text
                    newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + this.text[this.cursorPos.row].slice(this.cursorPos.col + 1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else if (this.cursorPos.row < this.text[this.cursorPos.row].length - 1) {
                    let newText = this.text
                    let rowLen = 0;
                    rowLen = newText[this.cursorPos.row].length
                    newText[this.cursorPos.row] = newText[this.cursorPos.row].concat(newText[this.cursorPos.row + 1])
                    let temp = '';
                    for (let i = this.cursorPos.row + 1; i < newText.length - 1; i++) {
                        temp = newText[i+1];
                        newText[i] = temp;
                    }
                    //+ this.text[this.cursorPos.row].slice(this.cursorPos.col)
                    newText.splice(-1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
            case 'Enter':
                let newText = this.text
                let temp = this.text[this.cursorPos.row].slice(this.cursorPos.col)
                newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col);
                let replace = '';
                newText.push('')
                for (let i = this.cursorPos.row + 1; i < newText.length; i++) {
                    replace = newText[i];
                    newText[i] = temp;
                    temp = replace;
                }
                //+ this.text[this.cursorPos.row].slice(this.cursorPos.col)
                this.cursorPos = new Point(this.cursorPos.row + 1, 0);
                this.text = newText;
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
            case 'Shift': // fallthrough
            case 'F12':
            case 'F11':
            case 'F10':
            case 'F9':
            case 'F8':
            case 'F7':
            case 'F6':
            case 'F5':
            case 'F4':
            case 'F3':
            case 'F2':
            case 'F1':
            case 'Control':
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);

        }
        let newText = this.text
        newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + commands + this.text[this.cursorPos.row].slice(this.cursorPos.col)
        this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
        return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown) 
    }

    exec_normal_mode(commands : string) : VimOutput {
        switch (commands) {
            case 'i': // Switch to insert mode
                this.mode = INSERT_MODE;
                return new VimOutput(this.text, this.cursorPos, INSERT_MODE, this.isCntrlKeyDown);
            case ':':
                console.log("ABOUT TO ENTER");
                this.mode = COMMAND_MODE;
                return new VimOutput(this.text, this.cursorPos, COMMAND_MODE, this.isCntrlKeyDown, new Point(0,0), new Point(0, 0), "");
            case 'j': // move cursor down
                if (this.cursorPos.row < this.text.length - 1) { // check if bottom of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row + 1].length) {// check if current cursor column position is past the length of the row under current
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.text[this.cursorPos.row + 1].length);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost error???
                    }
                    else {
                        //console.log('Please?')
                        this.cursorPos = new Point(this.cursorPos.row + 1, this.cursorPos.col);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'k':
                if (this.cursorPos.row != 0) {// check if top of screen
                    if (this.cursorPos.col > this.text[this.cursorPos.row - 1].length) {// check if cursor col is past length of row above
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.text[this.cursorPos.row - 1].length);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost error???
                    }
                    else {
                        this.cursorPos = new Point(this.cursorPos.row - 1, this.cursorPos.col);
                        return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                    }
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'l':
                //console.log('Pressed l');
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Make sure it isnt larger than the string itself
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'h':
                if (this.cursorPos.col > 0) { // Stay on the screen
                    this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col - 1);
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); // Fencepost 
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case '0':
                this.cursorPos = new Point(this.cursorPos.row, 0);
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
            case '$':
                this.cursorPos = new Point(this.cursorPos.row, this.text[this.cursorPos.row].length);
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
            case 'w':
            case 'b': 
                this.cursorPos = HandleMove(this.text, this.cursorPos, commands); 
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown); 
            case 'v':
                this.mode = VISUAL_MODE;
                this.visualStart = this.cursorPos; 
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown, this.cursorPos);
            
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
    }

    handle_control(commands : string) : string {
        this.isCntrlKeyDown = !this.isCntrlKeyDown;
        return commands.slice(0, -1*'$CONTROL$'.length)
    }

    execute(commands : string) : VimOutput {
        console.log(this.mode);
        if (commands.includes('$CONTROL$')) {
            commands = this.handle_control(commands);
        }
        if (commands.includes('Arrow')) {
            return this.exec_arrow_movement(commands)
        }
        if (this.mode == INSERT_MODE) {
            return this.exec_insert_mode(commands);
        }
        else if (this.mode == NORMAL_MODE) {
            return this.exec_normal_mode(commands);
        }
        else if (this.mode == COMMAND_MODE) {
            let outpt = null;
            [outpt, this.commandCursorPos, this.commandText] = HandleCommand(new VimOutput(this.text, this.cursorPos, 
                COMMAND_MODE, this.isCntrlKeyDown, this.visualStart), commands, this.commandCursorPos, this.commandText); 
            this.mode = outpt.mode; 
            return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown, new Point(0, 0), this.commandCursorPos, this.commandText); 
        }
        else if (this.mode == VISUAL_MODE)
        {
            const outpt = HandleVisual(new VimOutput(this.text, this.cursorPos, 
                VISUAL_MODE, this.isCntrlKeyDown, this.visualStart), commands); 

            this.cursorPos = outpt.cursorPos;
            this.visualStart = outpt.visualStart; 
            this.mode = outpt.mode; 
            return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown, this.visualStart); 
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown); 
    }
}
