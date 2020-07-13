import React, {useEffect, useState, useRef} from 'react'
import './typingArea.css'


function TypingArea  () {
    const [testText, setTestText] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [wordsTyped, setWordsTyped] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef();
    const getText = async () =>{
        const response = await fetch('http://localhost:2000/get-text');
        const text = await response.json();
        console.log(text);
        setTestText(text.text.split(" "));
    }
    useEffect(()=>{
        getText();        
    },[])

    

    const handleKeyDown = (event) =>{
        if(event.code === "Space" && inputRef.current.value !== ""){
            const newArr = wordsTyped;
            newArr.push(inputRef.current.value);
            setWordsTyped(newArr);
            setInputValue("");
            setCurrentWordIndex(currentWordIndex + 1);
        }
        
        if(event.code ==="Backspace"  && inputRef.current.value === "" && currentWordIndex > 0){
            const newArr = wordsTyped;
            setCurrentWordIndex(currentWordIndex -1);
            setInputValue(wordsTyped[currentWordIndex -1] + " ");
            wordsTyped.pop();
            setWordsTyped(newArr);
        }
    }

    useEffect(()=>{
        document.addEventListener("keydown", handleKeyDown)
        return ()=>{
            document.removeEventListener("keydown", handleKeyDown)
        }
    },[wordsTyped, currentWordIndex, handleKeyDown])
    return (
        <>
            <div>
                {testText.map((word, i) =>{
                    let className = "word-span"
                    if(i <= currentWordIndex && wordsTyped[i] === testText[i]){
                        className += " correct-word"
                    }
                    if(i < currentWordIndex && wordsTyped[i] !== testText[i]){
                        className += " incorrect-word"
                    }
                    if(i === currentWordIndex){
                        className += " current-word"
                    }
                    
                    return (<span className={className} key={`span-${i}`}>{word} </span>)
                })}
            </div>
            <div>
                <input type="text" value={inputValue} onChange={(e)=>e.target.value !== " " ? setInputValue(e.target.value) : null} ref={inputRef}></input>
            </div>
        </>

    )
}

export default TypingArea;