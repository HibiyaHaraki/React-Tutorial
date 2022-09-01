import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
					{return <td key={(3*i+j).toString()}>{this.renderSquare(3*i+j)}</td>}
				);
			return <tr key={i.toString()} className="board-row">{one_row}</tr>
		});

		return (
			<table className="align-middle w-100"><tbody>{board}</tbody></table>
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
			checked: false,
			progress: 0,
			show: false,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const col = i % 3;
		const row = Math.floor(i / 3);
		const progress = (history.length + 1) / 9 * 100;
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
			progress: progress,
		});
	}

	jumpTo(step) {
		let highlightColor = this.highlightWinner(this.state.history[step].squares);
		this.setState({
			highlightColor: highlightColor,
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			progress: step / 9 * 100,
		})
	}

	changeOrder(e) {
		this.setState({
			order: !this.state.order,
			checked: e.currentTarget.checked,
			show: !this.state.show,
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
				//<li key={show_order}>
					<Button
						className='mb-2'
						key={show_order}
						variant={(show_order === this.state.stepNumber) ? "secondary" : "outline-secondary"}
						size="sm"
						onClick={() => this.jumpTo(show_order)}
						style={{
							fontWeight: (this.state.stepNumber === show_order) ? 'bold' : 'normal', 
						}}
					>
						{desc}
					</Button>
				//</li>
			);
		});

		const renderTooltip = (props) => {
			return(
				<Tooltip id="button-tooltip" {...props}>
					Descending
				</Tooltip>
			);
		}

		let status;
		if (winner == null) {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		} else if (winner === 'Draw') {
			status = 'Draw';
		} else {
			status = 'Winner: ' + winner;
		}

		return (
			<>
			<Navbar collapseOnSelect expand="md" bg="dark" variant="dark" className="text-white">
        <Container>
          <Navbar.Brand href="#home">React Tutorial Product</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link target="_blank" href="https://reactjs.org/tutorial/tutorial.html">React Tutorial</Nav.Link>
							<Nav.Link target="_blank" href="https://react-bootstrap.github.io/">React Bootstrap</Nav.Link>
						</Nav>
					</Navbar.Collapse>
        </Container>
      </Navbar>
			<Container fluid="sm" className="m-5">
				<Row>
					<Col md={8}>
						<div className="game">
							<div className="game-board">
								<Board 
									className="m-auto"
									squares={current.squares}
									onClick={(i) => this.handleClick(i)}
									highlightColor={this.state.highlightColor}
								/>
								<ProgressBar
									animated
									now={(winner == null) ? this.state.progress : 100}
									variant={(winner == null) ? "" : "danger"}
									className="mt-2"
								/>
								<Alert
									variant={(winner === null) ? "success" : "danger"}
									className='mb-2 mt-2 p-1 text-center'
								>
									{status}
								</Alert>
							</div>
						</div>
					</Col>
					<Col md={4} className="m-auto">
						<div className="game-info text-center">
						<OverlayTrigger 
							placement="top"
							trigger="click"
							overlay={renderTooltip}
						>
							<ToggleButton
								className="m-auto mb-2"
								size="sm"
								id="toggle-check"
								variant="outline-primary"
								type='checkbox'
								value="1"
								checked={this.state.checked}
								onChange={(e) => {this.changeOrder(e)}}
							>
								Change Order
							</ToggleButton>
						</OverlayTrigger>
							<Stack
								gap={9} 
								className='mb-2'>
								<ButtonGroup
									vertical
									size="sm"
									className='align-middle'
								>
									{moves}
								</ButtonGroup>
							</Stack>
						</div>
					</Col>
				</Row>
			</Container>
			</>
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
