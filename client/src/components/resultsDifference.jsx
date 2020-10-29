import React from 'react';
import PropTypes from 'prop-types';
import { CgArrowDown, CgArrowUp } from 'react-icons/cg';
import './resultsDifference.css';

const ResultsDifference = (props) => {
  const { diff } = props;

  return (diff >= 0 ? (
    <span className="results-difference positive">
      <CgArrowUp />
      {diff}
    </span>
  )
    : (
      <span className="results-difference negative">
        <CgArrowDown />
        {Math.abs(diff)}
      </span>
    ));
};

ResultsDifference.propTypes = {
  diff: PropTypes.number.isRequired,
};

export default ResultsDifference;
