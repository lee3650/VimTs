import VimOutput from "./VimOutput"; 
import Point from "./Point";
import HandleVisual from "./VisualMode";
import HandleCommand from "./CommandMode";
import { HandleMove } from "./Utility";
import HandleInsert from "./InsertMode";
import HandleNormal from "./NormalMode";

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

    handle_control(commands : string) : string {
        this.isCntrlKeyDown = !this.isCntrlKeyDown;
        return commands.slice(0, -1*'$CONTROL$'.length)
    }

    execute(commands : string) : VimOutput {
        if (commands.includes('$CONTROL$')) {
            commands = this.handle_control(commands);
        }
        if (commands.includes('Arrow')) {
            this.cursorPos = HandleMove(this.text, this.cursorPos, commands)
            return new VimOutput(this.text, this.cursorPos, 
                this.mode, this.isCntrlKeyDown, this.visualStart)
        }
        if (this.mode == INSERT_MODE) {
            const outpt = HandleInsert(new VimOutput(this.text, this.cursorPos, 
                this.mode, this.isCntrlKeyDown, this.visualStart), commands);
            this.cursorPos = outpt.cursorPos;
            this.text = outpt.text; 
            this.mode = outpt.mode; 
            return outpt
        }
        else if (this.mode == NORMAL_MODE) {
            const outpt = HandleNormal(new VimOutput(this.text, this.cursorPos, 
                this.mode, this.isCntrlKeyDown, this.visualStart), commands);
            this.cursorPos = outpt.cursorPos;
            this.text = outpt.text; 
            this.mode = outpt.mode; 
            return outpt
        }
        else if (this.mode == COMMAND_MODE) {
            let outpt = null;
            outpt  = HandleCommand(new VimOutput(this.text, this.cursorPos, 
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
