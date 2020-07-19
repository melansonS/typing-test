import React, {useEffect, useState, useRef} from 'react'
import randomWords from 'random-words'
import './typingArea.css'


function TypingArea  () {
    const [correctWordCount, setCorrectWordCount] = useState(0);
    const [correctCharacterCount, setCorrectCharacterCount] = useState(0);
    const [currentWord, setCurrentWord] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [incorrectWords, setIncorrectWords] = useState([]);
    const [isActive, setIsActive] = useState(null);
    const [seconds, setSeconds] = useState(4);
    const [testText, setTestText] = useState([])
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [wordsTyped, setWordsTyped] = useState([]);

    const inputRef = useRef();

    const getText = async () =>{
        const words = randomWords(150);
        const firstWord = words[0];
        setTestText(words);
        setCurrentWord(firstWord);
        // try {
        //     const response = await fetch('http://localhost:2000/get-text');
        //     const data = await response.json();
        //     setTestText(data.text.split(" "));
        //     setCurrentWord(data.text.split(" ")[0]);
        // } catch (error) {
        //     console.log(error);
        //     const errorMessage = "Error - failed to load text";
        //     setTestText(errorMessage.split(" "));
        //     setCurrentWord(errorMessage.split(" ")[0]);
        // }
    }

    useEffect(()=>{
        getText();        
    },[]);

    useEffect(() => {
        let interval = null;
        if(seconds <= 0 ){
            setShowResultsModal(true);
            setIsActive(false);
            
            //Removes the focus from input element to prevent the next test to start right after a test ends....
            document.getElementById('input').blur();
            //Temp - Unsure as to when the next text will be generated
            // getText();
        }
        if (isActive) {
          interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
          }, 1000);
        } else if (!isActive) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [isActive, seconds]);

    const handleInput = (e) => {
        if(currentWordIndex >= testText.length){return}
        if(!isActive){
            setIsActive(true)
        }
        if(e.target.value[e.target.value.length - 1] === currentWord[e.target.value.length - 1]){
            setCorrectCharacterCount(correctCharacterCount + 1);       
        }
       return e.target.value !== " " ? setInputValue(e.target.value) : null;
    }

    const handleKeyDown = (event) =>{
        if(!isActive) return
        if(event.code === "Space" && inputRef.current.value !== ""){
            if(inputRef.current.value === testText[currentWordIndex]){
                setCorrectWordCount(correctWordCount + 1);
            }
            else {
                const newIncorrectWords = incorrectWords;
                newIncorrectWords.push({
                    typed: inputRef.current.value,
                    correct: testText[currentWordIndex]
                })
                console.log(incorrectWords)
                setIncorrectWords(newIncorrectWords);
            }
            const newArr = wordsTyped;
            newArr.push(inputRef.current.value);
            setWordsTyped(newArr);
            setInputValue("");
            setCurrentWordIndex(currentWordIndex + 1);
            setCurrentWord(testText[currentWordIndex + 1]);
        }
        
        if(event.code ==="Backspace"  && inputRef.current.value === "" && currentWordIndex > 0){
            const newArr = wordsTyped;
            setCurrentWordIndex(currentWordIndex -1);
            setInputValue(wordsTyped[currentWordIndex -1] + " ");
            setCurrentWord(testText[currentWordIndex - 1]);
            wordsTyped.pop();
            setWordsTyped(newArr);
        }
    }

    const closeModal = () => {
        setShowResultsModal(false);
        reset();
        getText();
    };

    const reset = () => {
        setCorrectWordCount(0)
        setCurrentWordIndex(0);
        setCurrentWord("");
        setInputValue("");
        setIsActive(false);
        setSeconds(60);
        setWordsTyped([]);
    };

    useEffect(()=>{
        document.addEventListener("keydown", handleKeyDown)
        return ()=>{
            document.removeEventListener("keydown", handleKeyDown)
        }
    });

    return (
        <>
            <div>
                <div>
                    <div>Time: {seconds}</div>
                    <div>
                        Words: {
                        Math.floor(((correctCharacterCount/ (60 - seconds)) * 60) / 5) === Infinity ? 0 :
                        Math.floor(((correctCharacterCount/ (60 - seconds)) * 60) / 5) || 0}
                    </div>
                    <div>Characters: {
                        Math.floor(((correctCharacterCount/ (60 - seconds)) * 60)) === Infinity ? 0 :
                        Math.floor(((correctCharacterCount/ (60 - seconds)) * 60)) || 0}
                        </div>
                    {/* <div>Incorrect Words: {incorrectWords[0] && incorrectWords[incorrectWords.length - 1].typed}</div> */}
                </div>
                {testText.map((word, i) =>{
                    let className = "word-span"
                    if(i <= currentWordIndex && wordsTyped[i] === testText[i]){
                        className += " correct-word"
                    }
                    if(i < currentWordIndex && wordsTyped[i] !== testText[i]){
                        className += " incorrect-word"
                    }
                    if(i === currentWordIndex){
                        return (
                            <span >
                                {currentWord && currentWord.split("").map((char, i)=>{
                                    let className = "current-word"
                                    if(char === inputValue.split("")[i]){
                                        className += " correct-character"
                                    }
                                    else if(i < inputValue.split("").length){
                                        className += " incorrect-character"
                                    }
                                    return(<span className={className}>{char}</span>)
                                })}{" "}
                            </span>
                        )
                    }
                    
                    return (<span className={className} key={`span-${i}`}>{word} </span>)
                })}
            </div>
            <div>
                <input
                    id="input"
                    type="text" 
                    value={inputValue} 
                    onChange={handleInput} 
                    ref={inputRef}
                    >
                </input>
            </div>
            {showResultsModal && (
            <div className="results-modal">
                <div className="results-container">
                    <h1>Results!</h1>
                    <button className="close-modal" onClick={closeModal}>X</button>
                    <div>CPM: {correctCharacterCount}</div>
                    <div>WPM: {Math.round(correctCharacterCount / 5)}</div>
                    {incorrectWords[0] && (<div>
                        Errors: {incorrectWords.map(word=>{
                            return (<p>Typed: {word.typed} instead of: {word.correct}</p>)
                        })}
                    </div>)}
                </div>
            </div>)}
        </>

    )
}

export default TypingArea;