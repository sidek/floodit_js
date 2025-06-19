import {perimeter, newFloodIt, FloodItState } from './flood_it.js';

function possibleMoves(state) {
  // Returns an array of [nextState, [color]] for each active color
  const moves = [];
  for (const color of state.active_colors()) {
    if (color === state.grid[0][0]) continue; // Skip current color
    const nextState = state.clone(); 
    nextState.move(color);
    moves.push([nextState, [color]]);
  }
  return moves;
}

function lookahead(state, depth) {
  // Returns all possible paths of the given depth (or shorter if game is won)
  if (depth === 0 || state.is_won()) {
    return [[state, []]];
  }
  let advance = 0;
  let states = [[state, []]];
  while (advance < depth) {
    let newStates = [];
    for (const [s, path] of states) {
      for (const [ss, color] of possibleMoves(s)) {
        newStates.push([ss, [...path, color]]);
      }
    }
    states = newStates;
    advance += 1;
    if (states.some(([s, _]) => s.is_won())) {
      break;
    }
  }
  return states;
}

export function greed(state, objective, depth) {
  const options = lookahead(state, depth);
  let bestObj = -1;
  let bestPath = [];
  for (const [s, path] of options) {
    const obj = objective(s);
    if (obj > bestObj) {
      bestObj = obj;
      bestPath = path;
    }
  }
  // Return the first color in the best path, or undefined if no path
  return parseInt(bestPath[0]);
}

export function perimeterObjective(state) {
  // Objective: interpolate between perimeter for small blobs and size for large blobs
  const size = state.current_blob.length;
  const maxSize = state.grid.length * state.grid[0].length;
  const p = perimeter(state);
  return (1 - size / maxSize) * p + (size / maxSize) * size;
}

export function sizeObjective(state) {
  return state.current_blob.length;
}