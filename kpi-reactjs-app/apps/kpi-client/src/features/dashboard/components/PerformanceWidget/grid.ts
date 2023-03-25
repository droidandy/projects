import * as R from 'remeda';

interface GridItem {
  id: number;
  size: string;
}

const COLS = 6;

export function makeGrid(items: GridItem[]) {
  const grid: string[][] = [];

  const addNewRow = () => {
    grid.push(R.range(0, COLS).map(() => '.'));
  };

  const getEmpty1x1 = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '.') {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  const getEmpty2x2 = () => {
    for (let i = 0; i < grid.length - 1; i++) {
      for (let j = 0; j < grid[i].length - 1; j++) {
        if (
          grid[i][j] === '.' &&
          grid[i][j + 1] === '.' &&
          grid[i + 1][j] === '.' &&
          grid[i + 1][j + 1] === '.'
        ) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  items.forEach(item => {
    const id = 'u' + item.id;
    if (item.size === 'Large') {
      let pos = getEmpty2x2();
      if (!pos) {
        addNewRow();
        pos = getEmpty2x2();
      }
      if (!pos) {
        addNewRow();
        pos = getEmpty2x2();
      }
      grid[pos!.row]![pos!.col] = id;
      grid[pos!.row]![pos!.col + 1] = id;
      grid[pos!.row + 1]![pos!.col] = id;
      grid[pos!.row + 1]![pos!.col + 1] = id;
    } else {
      let pos = getEmpty1x1();
      if (!pos) {
        addNewRow();
        pos = getEmpty1x1();
      }
      grid[pos!.row]![pos!.col] = id;
    }
  });

  return grid.map(row => row.join(' '));
}
