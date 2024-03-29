import React from 'react';
import PropTypes from 'prop-types';
import './results.css';
import { nanoid } from 'nanoid';
import ResultsDifference from './resultsDifference';

const Results = (props) => {
  const {
    accuracy, incorrectWords, previousResults, results,
  } = props;
  const storedName = localStorage.getItem('name');

  return (
    <div className="results-container">
      {!storedName && storedName !== '' && (
        <span className="name-reminder results-text">* Don&apos;t forget to set your name!</span>
      )}
      <h2 className="results-header">Results!</h2>
      <div className="results-text">
        Words per minute:
        {' '}
        {Math.round(results / 5)}
        {typeof previousResults === 'number' && (<ResultsDifference diff={Math.round(results / 5) - Math.round(previousResults / 5)} />)}
      </div>
      <div className="results-text">
        Characters per minute:
        {' '}
        {results}
      </div>
      <div className="results-text">
        Accuracy:
        {' '}
        {accuracy || '0'}
        %
      </div>
      {incorrectWords[0] && (
        <div>
          <h4 className="error-header">
            Errors: (
            {incorrectWords.length}
            )
          </h4>
          <ul className="errors-list">
            {incorrectWords.map((word) => (
              <li key={`li-${nanoid()}`}>
                {word.correct}
                :
                {' '}
                <span className="incorrect-word">{word.typed}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Results.propTypes = {
  accuracy: PropTypes.number.isRequired,
  incorrectWords: PropTypes.arrayOf(PropTypes.shape({
    correct: PropTypes.string,
    typed: PropTypes.string,
  })).isRequired,
  previousResults: PropTypes.number.isRequired,
  results: PropTypes.number.isRequired,
};

export default Results;
