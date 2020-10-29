import React from 'react';
import PropTypes from 'prop-types';
import './inputBox.css';

const InputBox = (props) => {
  const { handleInput, inputRef, inputValue } = props;
  return (
    <div className="input-box">
      <input
        id="input"
        type="text"
        value={inputValue}
        onChange={handleInput}
        placeholder="Start Typing here..."
        ref={inputRef}
      />
      <input id="focus-redirect" tabIndex="-1" />
    </div>
  );
};

InputBox.propTypes = {
  handleInput: PropTypes.func,
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  inputValue: PropTypes.string,
};

export default InputBox;
