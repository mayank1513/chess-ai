import { ChessInstance, PieceColor, PieceType, Square } from "chess.js";

// state variables
let _chess: ChessInstance;
let _difficulty = 2;
let _color = "w";

export function initGame(chess: ChessInstance, difficulty: number) {
  _difficulty = difficulty;
  _chess = chess;
}

export function calculateBestMove(chess?: ChessInstance, difficulty?: number) {
  if (chess) _chess = chess;
  if (difficulty) _difficulty = difficulty;
  if (typeof _chess == "undefined" || typeof difficulty == "undefined")
    throw new Error("Game not initialized!");
  _color = _chess.turn();
  const possibleNextMoves = _chess.moves();
  let bestMove = -999999;
  let bestMoveFound;

  for (let i = 0; i < possibleNextMoves.length; i++) {
    const possibleNextMove = possibleNextMoves[i];
    _chess.move(possibleNextMove);
    const value = MinIMaxAI(_difficulty, -10000, 10000, false);
    _chess.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = possibleNextMove;
    }
  }
  return bestMoveFound;
}

// minimax with alhpha-beta pruning and search depth d = 3 levels
function MinIMaxAI(
  iteration: number,
  alpha: number,
  beta: number,
  isBestPlayer: boolean
) {
  if (iteration === 0) {
    const board = _chess.board();
    return -evaluateBoard(board);
  }

  const possibleNextMoves = _chess.moves();
  const nPossibleMoves = possibleNextMoves.length;
  let bestMove;
  if (isBestPlayer) {
    bestMove = -999999;
    for (let i = 0; i < nPossibleMoves; i++) {
      _chess.move(possibleNextMoves[i]);
      bestMove = Math.max(
        bestMove,
        MinIMaxAI(iteration - 1, alpha, beta, !isBestPlayer)
      );
      _chess.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
  } else {
    bestMove = 999999;
    for (let i = 0; i < nPossibleMoves; i++) {
      _chess.move(possibleNextMoves[i]);
      bestMove = Math.min(
        bestMove,
        MinIMaxAI(iteration - 1, alpha, beta, !isBestPlayer)
      );
      _chess.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
  }

  return bestMove;
}

// the evaluation function for minimax
function evaluateBoard(
  board: ({
    type: PieceType;
    color: PieceColor;
    square: Square;
  } | null)[][]
) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
}

function reverseArray(array: number[][]) {
  return array.slice().reverse();
}

const P = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const N = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

const B = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

const R = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

const Q = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

const K = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

const MODEL = {
  w: {
    p: {
      w: 10,
      pw: P,
    },
    r: {
      w: 50,
      pw: R,
    },
    n: {
      w: 30,
      pw: N,
    },
    b: {
      w: 30,
      pw: B,
    },
    q: {
      w: 90,
      pw: Q,
    },
    k: {
      w: 900,
      pw: K,
    },
  },
  b: {
    p: {
      w: 10,
      pw: reverseArray(P),
    },
    r: {
      w: 50,
      pw: reverseArray(R),
    },
    n: {
      w: 30,
      pw: N,
    },
    b: {
      w: 30,
      pw: reverseArray(B),
    },
    q: {
      w: 90,
      pw: Q,
    },
    k: {
      w: 900,
      pw: reverseArray(K),
    },
  },
};

function getPieceValue(
  piece: {
    type: PieceType;
    color: PieceColor;
    square: Square;
  } | null,
  x: number,
  y: number
) {
  if (piece === null) {
    return 0;
  }

  const absoluteValue = getAbsoluteValue(piece, x, y);

  if (piece.color !== _color) {
    return absoluteValue;
  } else {
    return -absoluteValue;
  }
}

function getAbsoluteValue(
  piece: {
    type: PieceType;
    color: PieceColor;
    square: Square;
  } | null,
  x: number,
  y: number
) {
  if (!piece) return 0;
  return (
    MODEL[piece.color][piece.type]["pw"][y][x] +
    MODEL[piece.color][piece.type].w
  );
}
