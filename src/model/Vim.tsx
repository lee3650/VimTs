import VimOutput from "./VimOutput"; 
import Point from "./Point";
import HandleVisual from "./VisualMode";
import { HandleMove, IsMove } from "./Utility";

export const NORMAL_MODE = 'normal'; 
export const INSERT_MODE = 'insert'; 
export const VISUAL_MODE = 'visual'; 

export default class Vim {
    text : string[]; 
    cursorPos : Point; 
    mode : string; 
    stringPos : number;
    isCntrlKeyDown : boolean;
    visualStart : Point; 

    constructor(startText : string)
    {
        this.text = startText.split('\n');
        this.cursorPos = new Point(0, 0);
        this.mode = NORMAL_MODE;
        this.stringPos = 0;
        this.isCntrlKeyDown = false;
        this.visualStart = new Point(0,0); 
    }

    calculateStringCursorPos() {
        let count = 0;
        for (let i = 0; i < this.cursorPos.row; i++) {
            count += this.text[i].length;
        }
        return count + this.cursorPos.col
    }

    exec_insert_mode(commands : string) : VimOutput {
        console.log(commands);
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
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
                }
            case 'Delete':
                if (this.cursorPos.col < this.text[this.cursorPos.row].length) { // Stay on the screen
                    let newText = this.text
                    newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + this.text[this.cursorPos.row].slice(this.cursorPos.col + 1);
                    return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown);
                }
                else {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE, this.isCntrlKeyDown);
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
            case 'Shift':
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);

        }
        let newText = this.text
        newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + commands + this.text[this.cursorPos.row].slice(this.cursorPos.col)
        this.cursorPos = new Point(this.cursorPos.row, this.cursorPos.col + 1);
        return new VimOutput(newText, this.cursorPos, this.mode, this.isCntrlKeyDown) 
    }

    exec_normal_mode(commands : string) : VimOutput {
        if (IsMove(commands)) {
            let newpos = HandleMove(this.text, this.cursorPos, commands); 
            this.cursorPos = newpos; 
            return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown, this.visualStart); 
        }

        switch (commands) {
            case 'i': // Switch to insert mode
                this.mode = INSERT_MODE;
                return new VimOutput(this.text, this.cursorPos, INSERT_MODE, this.isCntrlKeyDown);
            case 'v':
                this.mode = VISUAL_MODE;
                this.visualStart = this.cursorPos; 
                return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown, this.cursorPos);
            
        }
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown);
    }

    parse_command(commands : string) : string {
        return commands
    }

    execute(commands : string) : VimOutput {
        if (this.mode == INSERT_MODE) {
            return this.exec_insert_mode(commands);
        }
        else if (this.mode == NORMAL_MODE) {
            return this.exec_normal_mode(commands);
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
        // Do I need to make a new point each time?
        
        return new VimOutput(this.text, this.cursorPos, this.mode, this.isCntrlKeyDown); 
    }
}
