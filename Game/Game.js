import React from 'react';
import Board from './board';
import { calculateWinner, highlightWinner } from "./judgeGame";

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

import '../index.css';

export default class Game extends React.Component {
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
		if (calculateWinner(squares) != null || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		let highlightColor = highlightWinner(squares);
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
		let highlightColor = highlightWinner(this.state.history[step].squares);
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
		const squares = current.squares;
		const winner = calculateWinner(squares);

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
						variant={
							(calculateWinner(this.state.history[show_order].squares) === null) ?
							((show_order === this.state.stepNumber) ? "success" : "outline-success") :
							((show_order === this.state.stepNumber) ? "danger" : "outline-danger")
						}
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
			<Container fluid="sm" className="mx-auto my-5">
				<Row>
					<Col md className="m-auto">
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
									variant={(winner == null) ? "success" : "danger"}
									className="mt-2"
									label={` ${this.state.stepNumber} / 9`}
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
					<Col md className="m-auto">
						<div className="game-info">
						<ButtonGroup vertical>
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
								<ButtonGroup
									vertical
									size="sm"
									className='align-middle'
								>
									{moves}
								</ButtonGroup>
							</ButtonGroup>
						</div>
					</Col>
				</Row>
			</Container>
			</>
		);
	}
}