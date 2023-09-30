import Point from "./Point";

export function IsMove(input : string) : boolean
{
    switch (input)
    {
        case 'h':
        case 'j':
        case 'k':
        case 'l':
        case 'w':
        case 'b':
        case '$':
        case '0':
            return true; 
    }

    return false; 
}

export function HandleMove(text : string[], curPos : Point, command : string) : Point {
    if (command == 'h' || command == 'ArrowLeft')    
    {
        return new Point(curPos.row, Math.max(0, curPos.col - 1)); 
    }
    if (command == 'j' || command == 'ArrowDown')    
    {
        const newrow = Math.min(curPos.row + 1, text.length - 1)
        const newcol = curPos.col < text[newrow].length ? curPos.col : text[newrow].length - 1; 
        return new Point(newrow, newcol); 
    }
    if (command == 'k' || command == 'ArrowUp')
    {
        const newrow = Math.max(0, curPos.row - 1)
        const newcol = curPos.col < text[newrow].length ? curPos.col : text[newrow].length - 1; 
        return new Point(newrow, newcol); 
    }
    if (command == 'l' || command=='ArrowRight')
    {
        return new Point(curPos.row, Math.min(curPos.col + 1, text[curPos.row].length)); 
    }
    if (command == 'w') 
    {
        return handlew(text, curPos); 
    }
    if (command == 'b')
    {
        return handleb(text, curPos); 
    }
    if (command == '$')
    {
        return new Point(curPos.row, text[curPos.row].length);
    }
    if (command == '0')
    {
        return new Point(curPos.row, 0);
    }

    return curPos; 
}

const isAlphaNumeric = (v : string) => {
    let code = v.charCodeAt(0);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
    return true; 
}

const handlew = (text : string[], curPos : Point) : Point => {
    let foundBreak = false; 
    for (let i = curPos.col; i < text[curPos.row].length; i++)
    {
        if (!isAlphaNumeric(text[curPos.row][i]))
        {
            foundBreak = true; 
        }
        else
        {
            if (foundBreak)
                return new Point(curPos.row, i); 
        }
    }

    if (curPos.row + 1 < text.length)
    {
        for (let i = 0; i < text[curPos.row + 1].length; i++)
        {
            if (isAlphaNumeric(text[curPos.row + 1][i]))
            {
                return new Point(curPos.row + 1, i); 
            }
        }

        return new Point(curPos.row + 1, 0); 
    }
    else
    {
        return new Point(curPos.row, text[curPos.row].length - 1); 
    }
}

const handleb = (text : string[], curPos : Point) : Point => {
    let breaks = 1; 
    let anybreak = false;
    if (curPos.col - 1 >= 0 && (!isAlphaNumeric(text[curPos.row][curPos.col - 1]) || !isAlphaNumeric(text[curPos.row][curPos.col])))
        breaks = 2; 

    for (let i = curPos.col; i >= 0; i--)
    {
        if (!isAlphaNumeric(text[curPos.row][i]))
        {
            anybreak = true; 
            breaks--; 
            if (breaks == 0)
            {
                return new Point(curPos.row, i + 1); 
            }
        }
    }

    if (anybreak)
    {
        return new Point(curPos.row, 0); 
    }

    if (curPos.row - 1 >= 0)
    {
        for (let i = text[curPos.row - 1].length - 1; i >= 0; i--)
        {
            if (isAlphaNumeric(text[curPos.row - 1][i]))
            {
                return new Point(curPos.row - 1, i); 
            }
        }
        return new Point(curPos.row - 1, text[curPos.row - 1].length - 1); 
    }
    else
    {
        return new Point(curPos.row, 0); 
    }
}
