import { expect, test } from 'vitest'
import Vim from './Vim'
import Point from './Point'

test('move cursor right works', () => {
  const myvim = new Vim('abcdefg')
  const output = myvim.execute('l')
  expect(output.cursorPos).toEqual(new Point(0, 1))
})

test('move cursor left works', () => {
  const myvim = new Vim('abcdefg')
  const output = myvim.execute('r')
  expect(output.cursorPos).toEqual(new Point(0, 0))
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
  const startstr = 'abcdefg'
  const myvim = new Vim('abcdefg')
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

test('Delete Key', () => {
  const myvim = new Vim('this is a test\nthis is a second line')
  let output = myvim.execute('k')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('j')
  expect(output.cursorPos.row).toBe(1)
  output = myvim.execute('i')
  expect(output.mode).toBe('insert')
  output = myvim.execute('Delete')
  expect(output.text.join('\n')).toBe('this is a test\nhis is a second line')
  output = myvim.execute('ArrowUp')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('Delete')
  expect(output.text.join('\n')).toBe('his is a test\nhis is a second line')
})

test('Backspace Key', () => {
  const myvim = new Vim('this is a test\nthis is a second line')
  let output = myvim.execute('k')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('j')
  expect(output.cursorPos.row).toBe(1)
  output = myvim.execute('l')
  expect(output.cursorPos.col).toBe(1)
  output = myvim.execute('i')
  expect(output.mode).toBe('insert')
  output = myvim.execute('Backspace')
  expect(output.text.join('\n')).toBe('this is a test\nhis is a second line')
  output = myvim.execute('ArrowUp')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('ArrowRight')
  expect(output.cursorPos.col).toBe(1)
  output = myvim.execute('Backspace')
  expect(output.text.join('\n')).toBe('his is a test\nhis is a second line')
})

test('Enter Key', () => {
  const myvim = new Vim('this is a test\nthis is a second line')
  let output = myvim.execute('k')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('j')
  expect(output.cursorPos.row).toBe(1)
  output = myvim.execute('l')
  expect(output.cursorPos.col).toBe(1)
  output = myvim.execute('i')
  expect(output.mode).toBe('insert')
  output = myvim.execute('Enter')
  expect(output.text.join('\n')).toBe('this is a test\nt\nhis is a second line')
  output = myvim.execute('ArrowUp')
  expect(output.cursorPos.row).toBe(1)
  output = myvim.execute('ArrowUp')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('ArrowRight')
  expect(output.cursorPos.col).toBe(1)
  output = myvim.execute('Enter')
  expect(output.text.join('\n')).toBe(
    't\nhis is a test\nt\nhis is a second line'
  )
})
test('Enter Key inverse Backspace', () => {
  const myvim = new Vim('this is a test\nthis is a second line')
  let output = myvim.execute('k')
  expect(output.cursorPos.row).toBe(0)
  output = myvim.execute('j')
  expect(output.cursorPos.row).toBe(1)
  output = myvim.execute('l')
  expect(output.cursorPos.col).toBe(1)
  output = myvim.execute('i')
  expect(output.mode).toBe('insert')
  output = myvim.execute('Enter')
  output = myvim.execute('Backspace')
  output = myvim.execute('Enter')
  expect(output.text.join('\n')).toBe('this is a test\nt\nhis is a second line')
})

test('Yank one line', () => {
  const myvim = new Vim('this is a test\nthis is a second line\nline3')
  let output = myvim.execute('y')
  output = myvim.execute('y')
  output = myvim.execute('p')
  expect(output.text.join('\n')).toBe(
    'this is a test\nthis is a test\nthis is a second line\nline3'
  )
})

test('Yank 3 lines', () => {
  const myvim = new Vim('this is a test\nthis is a second line\nline3\n')
  let output = myvim.execute('3')
  output = myvim.execute('y')
  output = myvim.execute('y')
  output = myvim.execute('p')
  expect(output.text.join('\n')).toBe(
    'this is a test\nthis is a second line\nline3\nthis is a test\nthis is a second line\nline3\n'
  )
})
