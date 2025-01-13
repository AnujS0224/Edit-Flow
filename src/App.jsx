import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Drawing from './pages/Drawing';
import ImageEditor from './pages/Imageeditor';
import TaskManager from './pages/TaskManager';
import TextEditor from './pages/Texteditor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Drawing />} />
        <Route path="/imageEditor" element={<ImageEditor />} />
        <Route path="/task" element={<TaskManager />} />
        <Route path="/text" element={<TextEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
