import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { DIVISIONS_LIST } from '../util/constants';

const emptyMap = new Immutable.Map();
/**
 * A map of propTypes based on the DIVISIONS_LIST constant
 * {
 *    1: PropTypes.number.isRequired,
 *    2: PropTypes.number.isRequired,
 *    ...
 *    128: PropTypes.number.isRequired,
 * }
 */
const divisionShape = DIVISIONS_LIST.reduce((map, d) => (map.set(d, PropTypes.number.isRequired)), emptyMap).toJS();

/* BASIC TABLE COMPONENT */
const tablePropTypes = {
  heading: PropTypes.string.isRequired,
  data: PropTypes.shape(divisionShape).isRequired,
}
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
Table.propTypes = tablePropTypes;

/** DISPLAY TABLE COMPONENT */
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
    textField.contentEditable = true;
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

export default TimeTable;
