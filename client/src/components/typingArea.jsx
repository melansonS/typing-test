import React, { useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import randomWords from 'random-words';
import { localStoreResults, updateName, saveResults } from '../api';
import StatsFields from './statsFields';
import Results from './results';
import './typingArea.css';
import InputBox from './inputBox';

const TypingArea = (props) => {
  const { name, setMostRecent, setTopThree } = props;
  const [accuracy, setAccuracy] = useState(0);
  const [correctCharCount, setCorrectCharCount] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [incorrectCharCount, setIncorrectCharCount] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(null);
  const [previousResults, setPreviousResults] = useState(null);
  const [results, setResults] = useState(null);
  const [resultsId, setResultsId] = useState();
  const [seconds, setSeconds] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [testText, setTestText] = useState([]);
  const [wordsTyped, setWordsTyped] = useState([]);
  const inputRef = useRef();

  const getText = async () => {
    const words = randomWords(99);
    const firstWord = words[0];
    setTestText(words);
    setCurrentWord(firstWord);
  };

  useEffect(() => {
    getText();
    if (localStorage.getItem('data') && JSON.parse(localStorage.getItem('data'))[0]) {
      const prev = JSON.parse(localStorage.getItem('data'))[0].cpm;
      setResults(prev);
      setPreviousResults(prev);
    }
  }, []);

  const reset = () => {
    console.log({ correctCharCount, incorrectCharCount });
    setAccuracy(Math.round((correctCharCount / (correctCharCount + incorrectCharCount)) * 100));
    setCorrectCharCount(0);
    setCurrentWord('');
    setCurrentWordIndex(0);
    setIncorrectCharCount(0);
    setInputValue('');
    setIsActive(false);
    setPreviousResults(results);
    // setSeconds(60);
    setSeconds(10);
    setShowResults(true);
    setResults(correctCharCount);
    setWordsTyped([]);
    getText();
    // pull focus off of the input box to avoid starting the nex test unnintentionally
    document.getElementById('focus-redirect').focus();
    // reset test-text element
    const element = document.getElementsByClassName('test-words')[0];
    element.scrollTop = 0;
    // store results locally
    const resultsData = {
      cpm: correctCharCount,
      date: Date.now(),
      id: resultsId,
      name,
      wpm: Math.round(correctCharCount / 5),
    };
    const diff = typeof results === "number" ? (Math.round(correctCharCount / 5) - Math.round(results / 5)) : null;
    localStoreResults(resultsData, diff);
  };

  useEffect(() => {
    let timer = null;
    if (seconds <= 0) {
      reset();
      const id = nanoid();
      setResultsId(id);
      const resultsData = {
        date: Date.now(),
        wpm: Math.round(correctCharCount / 5),
        id,
        name,
      };
      // saveResults(resultsData, setMostRecent, setTopThree);
    }
    if (isActive) {
      timer = setInterval(() => {
        setSeconds((count) => count - 1);
      }, 1000);
    } else if (!isActive) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, seconds]);

  const handleInput = (e) => {
    // add more random words!
    if (currentWordIndex >= testText.length - 25) {
      let newWords = testText;
      newWords = newWords.concat(randomWords(25));
      setTestText(newWords);
    }
    // Start Test!
    if (!isActive) {
      setIsActive(true);
      setIncorrectWords([]);
      setShowResults(false);
    }

    const charIndex = e.target.value.length - 1;
    if (e.target.value[charIndex] === currentWord[charIndex]) {
      setCorrectCharCount(correctCharCount + 1);
    } else if (e.target.value !== ' ') {
      console.log('Error!');
      setIncorrectCharCount(incorrectCharCount + 1);
    }
    return e.target.value !== ' ' ? setInputValue(e.target.value) : null;
  };

  const handleKeyDown = (event) => {
    if (!isActive) return;
    if ((event.code === 'Space' && inputRef.current.value !== '') || inputRef.current.value.includes(' ')) {
      const inputValue = inputRef.current.value.includes(' ')
        ? inputRef.current.value.slice(0, -1)
        : inputRef.current.value;
      if (inputValue !== testText[currentWordIndex]) {
        const newIncorrectWords = incorrectWords;
        newIncorrectWords.push({
          typed: inputValue,
          correct: testText[currentWordIndex],
        });
        setIncorrectWords(newIncorrectWords);
      }
      const newArr = wordsTyped;
      newArr.push(inputValue);
      setWordsTyped(newArr);
      setInputValue('');
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentWord(testText[currentWordIndex + 1]);

      const element = document.getElementsByClassName('current-word')[0];
      element.scrollIntoView({ block: 'center' });
    }

    if (event.code === 'Backspace' && inputRef.current.value === '' && currentWordIndex > 0) {
      const newArr = wordsTyped;
      setCurrentWordIndex(currentWordIndex - 1);
      setInputValue(`${wordsTyped[currentWordIndex - 1]}`);
      setCurrentWord(testText[currentWordIndex - 1]);
      newArr.pop();
      setWordsTyped(newArr);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="typing-area">
      <div className="test-words-container">
        <StatsFields seconds={seconds} characters={correctCharCount} />
        <div className="test-words">
          {testText.map((word, i) => {
            let className = 'word-span';
            if (i <= currentWordIndex && wordsTyped[i] === testText[i]) {
              className += ' correct-word';
            }
            if (i < currentWordIndex && wordsTyped[i] !== testText[i]) {
              className += ' incorrect-word';
            }
            if (i === currentWordIndex) {
              return (
                <span className="current-word" key={`span-${nanoid()}`}>
                  {currentWord && currentWord.split('').map((char, index) => {
                    let newClassName = 'current-word-char';
                    if (char === inputValue.split('')[index]) {
                      newClassName += ' correct-character';
                    } else if (index < inputValue.split('').length) {
                      newClassName += ' incorrect-character';
                    }
                    return (<span className={newClassName} key={`char-${nanoid()}`}>{char}</span>);
                  })}
                  {' '}
                </span>
              );
            }
            return (
              <span className={className} key={`span-${nanoid()}`}>
                {word}
                {' '}
              </span>
            );
          })}
        </div>
      </div>
      <InputBox
        handleInput={handleInput}
        inputValue={inputValue}
        inputRef={inputRef}
      />
      {showResults && (
        <Results
          accuracy={accuracy}
          incorrectWords={incorrectWords}
          previousResults={previousResults}
          updateName={updateName}
          results={results}
          resultsId={resultsId}
        />
      )}
    </div>

  );
};

export default TypingArea;
