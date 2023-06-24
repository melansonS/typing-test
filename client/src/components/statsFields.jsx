import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './statsFields.css';

const StatsFields = (props) => {
  const { characters, seconds } = props;
  const [debouncedCharacters, setDebouncedCharacters] = useState(0);

  const debouce = useCallback(
    _.debounce((chars) => {
      setDebouncedCharacters(chars);
    }, 500),
    [],
  );

  useEffect(() => {
    debouce(characters);
  }, [characters]);

  const roundedCPM = (c, s) => Math.floor((c / (60 - s)) * 60);
  const roundedWPM = (c, s) => Math.floor(((c / (60 - s)) * 60) / 5);

  return (
    <div className="stat-field-container">
      <div className="stat-field">
        Time:
        <span className="stat-number">{seconds}</span>
      </div>
      <div className="stat-field">
        Words:
        <span className="stat-number">
          {roundedWPM(debouncedCharacters, seconds) === Infinity
            ? 0
            : roundedWPM(debouncedCharacters, seconds) || 0}
        </span>
      </div>
      <div className="stat-field">
        Characters:
        <span className="stat-number">
          {roundedCPM(debouncedCharacters, seconds) === Infinity
            ? 0
            : roundedCPM(debouncedCharacters, seconds) || 0}
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
