import { makeGrid } from './grid';

test('2 small items', () => {
  expect(
    makeGrid([
      { id: 1, size: 'Small' },
      { id: 2, size: 'Small' },
    ])
  ).toEqual(['u1 u2 . . . .']);
});

test('9 small items', () => {
  expect(
    makeGrid([
      { id: 1, size: 'Small' },
      { id: 2, size: 'Small' },
      { id: 3, size: 'Small' },
      { id: 4, size: 'Small' },
      { id: 5, size: 'Small' },
      { id: 6, size: 'Small' },
      { id: 7, size: 'Small' },
      { id: 8, size: 'Small' },
      { id: 9, size: 'Small' },
    ])
  ).toEqual([
    //
    'u1 u2 u3 u4 u5 u6',
    'u7 u8 u9 . . .',
  ]);
});

test('2 small items and 1 large', () => {
  expect(
    makeGrid([
      { id: 1, size: 'Large' },
      { id: 2, size: 'Small' },
      { id: 3, size: 'Small' },
    ])
  ).toEqual([
    //
    'u1 u1 u2 u3 . .',
    'u1 u1 . . . .',
  ]);
});

test('3 small items and 2 large', () => {
  expect(
    makeGrid([
      { id: 1, size: 'Large' },
      { id: 2, size: 'Small' },
      { id: 3, size: 'Large' },
      { id: 4, size: 'Small' },
      { id: 5, size: 'Small' },
    ])
  ).toEqual([
    //
    'u1 u1 u2 u3 u3 u4',
    'u1 u1 u5 u3 u3 .',
  ]);
});
