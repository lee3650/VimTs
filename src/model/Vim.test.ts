import {expect, test} from 'vitest'
import Vim from "./Vim";
import Point from './Point';

test('move cursor right works', () => {
    const myvim = new Vim('abcdefg'); 
    const output = myvim.execute('l'); 
    expect(output.cursorPos).toEqual(new Point(0, 1)); 
})

test('move cursor left works', () => {
    const myvim = new Vim('abcdefg'); 
    const output = myvim.execute('r'); 
    expect(output.cursorPos).toEqual(new Point(0, 0)); 
})

test('cannot move cursor past end or start', () => {
    const startstr = 'abc'
    const myvim = new Vim(startstr)
    let output = myvim.execute('h')
    expect(output.cursorPos.col).toBe(0)
    output = myvim.execute('l')
    output = myvim.execute('l')
    output = myvim.execute('l')
    expect(output.cursorPos.col).toBe(3)
    output = myvim.execute('h')
    output = myvim.execute('h')
    output = myvim.execute('h')
    output = myvim.execute('h')
    expect(output.cursorPos.col).toBe(0)
})

test('0 moves cursor to start, and $ moves to end', () => {
    const startstr = 'abcdefg'; 
    const myvim = new Vim('abcdefg'); 
    let output = myvim.execute('$')
    expect(output.cursorPos.col).toBe(startstr.length)
    output = myvim.execute('0')
    expect(output.cursorPos.col).toBe(0)
})

test('k cannot go above 0, j cannot go below the end', () => {
    const myvim = new Vim('this is a test\nthis is a second line')
    let output = myvim.execute('k')
    expect(output.cursorPos.row).toBe(0)
    output = myvim.execute('j')
    expect(output.cursorPos.row).toBe(1)
    output = myvim.execute('j')
    expect(output.cursorPos.row).toBe(1)
})

