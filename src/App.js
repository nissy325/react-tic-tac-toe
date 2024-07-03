import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>{ value }</button>
  )
}

function Board({ xIsNext, squares, onPlay} ) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = "Winner: " + winner;
  } else if (squares.every((element) => element !== null)) {
    status = "Drew!"
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  const board = squares.map((square, i) => {
    return (
      <Square key={i} value={square} onSquareClick={ () => handleClick(i)} />
    )
  })

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {board.slice(0, 3)}
      </div>
      <div className="board-row">
        {board.slice(3, 6)}
      </div>
      <div className="board-row">
        {board.slice(6, 9)}
      </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [displayIsAsc, setDisplayIsAsc] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleAsc() {
    const new_asc = !displayIsAsc;
    setDisplayIsAsc(new_asc);
  }

  const displayMoves = () => {
    if (displayIsAsc) {
      return history;
    } else {
      return history.toReversed();
    }
  }

  const moves = displayMoves().map((squares, move) => {
    const moveIndex = displayIsAsc ? move : history.length - 1 - move;
    let description;
    if (moveIndex > 0) {
      if (moveIndex === currentMove) {
        description = 'You are at move #' + moveIndex;

      } else {
        description = 'Go to move #' + moveIndex;
      }
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(moveIndex)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="game-info">
        <button onClick={() => toggleAsc()}>並び替え</button>
      </div>
    </div>
  )
}
