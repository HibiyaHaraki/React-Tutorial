import React from 'react';
import Square from './square';

export default class Board extends React.Component {
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