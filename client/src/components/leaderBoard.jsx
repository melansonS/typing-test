import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { BiAward } from 'react-icons/bi';
import ClipLoader from 'react-spinners/ClipLoader';
import './leaderBoard.css';

const LeaderBoard = (props) => {
  const { isLoading, mostRecent, topThree } = props;

  return (
    <div className="leaderboard">
      <h4>Leaderboard:</h4>
      <BiAward />
      {isLoading
        ? (
          <div className="loading-container">
            <ClipLoader color="#bbb" />
          </div>
        )
        : (
          <ol>
            {topThree.map((leader) => (
              <li key={`li-${nanoid()}`}>
                {leader.name || 'AAA'}
                {' '}
                -
                {' '}
                {leader.wpm}
              </li>
            ))}
          </ol>
        )}
      <span className="most-recent">
        Most Recent:
        {mostRecent}
      </span>
    </div>
  );
};

LeaderBoard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  mostRecent: PropTypes.number.isRequired,
  topThree: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    wpm: PropTypes.number,
  })).isRequired,
};

export default LeaderBoard;
