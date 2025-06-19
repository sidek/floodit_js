import seedrandom from 'https://cdn.skypack.dev/seedrandom';

export class FloodItState {
    constructor(grid, size, colors, current_blob) {
        this.grid = grid; // 2D array of integers
        this.size = size; // integer
        this.colors = colors; // integer
        this.current_blob = current_blob; // array of [row, col] pairs
    }
    move(color) {
        // Set all cells in the current blob to the new color
        for (const [row, col] of this.current_blob) {
            this.grid[row][col] = color;
        }
        // Recompute the current blob starting from the first cell
        this.current_blob = connectedComponent(this.grid, this.current_blob[0]);
        return this;
    }

    is_won() {
        return this.current_blob.length === this.size * this.size;
    }

    active_colors() {
        const colors = new Set();
        for (const row of this.grid) {
            for (const cell of row) {
                colors.add(cell);
            }   
        }
        return colors;
    }

    clone() {
        const newGrid = this.grid.map(row => row.slice());
        const newBlob = this.current_blob.map(([i, j]) => [i, j]);
        return new FloodItState(newGrid, this.size, this.colors, newBlob);
    }
}

export function newFloodIt(size, colors, seed = Date.now()) {
    const rng = seedrandom(seed.toString());
    const grid = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.floor(rng() * colors))
    );
    const current_blob = connectedComponent(grid, [0, 0]);
    return new FloodItState(grid, size, colors, current_blob);
}




// Helper function to find the connected component (orthogonal neighbors only)
function connectedComponent(grid, cell) {
    const s = grid.length;
    const targetColor = grid[cell[0]][cell[1]];
    const visited = Array.from({ length: s }, () => Array(s).fill(false));
    const queue = [];
    const component = [];

    queue.push(cell);

    while (queue.length > 0) {
        const current = queue.shift();
        const [x, y] = current;
        if (visited[x][y]) continue;
        visited[x][y] = true;
        component.push([x, y]);

        // Orthogonal neighbors: up, down, left, right
        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];

        for (const [nx, ny] of neighbors) {
            if (
                nx >= 0 && nx < s &&
                ny >= 0 && ny < s &&
                !visited[nx][ny] &&
                grid[nx][ny] === targetColor
            ) {
                queue.push([nx, ny]);
            }
        }
    }

    return component;
}

export function perimeter(state) {
  // Returns the perimeter of the current blob
  let perimeter = 0;
  const grid = state.grid;
  const nRows = grid.length;
  const nCols = grid[0].length;
  for (const [i, j] of state.current_blob) {
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ni = i + di;
      const nj = j + dj;
      if (
        ni < 0 || ni >= nRows ||
        nj < 0 || nj >= nCols ||
        grid[ni][nj] !== grid[i][j]
      ) {
        perimeter += 1;
      }
    }
  }
  return perimeter;
}
