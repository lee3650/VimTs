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

        }

        switch (commands) {

        }

        return new VimOutput(this.text, this.cursorPos, this.mode); 
    }
}



