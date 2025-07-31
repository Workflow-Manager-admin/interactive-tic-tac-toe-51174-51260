import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette from spec
const COLORS = {
  primary: '#1976d2',
  secondary: '#90caf9',
  accent: '#ffb300',
  bg: '#fff',
  boardBorder: '#e9ecef',
  cellHover: '#f8f9fa',
  x: '#1976d2',
  o: '#ffb300',
  text: '#282c34',
  win: '#90caf9'
};

// Helper: check board and return winner or null, or 'draw'
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  if (squares.every(Boolean)) return {winner: null, line: []};
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // board state: array of 9 ('X', 'O', or null)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true: X's turn; false: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // For highlight of win line
  const [winLine, setWinLine] = useState([]);
  // Status message
  const [status, setStatus] = useState('');
  // Responsive: Set minHeight for full-center
  useEffect(() => {
    document.documentElement.style.setProperty('--ttt-primary', COLORS.primary);
    document.documentElement.style.setProperty('--ttt-secondary', COLORS.secondary);
    document.documentElement.style.setProperty('--ttt-accent', COLORS.accent);
    document.documentElement.style.setProperty('--ttt-bg', COLORS.bg);
    document.documentElement.style.setProperty('--ttt-board-border', COLORS.boardBorder);
    document.documentElement.style.setProperty('--ttt-x', COLORS.x);
    document.documentElement.style.setProperty('--ttt-o', COLORS.o);
    document.documentElement.style.setProperty('--ttt-text', COLORS.text);
    document.documentElement.style.setProperty('--ttt-win', COLORS.win);
  }, []);

  // Handle moves
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // Compute status: win/draw/turn
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result && result.winner) {
      setStatus(`Player ${result.winner} wins!`);
      setWinLine(result.line);
    } else if (result && result.winner === null) {
      setStatus("It's a draw!");
      setWinLine([]);
    } else {
      setStatus(`Turn: Player ${xIsNext ? 'X' : 'O'}`);
      setWinLine([]);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus('Turn: Player X');
    setWinLine([]);
  }

  // PUBLIC_INTERFACE
  function renderSquare(i) {
    const isWinning = winLine.includes(i);
    return (
      <button
        className={`ttt-square${isWinning ? ' ttt-square-win' : ''}`}
        key={i}
        aria-label={squares[i] ? `Cell ${i+1}, ${squares[i]}` : `Cell ${i+1}, empty`}
        onClick={() => handleClick(i)}
        disabled={!!calculateWinner(squares) || !!squares[i]}
        tabIndex={0}
        style={{
          color: squares[i] === 'X' ? COLORS.x : squares[i] === 'O' ? COLORS.o : COLORS.text,
          borderColor: isWinning ? COLORS.win : COLORS.boardBorder,
          background: isWinning ? COLORS.secondary + '22' : undefined
        }}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-outer-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-player-indicator">
          <span className={`ttt-indicator${xIsNext && !calculateWinner(squares) ? ' ttt-active' : ''}`}>X</span>
          <span className="ttt-separator">vs</span>
          <span className={`ttt-indicator${!xIsNext && !calculateWinner(squares) ? ' ttt-active' : ''}`}>O</span>
        </div>
        <div className="ttt-board" aria-label="Tic Tac Toe Board">
          {Array(3).fill(0).map((_, row) => (
            <div className="ttt-board-row" key={row}>
              {Array(3).fill(0).map((_, col) =>
                renderSquare(row*3 + col)
              )}
            </div>
          ))}
        </div>
        <div className="ttt-status" aria-live="polite">{status}</div>
        <button className="ttt-reset-btn" onClick={resetGame} aria-label="Reset game">
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer">2-player local. Minimal, responsive. <span style={{color: COLORS.secondary}}>by Kavia</span></footer>
    </div>
  );
}

export default App;
