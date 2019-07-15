import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
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
TempoForm.propTypes = propTypes;

export default TempoForm;
