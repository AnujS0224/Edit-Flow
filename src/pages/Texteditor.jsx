import React, { useState, useRef } from 'react';
import '../styles/Text.css';
import { Link } from 'react-router-dom';
// import './style.css';

const TextEditor = () => {
  const [textContent, setTextContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textInputRef = useRef(null);

  const handleInputChange = (e) => {
    const text = e.target.innerText.trim();
    setTextContent(text);

    // Word and Character Count
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);

    // Save state for undo/redo
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    setHistory([...history, e.target.innerHTML]);
    setHistoryIndex(history.length);
  };

  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleBgColorChange = (e) => {
    setBgColor(e.target.value);
  };

  const applyFormatting = (command) => {
    document.execCommand(command, false, null);
  };

  const handleSearchReplaceToggle = () => {
    setShowSearchReplace(!showSearchReplace);
  };

  const handleFind = () => {
    const searchText = document.getElementById('search-input').value;
    const text = textInputRef.current.innerText;
    const startIndex = text.indexOf(searchText);
    if (startIndex !== -1) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(textInputRef.current.firstChild, startIndex);
      range.setEnd(textInputRef.current.firstChild, startIndex + searchText.length);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      alert('Text not found');
    }
  };

  const handleReplace = () => {
    const text = textInputRef.current.innerHTML;
    const searchText = document.getElementById('search-input').value;
    const replaceText = document.getElementById('replace-input').value;
    textInputRef.current.innerHTML = text.replace(searchText, replaceText);
  };

  const handleReplaceAll = () => {
    const text = textInputRef.current.innerHTML;
    const searchText = document.getElementById('search-input').value;
    const replaceText = document.getElementById('replace-input').value;
    const regex = new RegExp(searchText, 'g');
    textInputRef.current.innerHTML = text.replace(regex, replaceText);
  };

  const handleSave = () => {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.txt';
    a.click();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      textInputRef.current.innerHTML = history[historyIndex - 1];
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      textInputRef.current.innerHTML = history[historyIndex + 1];
    }
  };

  const handleThemeToggle = () => {
    document.body.classList.toggle('dark-mode');
    const themeButton = document.getElementById('themeToggle');
    themeButton.textContent = document.body.classList.contains('dark-mode')
      ? 'Switch to Light Mode'
      : 'Switch to Dark Mode';
  };

  return (
    <div>
      <header>
        <div className="header-container">
          <h1 className="app-name">EditFlow</h1>
          <div className="header-buttons">
            <button id="drawingAppBtn">
              <Link to="/" style={{ textDecoration: 'none' }}>Drawing App</Link>
            </button>
            <button id="imageEditorBtn">
              <Link to="/imageEditor" style={{ textDecoration: 'none' }}>Image Editor</Link>
            </button>
            <button id="imageEditorBtn">
              <Link to="/task" style={{ textDecoration: 'none' }}>Task Manager</Link>
            </button>
            <button id="imageEditorBtn">
              <Link to="/text" style={{ textDecoration: 'none' }}>Text Editor</Link>
            </button>
            <button id="themeToggle" onClick={handleThemeToggle}>Switch to Dark Mode</button>
          </div>
        </div>
      </header>

      <main>
        <div className="header">
          <h1>Text Editor</h1>
        </div>
        <div className="editor-container">
          <div className="toolbar">
            <select id="font-family" value={fontFamily} onChange={handleFontChange}>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
            <select id="font-size" value={fontSize} onChange={handleFontSizeChange}>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="24px">24</option>
            </select>
            <input type="color" id="text-color" value={textColor} onChange={handleTextColorChange} />
            <input type="color" id="bg-color" value={bgColor} onChange={handleBgColorChange} />

            <button id="bold-btn" onClick={() => applyFormatting('bold')}><b>B</b></button>
            <button id="italic-btn" onClick={() => applyFormatting('italic')}><i>I</i></button>
            <button id="underline-btn" onClick={() => applyFormatting('underline')}><u>U</u></button>
            <button id="strikethrough-btn" onClick={() => applyFormatting('strikeThrough')}><s>S</s></button>

            <select id="text-align" onChange={(e) => applyFormatting('justify' + e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>

            <button id="save-btn" onClick={handleSave}>💾 Save</button>
            <input type="file" id="load-file" style={{ display: 'none' }} accept=".txt" />

            <button id="search-replace-btn" onClick={handleSearchReplaceToggle}>🔍 Search/Replace</button>
          </div>

          <div
            id="text-input"
            contentEditable="true"
            ref={textInputRef}
            placeholder="Start typing your text here..."
            onInput={handleInputChange}
          />

          {showSearchReplace && (
            <div className="search-replace" id="search-replace-container">
              <input type="text" id="search-input" placeholder="Search" />
              <input type="text" id="replace-input" placeholder="Replace" />
              <div>
                <label><input type="checkbox" id="case-sensitive" /> Case Sensitive</label>
                <label><input type="checkbox" id="whole-word" /> Whole Word</label>
              </div>
              <div>
                <button id="find-btn" onClick={handleFind}>Find</button>
                <button id="replace-btn" onClick={handleReplace}>Replace</button>
                <button id="replace-all-btn" onClick={handleReplaceAll}>Replace All</button>
              </div>
            </div>
          )}

          <div className="status-bar">
            <span id="word-count">Words: {wordCount}</span>
            <span id="char-count">Characters: {charCount}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextEditor;
