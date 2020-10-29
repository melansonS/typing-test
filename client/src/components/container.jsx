import React, { useEffect, useState } from 'react';
import { MdTimer } from 'react-icons/md';
import { getMostRecent, getTopThree } from '../api';
import LeaderBoard from './leaderBoard';
import LocalStats from './localStats';
import TypingArea from './typingArea';
import './container.css';

function Container() {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [topThree, setTopThree] = useState([{}, {}, {}]);
  const [mostRecent, setMostRecent] = useState(0);

  const feedLeaderBoard = async (id) => {
    setMostRecent(await getMostRecent(id));
    setTopThree(await getTopThree());
  };

  const updateName = (newName) => {
    setName(newName);
    localStorage.setItem('name', newName);
  };

  useEffect(() => {
    feedLeaderBoard();
  }, []);

  return (
    <div className="container">
      <div className="container-body">
        <div>
          <header>
            <h1>Typing Test</h1>
            <MdTimer />
          </header>
          <TypingArea
            name={name === '' ? 'AAA' : name}
            feedLeaderBoard={feedLeaderBoard}
            setMostRecent={setMostRecent}
            setTopThree={setTopThree}
          />
        </div>
        <div className="container-aside">
          <LeaderBoard mostRecent={mostRecent} topThree={topThree} />
          <LocalStats name={name} setName={updateName} />
        </div>
      </div>
    </div>
  );
}

export default Container;
