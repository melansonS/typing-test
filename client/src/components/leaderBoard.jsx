import React from 'react';
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
        {topThree.map((leader, index) => (
          <li key={`li-${nanoid()}`}>
            {leader.name || 'AAA'}
            {' '}
            -
            {' '}
            {leader.score}
          </li>
        ))}
      </ol>
      <span className="most-recent">
        Most Recent:
        {mostRecent.score}
      </span>
    </div>
  );
};
export default LeaderBoard;