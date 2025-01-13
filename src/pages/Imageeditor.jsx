import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Imageeditor.css"

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [effects, setEffects] = useState({
    brightness: 1,
    saturation: 1,
    contrast: 1,
    sepia: 0,
    greyscale: 0,
    invert: 0,
    blur: 0,
  });
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [image, setImage] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [currentEffect, setCurrentEffect] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const scaleFactor = Math.min(400 / img.height, 400 / img.width, 1);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        setImage(img);
        resetAllEffects(); // Reset effects on new image load
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyEffect = (effect) => {
    setCurrentEffect(effect);
    if (effect === "rotate") {
      setRotationAngle((prev) => (prev + 90) % 360);
    } else if (effect === "flip") {
      setFlipX((prev) => -prev);
    }
    setSliderValue(effects[effect] * 100 || 100);
  };

  const handleSliderChange = (e) => {
    const value = e.target.value / 100;
    setEffects((prev) => ({ ...prev, [currentEffect]: value }));
  };

  const drawImage = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const filter = `
      brightness(${effects.brightness})
      saturate(${effects.saturation})
      contrast(${effects.contrast})
      sepia(${effects.sepia})
      grayscale(${effects.greyscale})
      invert(${effects.invert})
      blur(${effects.blur * 10}px)
    `;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filter;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipX, flipY);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
  };

  const resetAllEffects = () => {
    setEffects({
      brightness: 1,
      saturation: 1,
      contrast: 1,
      sepia: 0,
      greyscale: 0,
      invert: 0,
      blur: 0,
    });
    setRotationAngle(0);
    setFlipX(1);
    setFlipY(1);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    drawImage();
  }, [effects, rotationAngle, flipX, flipY]);

  return (
    <div className="editor">
      <header>
        <div className="header-container">
          <h1 className="app-name">EditFlow</h1>
          <div className="header-buttons">
            <button><Link to="/">Drawing App</Link></button>
            <button><Link to="/imageEditor">Image Editor</Link></button>
            <button><Link to="/task">Task Manager</Link></button>
            <button><Link to="/text">Text Editor</Link></button>
            <button>Switch to Dark Mode</button>
          </div>
        </div>
      </header>
      <main>
        <h1>Image Editor</h1>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <canvas  ref={canvasRef}></canvas>

        <div className="controls">
          <h2>Effects</h2>
          {["brightness", "saturation", "contrast", "sepia", "greyscale", "invert", "blur", "rotate", "flip"].map((effect) => (
            <button key={effect} onClick={() => applyEffect(effect)}>{effect.charAt(0).toUpperCase() + effect.slice(1)}</button>
          ))}
          <button onClick={resetAllEffects}>Reset</button>
        </div>

        {currentEffect !== "rotate" && currentEffect !== "flip" && (
          <div className="sliders">
            <input
              type="range"
              min="0"
              max="200"
              value={sliderValue}
              onChange={(e) => {
                setSliderValue(e.target.value);
                handleSliderChange(e);
              }}
            />
          </div>
        )}

        <button onClick={downloadImage}>Download</button>
      </main>
    </div>
  );
};

export default ImageEditor;
