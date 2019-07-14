import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import logo from './logo.svg';
import './App.css';

const emptyMap = new Immutable.Map();

// amount of milliseconds in one minute (60,000)
const MINUTE_MILLISECONDS = 60 * 1000;
// fractional beat divisions
const DIVISIONS_LIST = [1, 2, 4, 8, 16, 32, 64, 128];

/* ------ START TEMPO INPUT FORM ------ */
const tempoFormProTypes = {
  tempo: PropTypes.number.isRequired,
  onTempoChange: PropTypes.func.isRequired,
}

function TempoForm({ tempo, onTempoChange }) {
  return (
    <div className="tempo-form">
      <form>
        <input
          type="number"
          value={tempo}
          onChange={onTempoChange}
          />
      </form>
    </div>
  );
}
TempoForm.propTypes = tempoFormProTypes;
/* ------ END TEMPO INPUT FORM ------ */

const TableRow = ({ row, formatter }) => (
  <tr>
    <td key={row[0]}>{formatter(row[0])}</td>
    <td key={row[1]}>{formatter(row[1])}</td>
    <td key={row[2]}>{formatter(row[2])}</td>
  </tr>
)

const Table = ({ headings, data, formatter }) => (
  <table>
    <tbody>
      <tr>
        {headings.map(heading => (
          <th key={heading}>
            {heading}
          </th>
        ))}
      </tr>
      {data.map(row => (
        <TableRow
          key={row[1]}
          row={row}
          formatter={formatter}
        />
      ))}
    </tbody>
  </table>
)

/* ------ START DISPLAY TABLE COMPONENT ------ */
const divisionShape = DIVISIONS_LIST.reduce((map, d) => (map.set(d, PropTypes.number)), emptyMap).toJS();
const timeTablePropTypes = {
  timeTable: PropTypes.shape({
    dotted: PropTypes.shape(divisionShape).isRequired,
    note: PropTypes.shape(divisionShape).isRequired,
    triplet: PropTypes.shape(divisionShape).isRequired,
  }).isRequired,
};

function TimeTable({ timeTable, columns, formatter }) {
  const tableData = DIVISIONS_LIST.reduce((rows, division, index) => {
    rows[index] = columns.map(c => timeTable[c][division]);
    return rows;
  }, [])
  return (
    <div className="timeTable">
      <Table
        headings={['Notes', 'Dotted', 'Triplets']}
        data={tableData}
        formatter={formatter}
      />
    </div>
  );
}

TimeTable.propTypes = timeTablePropTypes;
/* ------ END DISPLAY TABLE COMPONENT ------ */


/* ------ START CALCULATOR ------ */
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tempo: 120 };

    this.handleTempoChange = this.handleTempoChange.bind(this);
  }

  handleTempoChange(event) {
    this.setState({ tempo: Number(event.target.value) });
  }

  calculateTable(tempo) {
    // beat types and their corresponding multiplier constants
    const types = new Immutable.Map({
      triplet: 2 / 3,
      note: 1,
      dotted: 3 / 2,
    });

    // map of beat types to divisions
    const beats = types.reduce((map, divisor, type) => (map.set(type, DIVISIONS_LIST)), emptyMap);

    const calculate = (tempo, type, divisions) => {
      const beat = MINUTE_MILLISECONDS / tempo;

      const divisor = types.get(type);

      return divisions.reduce((map, d) => (map.set(d, (beat / d) * 4 * divisor)), emptyMap);
    };

    return beats.reduce((map, divisions, type) => (
      map.set(type, calculate(tempo, type, DIVISIONS_LIST))
    ), emptyMap).toJS();
  };

  formatter(value) {
    console.log(value);
    return value.toFixed(4);
  }

  render() {
    const timeTable = this.calculateTable(this.state.tempo);
    return (
      <div className="calculator">
        <TempoForm
          tempo={this.state.tempo}
          onTempoChange={this.handleTempoChange}
        />
        <TimeTable
          timeTable={timeTable}
          columns={['note', 'dotted', 'triplet']}
          formatter={this.formatter}
        />
      </div>
    );
  }
}
/* ------ END CALCULATOR ------ */

function DelayCalculator() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Delay Calculator
        </h1>
        <Calculator />
      </header>
    </div>
  );
}

export default DelayCalculator;
