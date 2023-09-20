# React + TypeScript : Optimized Conway - Game of Life

## Description

Optimized project of Conway's game of life, made with React and Typescript. The game of life is a cellular automaton that simulates the evolution of a population of cells according to simple rules. The cells are represented by the squares or circles of a grid, and can be in two states: alive or dead. The evolution of the population is determined by the state of the cells adjacent to each cell. The rules are as follows:

- A living cell with fewer than two living neighbors dies.
- A living cell with two or three living neighbors remains alive.
- A living cell with more than three living neighbors dies.
- A dead cell with exactly three living neighbors becomes alive.

The optimization techniques include memoization, rendering on Canvas with requestAnimationFrame.
It includes many tricks to improve performances like 1D arrays instead 2D arrays with the use of native Uint8Array and Uint32Array to store the cells state and others information. It also uses Double/Triple buffering to avoid unnecessary operations and some others small tricks.

On React side, i'm using TaildwindCSS for quick styling. You'll also find a custom hook `useRequestAnimationFrame` to handle the game loop with improve performance time calculations and a FPS rate limiter. On the game side, i'm using a class witch can be use out of React.

You'll also find some commons tips an tricks with React components....

## Demo

## Installation

```bash
$ pnpm install
```

or your favorite package manager

## Running the app

```bash
# development
$ pnpm dev
```

## License

This project is [MIT licensed](LICENSE).
