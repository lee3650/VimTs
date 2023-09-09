import Point from "./Point";

export default class VimOutput {
    text : string[];
    cursorPos : Point; 
    mode : string; 

    constructor(text : string[], cursorPos : Point, mode : string) {
        this.text = text; 
        this.cursorPos = cursorPos; 
        this.mode = mode;
    }
}
