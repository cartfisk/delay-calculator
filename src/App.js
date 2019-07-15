import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import './App.scss';
import record from './img/gold-record.png';

const emptyMap = new Immutable.Map();

// amount of milliseconds in one minute (60,000)
const MINUTE_MILLISECONDS = 60 * 1000;
// amount of decimal places to round formatted values to
const FORMAT_PLACES = 4;
// fractional beat divisions
const DIVISIONS_LIST = [1, 2, 4, 8, 16, 32, 64, 128];
// definition of beat types as columns
const COLUMNS = {
  note: {text: 'BEATS', factor: 1},
  triplet: {text: 'TRIPLETS', factor: 2 / 3 },
  dotted: {text: 'DOTTED', factor: 3 / 2},
}

/* ------ START TEMPO INPUT FORM ------ */
const tempoFormProTypes = {
  tempo: PropTypes.number.isRequired,
  onTempoChange: PropTypes.func.isRequired,
}

function TempoForm({ tempo, onTempoChange }) {
  return (
    <div className="tempo-form">
      <form>
        <label>
          TEMPO:
        </label>
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


const Table = ({ heading, data, formatter, clickHandler }) => {

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan="2" key={heading}>
            {heading}
          </th>
        </tr>
          {Object.entries(data).map(([division, value]) => (
            <tr key={heading + division + "row"}>
              <td key={heading + division}>
                1/{division}:
              </td>
              <td key={value}>
                <span onClick={clickHandler} className="clickable">{formatter(value)}</span> ms
              </td>
            </tr>
      ))}
      </tbody>
    </table>
  )
};

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

  const copyToClipboard = ({ target: { innerHTML } }) => {
    const textField = document.createElement('textarea');
    textField.innerText = innerHTML;
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  };

  return (
    <div className="timeTable">
      {Object.entries(timeTable).map(([id, data]) => (
        <Table
          key={columns[id].text}
          heading={columns[id].text}
          data={data}
          formatter={formatter}
          clickHandler={copyToClipboard}
        />
      ))}
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

  // number of decimal places to round values to
  static formatPlaces = FORMAT_PLACES;
  static columns = COLUMNS;

  handleTempoChange(event) {
    this.setState({ tempo: Number(event.target.value) });
  }

  calculateTable(tempo) {
    // beat types and their corresponding multiplier constants
    const types = Object.entries(Calculator.columns)
      .reduce((map, [id, { factor }]) => (
        map.set(id, factor)), emptyMap
      )


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
    return value.toFixed(Calculator.formatPlaces);
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
          columns={Calculator.columns}
          formatter={this.formatter}
        />
      </div>
    );
  }
}
/* ------ END CALCULATOR ------ */

function Record() {
  return (
    <img className="record" src={record} alt="gold record"></img>
  )
}

function DelayCalculator() {
  return (
    <div className="delay-calc">
      <header className="header">
        <h1>
          <div className="grid">
            <Record />
            <span className="text">DELAY</span>
            <Record />
            <span className="text calc">CALCULATOR</span>
          </div>
        </h1>
      </header>
      <div className="body">
        <Calculator />
      </div>
    </div>
  );
}

export default DelayCalculator;
