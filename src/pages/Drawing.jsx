import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/Drawing.css'; 

const Drawing = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [canvasColor, setCanvasColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [currentShape, setCurrentShape] = useState('freehand');
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.86;
    const context = canvas.getContext('2d');
    context.fillStyle = canvasColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    setCtx(context);
    saveState(context);
  }, []);

  const saveState = (context) => {
    const snapshot = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory((prev) => [...prev, snapshot]);
    setRedoStack([]);
  };

  const restoreState = (context) => {
    if (history.length > 0) {
      context.putImageData(history[history.length - 1], 0, 0);
    }
  };

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!drawing || !ctx) return;

    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#ffffff' : currentColor;

    if (currentShape === 'freehand') {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else if (currentShape === 'line') {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      restoreState(ctx);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
    // Implement shapes like rectangle and circle similarly
  };

  const stopDrawing = () => {
    if (drawing && ctx) {
      saveState(ctx);
    }
    setDrawing(false);
    if (ctx) ctx.beginPath();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setRedoStack((prev) => [...prev, lastState]);
      setHistory([...history]);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      restoreState(ctx);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setHistory((prev) => [...prev, nextState]);
      setRedoStack([...redoStack]);
      restoreState(ctx);
    }
  };

  const clearCanvas = () => {
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState(ctx);
  };

  const downloadCanvas = () => {
    const link = document.createElement('a');
    link.to = canvasRef.current.toDataURL('image/png');
    link.download = 'drawing.png';
    link.click();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <header>
        <div className="header-container">
          <h1 className="app-name">EditFlow</h1>
          <div className="header-buttons">
            <button>Drawing App</button>
            <button>
              <Link to="imageEditor" style={{ textDecoration: 'none' }}>Image Editor</Link>
            </button>
            <button>
              <Link to="task" style={{ textDecoration: 'none' }}>Task Manager</Link>
            </button>
            <button>
              <Link to="text" style={{ textDecoration: 'none' }}>Text Editor</Link>
            </button>
            <button onClick={toggleDarkMode}>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="controls">
          <label>Brush Color:</label>
          <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />

          <label>Canvas Color:</label>
          <input type="color" value={canvasColor} onChange={(e) => setCanvasColor(e.target.value)} />

          <label>Brush Size:</label>
          <input type="number" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />

          <label>Shape:</label>
          <select value={currentShape} onChange={(e) => setCurrentShape(e.target.value)}>
            <option value="freehand">Freehand</option>
            <option value="line">Line</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>

          <button onClick={() => setIsErasing((prev) => !prev)}>
            {isErasing ? 'Brush' : 'Eraser'}
          </button>
          <button onClick={clearCanvas}>Clear Canvas</button>
          <button onClick={downloadCanvas}>Download</button>
          <button onClick={handleUndo}>Undo</button>
          <button onClick={handleRedo}>Redo</button>
        </div>
        <canvas
          className="drawing-canvas"
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
      </main>
    </div>
  );
};

export default Drawing;
