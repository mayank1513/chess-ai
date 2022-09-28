# ChessAI

A simple TypeScript ChessAI package to add intelligence to chess.js based Chess games.

This package is part of one of my online courses available [here](https://mayank-chaudhari.vercel.app/courses/)

You can play the game [here](https://mayank-chaudhari.vercel.app/games/chess).

## How to
- install

```
npm i chess-ai
```

```
pnpm add chess-ai
```

or

```
yarn add chess-ai
```

- import

```
import { calculateBestMove, initGame } from "chess-ai";
```

- use

```js
/**
 * (optional)
 * @param chess ChessInstance created using new Chess() /chess.js/
 * @param difficulty number usually between 0 and 2 inclusive, higher difficulty will increase computaion time
 */
initGame(chess, difficulty)
```

```js
// if initGame() was called before
const bestMove = calculateBestMove();

// if initGame not called before, you must pass the chess and difficulty params when you call this fucniton for the first time.
const chess = new Chess();
...
...
const bestMove = calculateBestMove(chess, 1); // difficulty = 1

if(bestMove) chess.move(bestMove);
```
