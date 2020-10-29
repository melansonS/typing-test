import React from 'react';
import { nanoid } from 'nanoid';
import { BiAward } from 'react-icons/bi';
import './leaderBoard.css';

const mockData = [
  { name: 'tom', score: 70 },
  { name: 'johm', score: 72 },
  { name: 'sam', score: 66 },
];

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
