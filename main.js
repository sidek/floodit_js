import {FloodItState, newFloodIt} from './flood_it.js';
import {greed, perimeterObjective, sizeObjective} from './solver.js';
import seedrandom from 'https://cdn.skypack.dev/seedrandom';

let moves = 0; 
let state; 
let size = 14;
let lookahead = 6;
let colors = 6;
const colorList = ["red", "green", "blue", "yellow", "purple", "cyan"];

export function updateLookahead() {
  const lookaheadInput = document.getElementById('lookahead-input');
  let newLookahead = parseInt(lookaheadInput.value, 10);
  if (isNaN(newLookahead) || newLookahead < 1) {
    lookahead = 6;
  }
  else {
    lookahead = newLookahead;
  }
}

export function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 40px)`;
  board.style.gridTemplateRows = `repeat(${size}, 40px)`;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.backgroundColor = colorList[state.grid[r][c]];
      if (state.current_blob.some(([br, bc]) => br === r && bc === c)) {
        cell.style.border = '3px solid black';
      } else {
        cell.style.border = '1px solid gray';
      }
      board.appendChild(cell);
    }
  }
}
export function renderControls() {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';
  for (let c = 0; c < colors; ++c) {
    const btn = document.createElement('button');
    btn.style.height = '3em';
    btn.style.width = '3em';
    btn.className = 'color-btn';
    btn.style.background = colorList[c];
    btn.onclick = () => handleMove(c);
    controls.appendChild(btn);
  }
  const greedyBtn = document.createElement('button');
    greedyBtn.textContent = 'Max size move';
    greedyBtn.classList.add('move-button');
    greedyBtn.onclick = () => handleMove(greed(state, sizeObjective, lookahead));
    controls.appendChild(greedyBtn);

  const perimeterBtn = document.createElement('button');
    perimeterBtn.textContent = 'Max perimeter move';
    perimeterBtn.classList.add('move-button');
    perimeterBtn.onclick = () => handleMove(greed(state, perimeterObjective, lookahead));
    controls.appendChild(perimeterBtn);

   const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('top-button');
    newGameBtn.textContent = 'New Game';
    newGameBtn.onclick = () => newGame();
    controls.appendChild(newGameBtn);
}
export function handleMove(color) {
  if (color === state.grid[0][0] || state.is_won()) return;
  state.move(color);
  moves++;
  renderBoard();
  document.getElementById('moves').textContent = `Moves: ${moves}`;
}

export function newGame() {
// generate a random seed and display it 
    const seed = Date.now();
    document.getElementById('seed').textContent = `Seed: a${seed}`;
  state = newFloodIt(size, colors, seed);
  moves = 0;
  renderBoard();
  renderControls();
  const lookahead = parseInt(document.getElementById('lookahead-input').value, 5);
}

export function newGameFromSeed() {
    const seedInput = document.getElementById('seed-value').value;
    const match = seedInput.match(/^a(\d+)$/);
    if (!match) {
        alert('Invalid seed format. Use "a" followed by digits, e.g., a1234567890');
        return;
    }
    const seed = parseInt(match[1]);
    state = newFloodIt(size, colors, seed);
    moves = 0;
    renderBoard();
    renderControls();
    document.getElementById('seed').textContent = `Seed: ${seedInput}`;
}

