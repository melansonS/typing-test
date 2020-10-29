import React from 'react';
import PropTypes from 'prop-types';
import './statsFields.css';

const StatsFields = (props) => {
  const roundedCPM = (c, s) => Math.floor((c / (60 - s)) * 60);
  const roundedWPM = (c, s) => Math.floor(((c / (60 - s)) * 60) / 5);

  const { characters, seconds } = props;

  return (
    <div className="stat-field-container">
      <div className="stat-field">
        Time:
        <span className="stat-number">{seconds}</span>
      </div>
      <div className="stat-field">
        Words:
        <span className="stat-number">
          {roundedWPM(characters, seconds) === Infinity ? 0
            : roundedWPM(characters, seconds) || 0}
        </span>
      </div>
      <div className="stat-field">
        Characters:
        <span className="stat-number">
          {roundedCPM(characters, seconds) === Infinity ? 0
            : roundedCPM(characters, seconds) || 0}
        </span>
      </div>
    </div>
  );
};

StatsFields.propTypes = {
  characters: PropTypes.number,
  seconds: PropTypes.number,
};

StatsFields.defaultProps = {
  characters: 0,
  seconds: 0,
};

export default StatsFields;
