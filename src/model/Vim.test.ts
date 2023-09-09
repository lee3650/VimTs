import {expect, test} from 'vitest'
import Vim from "./Vim";
import Point from './Point';

test('move cursor left works', () => {
    const myvim = new Vim('abcdefg'); 
    const output = myvim.execute('l'); 
    expect(output.cursorPos).toEqual(new Point(0, 1)); 
})

