import React from 'react';

import './App.scss';

import Calculator from './components/Calculator';
import Record from './components/Record';

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
