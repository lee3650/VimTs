import VimOutput from "./VimOutput"; 
import Point from "./Point";

const NORMAL_MODE = 'normal'; 
const INSERT_MODE = 'insert'; 

export default class Vim {
    text : string[]; 
    cursorPos : Point; 
    mode : string; 

    constructor(startText : string)
    {
        this.text = startText.split('\n');
        this.cursorPos = new Point(0, 0);
        this.mode = NORMAL_MODE; 
    }

    execute(commands : string) : VimOutput {
        if (this.mode == INSERT_MODE)        
        {
            let newText = this.text
            newText[this.cursorPos.row] = this.text[this.cursorPos.row].slice(0, this.cursorPos.col) + commands + this.text[this.cursorPos.row].slice(this.cursorPos.col)
            return new VimOutput(newText, new Point(this.cursorPos.row, this.cursorPos.col), this.mode ) 
        }

        switch (commands) {
            case 'i':
                return new VimOutput(this.text, this.cursorPos, INSERT_MODE)
                
            case 'j':
                if (this.cursorPos.row < this.text.length - 1)
                {
                    /// Logic
                }
                else 
                {
                    return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
                }
            case 'k':
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
            case 'l':
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
            case 'h':
                return new VimOutput(this.text, this.cursorPos, NORMAL_MODE)
        }

        return new VimOutput(this.text, this.cursorPos, this.mode); 
    }
}



