import React from 'react';
import Immutable from 'immutable';

import TempoForm from './TempoForm';
import TimeTable from './Table';

import {
    MINUTE_MILLISECONDS,
    FORMAT_PLACES,
    DIVISIONS_LIST,
    COLUMNS,
} from '../util/constants';

const emptyMap = new Immutable.Map();

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

export default Calculator;
