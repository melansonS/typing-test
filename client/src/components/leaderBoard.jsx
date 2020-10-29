import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { BiAward } from 'react-icons/bi';
import './leaderBoard.css';

const LeaderBoard = (props) => {
  const { mostRecent, topThree } = props;

  return (
    <div className="leaderboard">
      <h4>Leaderboard:</h4>
      <BiAward />
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
      <span className="most-recent">
        Most Recent:
        {mostRecent}
      </span>
    </div>
  );
};

LeaderBoard.propTypes = {
  mostRecent: PropTypes.number.isRequired,
  topThree: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    wpm: PropTypes.number,
  })).isRequired,
};

export default LeaderBoard;
