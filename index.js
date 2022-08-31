import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
			style={{
				backgroundColor: props.highlightColor ? 'red' : '',
			}}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return(
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				highlightColor={this.props.highlightColor[i]}
				key={i.toString()}
			/>
		);
	}

	render() {
		const numbers = [0, 1, 2];
		const board = numbers.map(i => {
			const one_row = numbers.map(j => 
					{return this.renderSquare(3*i+j)}
				);
			return <div key={i.toString()} className="board-row">{one_row}</div>
		});

		return (
			<div>{board}</div>
		)
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				col: null,
				row: null,
				mark: 'X',
			}],
			highlightColor: Array(9).fill(false),
			xIsNext: true,
			stepNumber: 0,
			order: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const col = i % 3;
		const row = Math.floor(i / 3);
		if (this.calculateWinner() != null || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		let highlightColor = this.highlightWinner(squares);
		this.setState({
			history: history.concat([{
				squares: squares,
				col: col,
				row: row,
				mark: squares[i],
			}]),
			highlightColor: highlightColor,
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		let highlightColor = this.highlightWinner(this.state.history[step].squares);
		this.setState({
			highlightColor: highlightColor,
			stepNumber: step,
			xIsNext: (step % 2) === 0
		})
	}

	changeOrder() {
		this.setState({
			order: !this.state.order,
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = this.calculateWinner();

		const moves = history.map((step, move) => {
			let show_order;
			this.state.order ? (show_order = move) : (show_order = history.length - 1 - move);
			const desc = show_order ?
				show_order + ': (' + this.state.history[show_order].col + ',' + this.state.history[show_order].row + ') ' + this.state.history[show_order].mark :
				'Go to game start';
			return (
				<li key={show_order}>
					<button 
						onClick={() => this.jumpTo(show_order)}
						style={{
							fontWeight: (this.state.stepNumber === show_order) ? 'bold' : 'normal', 
						}}
					>
						{desc}
					</button>
				</li>
			);
		});

		let status;
		if (winner == null) {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		} else if (winner === 'Draw') {
			status = 'Draw';
		} else {
			status = 'Winner: ' + winner;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
						highlightColor={this.state.highlightColor}
					/>
				</div>
				<div className="game-info">
				<div>{status}</div>
				<ul>{moves}</ul>
				<input type='checkbox' onClick={() => this.changeOrder()} /> Set Order
				</div>
			</div>
		);
	}

	calculateWinner() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares;
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

	highlightWinner(squares) {
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
