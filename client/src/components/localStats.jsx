import React, { useEffect, useState } from 'react';
import { GoGraph } from 'react-icons/go';
import ResultsDifference from './resultsDifference';
import './localStats.css';

const LocalStats = (props) => {
  const { name, setName } = props;

  const [localStats, setLocalStats] = useState(JSON.parse(localStorage.getItem('data')) || null);

  useEffect(() => {
    document.addEventListener('storageEvent', () => {
      setLocalStats(JSON.parse(localStorage.getItem('data')));
    });
    return () => {
      document.removeEventListener('storageEvent', () => {
        setLocalStats(JSON.parse(localStorage.getItem('data')));
      });
    };
  });

  return (
    <div className="local-stats">
      <h4>Your Stats:</h4>
      <GoGraph />
      <div className="stat-details">
        Name:
        {' '}
        <input
          className="name-input"
          maxLength="5"
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="AAA"
          type="text"
          value={name}
        />
      </div>
      {localStats && (
      <>
        <div className="stat-details">
          {' '}
          Best:
          <span className="stat-value">
            {localStats.reduce((a, b) => ((a.score > b.score) ? a : b)).score}
          </span>
        </div>
        {localStats.length > 1 && (
          <div className="stat-details">
            {' '}
            Average:
            <span className="stat-value">
              {Math.round(localStats.reduce((a, b) => ((a.score || a) + b.score)) / localStats.length)}
            </span>
          </div>
        )}

        <ul>
          {localStats.slice(0, 5).map((stat) => (
            <li>
              {stat.name}
              {' '}
              -
              {' '}
              {stat.score}
              {stat.diff && (<ResultsDifference diff={stat.diff} />)}
            </li>
          ))}
        </ul>
      </>
      )}

    </div>
  );
};
export default LocalStats;
