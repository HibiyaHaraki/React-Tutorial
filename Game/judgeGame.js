export function calculateWinner(squares) {
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

  let draw_judge = 0;
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      draw_judge = draw_judge + 1;
    }
  }

  if (draw_judge === 0) {
    return 'Draw'
  } else {
    return null;
  }
}

export function highlightWinner(squares) {
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

  let highlightColor = Array(9).fill(false);

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      highlightColor[a] = true;
      highlightColor[b] = true;
      highlightColor[c] = true;
    }
  }
  return highlightColor;
}