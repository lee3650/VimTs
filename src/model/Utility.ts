import Point from "./Point";

export function HandleMove(text : string[], curPos : Point, command : string) : Point {
    if (command == 'h')    
    {
        return new Point(curPos.row, Math.max(0, curPos.col - 1)); 
    }
    if (command == 'j')    
    {
        const newrow = Math.min(curPos.row - 1, text.length - 1)
        const newcol = curPos.col < text[newrow].length ? curPos.col : text[newrow].length - 1; 
        return new Point(newrow, newcol); 
    }
    if (command == 'k')
    {
        const newrow = Math.max(0, curPos.row - 1)
        const newcol = curPos.col < text[newrow].length ? curPos.col : text[newrow].length - 1; 
        return new Point(newrow, newcol); 
    }
    if (command == 'l')
    {
        return new Point(curPos.row, Math.min(curPos.col + 1, text[curPos.row].length)); 
    }

    return curPos; 
}
