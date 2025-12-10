import React from "react";
import { X_ICON, CHECK_ICON, PEN_ICON, ERASER_ICON } from "./icons";

const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

/**
 * DrawingCanvas - A reusable, standalone drawing canvas component
 * 
 * Features:
 * - Pen and eraser tools
 * - Customizable stroke color and width
 * - Background image support
 * - Touch and mouse support
 * - Responsive sizing
 * - Finalize and clear controls
 * - TypeScript-ready JSDoc
 * 
 * Implementation note:
 * Uses a two-layer canvas system: a drawing layer for user strokes and a display layer that
 * composites the background image and drawings. This ensures the eraser only affects user
 * drawings, not background images.
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onDrawingChange - Callback when drawing changes (receives { strokes: string, image: string })
 * @param {string} [props.existingDrawing] - Existing drawing data (legacy: base64, or JSON strokes)
 * @param {string} [props.backgroundImage] - Optional background image as base64 or URL
 * @param {string} [props.placeholder] - Placeholder text when canvas is empty
 * @param {Object} [props.config] - Canvas configuration
 * @param {number} [props.config.width=600] - Canvas width
 * @param {number} [props.config.height=400] - Canvas height
 * @param {string} [props.config.strokeColor="#000000"] - Drawing stroke color
 * @param {number} [props.config.strokeWidth=2] - Drawing stroke width
 * @param {string} [props.config.eraserColor="#FFFFFF"] - Eraser color (for composite mode)
 * @param {number} [props.config.eraserWidth=20] - Eraser width
 * @param {boolean} [props.config.hasEraser=true] - Show eraser tool
 * @param {boolean} [props.config.showControls=true] - Show finalize/clear buttons
 * @param {string} [props.config.backgroundColor="#FFFFFF"] - Canvas background color
 * @param {string} [props.mode] - "draw" (default), "signature", or "diagram" (legacy, all use same approach now)
 * 
 * @returns {React.ReactElement} Drawing canvas component
 */
export default function DrawingCanvas({
  onDrawingChange,
  existingDrawing,
  backgroundImage,
  placeholder = "Draw here",
  config = {},
  mode = "draw",
}) {
  // Default configuration
  const {
    width = 600,
    height = 400,
    strokeColor = "#000000",
    strokeWidth = 2,
    eraserWidth = 20,
    hasEraser = true,
    showControls = true,
    backgroundColor = "#FFFFFF",
  } = config;

  const canvasRef = React.useRef(null);
  const drawingCanvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);
  const lastCoordRef = React.useRef({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = React.useState({ width, height });
  const [hasDrawing, setHasDrawing] = React.useState(!!existingDrawing);
  const [tempDrawing, setTempDrawing] = React.useState(null);
  const [backgroundLoaded, setBackgroundLoaded] = React.useState(false);
  const backgroundImageRef = React.useRef(null);
  const [currentTool, setCurrentTool] = React.useState("pen");
  const [currentColor, setCurrentColor] = React.useState("#000000");
  const [currentSize, setCurrentSize] = React.useState(2);
  const [customColor, setCustomColor] = React.useState(null);
  const [customSize, setCustomSize] = React.useState(null);
  const [showSizePicker, setShowSizePicker] = React.useState(false);
  const [tempSize, setTempSize] = React.useState(10);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const sizePickerRef = React.useRef(null);
  const strokesRef = React.useRef([]);
  const undoStackRef = React.useRef([]);
  const [cursorPosition, setCursorPosition] = React.useState(null);
  
  // Predefined color palette
  const colorPalette = ["#000000", "#FF0000", "#0000FF"];
  const sizePalette = [1, 2, 3];

  // Custom cursors using SVG from icon components
  const penCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20h4L18.5 9.5a2.828 2.828 0 1 0 -4 -4L4 16v4'/%3E%3Cpath d='m13.5 6.5 4 4'/%3E%3C/svg%3E") 2 22, crosshair`;
  const eraserCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 20H8.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41L11.5 20'/%3E%3Cpath d='M18 13.3 11.7 7'/%3E%3C/svg%3E") 2 22, cell`;

  // Helper: setup canvas dimensions and context
  const setupCanvas = (canvas, scale = true) => {
    const actualWidth = displaySize.width * DPR;
    const actualHeight = displaySize.height * DPR;
    canvas.width = actualWidth;
    canvas.height = actualHeight;
    const ctx = canvas.getContext("2d");
    if (scale) ctx.scale(DPR, DPR);
    return ctx;
  };

  const drawPlaceholder = (ctx) => {
    // Scale font size based on canvas dimensions (responsive)
    const fontSize = Math.max(12, Math.min(20, displaySize.width / 30));
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#ccc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(placeholder, displaySize.width / 2, displaySize.height / 2);
  };

  const drawBackgroundImage = React.useCallback((ctx, img) => {
    if (!img) return;
    
    const padding = 6; // Padding around the image
    const availableW = displaySize.width - (padding * 2);
    const availableH = displaySize.height - (padding * 2);
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const imgRatio = imgW / imgH;
    const availableRatio = availableW / availableH;
    
    let drawW, drawH;
    if (imgRatio > availableRatio) {
      // Image is wider, fit to available width
      drawW = availableW;
      drawH = availableW / imgRatio;
    } else {
      // Image is taller, fit to available height
      drawH = availableH;
      drawW = availableH * imgRatio;
    }
    
    // Center the image with padding
    const x = padding + (availableW - drawW) / 2;
    const y = padding + (availableH - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  }, [displaySize.width, displaySize.height]);

  // Helper: composite display from background + drawing layer
  const compositeDisplay = React.useCallback(() => {
    const displayCanvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!displayCanvas || !drawingCanvas) return;

    const ctx = displayCanvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, displaySize.width, displaySize.height);

    if (backgroundImageRef.current && backgroundLoaded) {
      drawBackgroundImage(ctx, backgroundImageRef.current);
    }
    
    if (!hasDrawing && !existingDrawing) {
      drawPlaceholder(ctx);
    }

    // Draw the drawing canvas to display canvas at the correct size
    ctx.drawImage(drawingCanvas, 0, 0, displaySize.width * DPR, displaySize.height * DPR, 0, 0, displaySize.width, displaySize.height);
  }, [displaySize.width, displaySize.height, backgroundColor, backgroundLoaded, hasDrawing, existingDrawing, placeholder]);

  // Load background image
  React.useEffect(() => {
    if (!backgroundImage) {
      setBackgroundLoaded(false);
      backgroundImageRef.current = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      backgroundImageRef.current = img;
      setBackgroundLoaded(true);
    };
    img.onerror = () => {
      backgroundImageRef.current = null;
      setBackgroundLoaded(false);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Close size picker when clicking outside and apply the selected size
  React.useEffect(() => {
    if (!showSizePicker) return;
    
    const handleClickOutside = (e) => {
      if (sizePickerRef.current && !sizePickerRef.current.contains(e.target)) {
        setCustomSize(tempSize);
        setCurrentSize(tempSize);
        setShowSizePicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSizePicker, tempSize]);

  // Get coordinates from mouse or touch event
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    return {
      x: (clientX - rect.left) / rect.width * displaySize.width,
      y: (clientY - rect.top) / rect.height * displaySize.height,
    };
  };

  const drawLine = (fromX, fromY, toX, toY, tool = "pen") => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;

    const ctx = drawingCanvas.getContext("2d");

    if (tool === "eraser") {
      const half = eraserWidth / 2;
      ctx.clearRect(fromX - half, fromY - half, eraserWidth, eraserWidth);
      ctx.clearRect(toX - half, toY - half, eraserWidth, eraserWidth);
    } else {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    }

    compositeDisplay();
  };

  const handleDrawStart = React.useCallback((e) => {
    const coords = getCoords(e);
    if (!coords) return;
    isDrawingRef.current = true;
    lastCoordRef.current = coords;
    setHasDrawing(true);
    
    // Start new stroke with normalized coordinates (0-1)
    strokesRef.current.push({
      tool: currentTool,
      color: currentColor,
      size: currentSize,
      points: [{
        x: coords.x / displaySize.width,
        y: coords.y / displaySize.height
      }]
    });
  }, [displaySize.width, displaySize.height, getCoords, currentTool, currentColor, currentSize]);

  const handleDrawMove = React.useCallback((e) => {
    const coords = getCoords(e);
    if (!coords) return;
    setCursorPosition(coords);
    if (!isDrawingRef.current) return;
    drawLine(lastCoordRef.current.x, lastCoordRef.current.y, coords.x, coords.y, currentTool);
    lastCoordRef.current = coords;
    
    // Add normalized point to current stroke
    if (strokesRef.current.length > 0) {
      const currentStroke = strokesRef.current[strokesRef.current.length - 1];
      currentStroke.points.push({
        x: coords.x / displaySize.width,
        y: coords.y / displaySize.height
      });
    }
  }, [currentTool, displaySize.width, displaySize.height, drawLine, getCoords]);

  const handleDrawEnd = React.useCallback(() => {
    setCursorPosition(null);
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    // Clear redo stack when new stroke is added
    undoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
    
    // Always save both strokes (for editing) and PNG (for export)
    const displayCanvas = canvasRef.current;
    const base64Image = displayCanvas ? displayCanvas.toDataURL("image/png") : "";
    
    const markupData = JSON.stringify({
      strokes: strokesRef.current,
      canvasSize: { width: displaySize.width, height: displaySize.height }
    });
    
    if (onDrawingChange) {
      onDrawingChange({ strokes: markupData, image: base64Image });
    }
  }, [onDrawingChange, displaySize.width, displaySize.height]);

  // Helper to redraw strokes from markup data (diagram mode)
  const redrawMarkup = React.useCallback(() => {
    if (strokesRef.current.length === 0) return;
    
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;
    const ctx = drawingCanvas.getContext("2d");
    
    strokesRef.current.forEach(stroke => {
      if (stroke.tool === "eraser") {
        stroke.points.forEach(normalizedPt => {
          const pt = {
            x: normalizedPt.x * displaySize.width,
            y: normalizedPt.y * displaySize.height
          };
          const half = eraserWidth / 2;
          ctx.clearRect(pt.x - half, pt.y - half, eraserWidth, eraserWidth);
        });
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        stroke.points.forEach((normalizedPt, i) => {
          const pt = {
            x: normalizedPt.x * displaySize.width,
            y: normalizedPt.y * displaySize.height
          };
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }
    });
  }, [mode, displaySize.width, displaySize.height, eraserWidth]);

  const clearCanvas = React.useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;
    
    const ctx = drawingCanvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    compositeDisplay();

    setHasDrawing(false);
    setTempDrawing(null);
    strokesRef.current = [];
    undoStackRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
    
    if (onDrawingChange) {
      onDrawingChange({ strokes: "", image: "" });
    }
  }, [displaySize.width, displaySize.height, compositeDisplay, onDrawingChange]);

  const undo = React.useCallback(() => {
    if (strokesRef.current.length === 0) return;
    
    const lastStroke = strokesRef.current.pop();
    undoStackRef.current.push(lastStroke);
    
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;
    const ctx = drawingCanvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    
    redrawMarkup();
    compositeDisplay();
    
    const displayCanvas = canvasRef.current;
    const base64Image = displayCanvas ? displayCanvas.toDataURL("image/png") : "";
    
    const markupData = JSON.stringify({
      strokes: strokesRef.current,
      canvasSize: { width: displaySize.width, height: displaySize.height }
    });
    onDrawingChange?.({ strokes: markupData, image: base64Image });
    
    setHasDrawing(strokesRef.current.length > 0);
    setCanUndo(strokesRef.current.length > 0);
    setCanRedo(true);
  }, [displaySize.width, displaySize.height, onDrawingChange, redrawMarkup, compositeDisplay]);

  const redo = React.useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    
    const stroke = undoStackRef.current.pop();
    strokesRef.current.push(stroke);
    
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;
    const ctx = drawingCanvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    
    redrawMarkup();
    compositeDisplay();
    
    const displayCanvas = canvasRef.current;
    const base64Image = displayCanvas ? displayCanvas.toDataURL("image/png") : "";
    
    const markupData = JSON.stringify({
      strokes: strokesRef.current,
      canvasSize: { width: displaySize.width, height: displaySize.height }
    });
    onDrawingChange?.({ strokes: markupData, image: base64Image });
    
    setHasDrawing(strokesRef.current.length > 0);
    setCanUndo(true);
    setCanRedo(undoStackRef.current.length > 0);
  }, [displaySize.width, displaySize.height, onDrawingChange, redrawMarkup, compositeDisplay]);

  // Load existing drawing data (strokes JSON)
  React.useEffect(() => {
    if (!existingDrawing) return;
    
    try {
      const data = JSON.parse(existingDrawing);
      if (data.strokes && Array.isArray(data.strokes)) {
        strokesRef.current = data.strokes;
        setHasDrawing(data.strokes.length > 0);
        setCanUndo(data.strokes.length > 0);
      }
    } catch (e) {
      // Not JSON, might be legacy base64 - ignore
      console.warn("Existing drawing is not JSON stroke data");
    }
  }, [existingDrawing]);

  // Update canvas resolution and redraw
  React.useEffect(() => {
    const displayCanvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!displayCanvas || !drawingCanvas || displaySize.width === 0) return;

    const displayCtx = setupCanvas(displayCanvas);
    const drawingCtx = setupCanvas(drawingCanvas);
    
    displayCtx.clearRect(0, 0, displaySize.width, displaySize.height);
    drawingCtx.clearRect(0, 0, displaySize.width, displaySize.height);

    // Redraw markup from strokes
    redrawMarkup();
    compositeDisplay();
  }, [displaySize, hasDrawing, backgroundLoaded, placeholder, backgroundColor, redrawMarkup, compositeDisplay]);

  // Handle responsive sizing
  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const aspectRatio = width / height;
      const maxHeight = 500;
      let newHeight = Math.min(containerWidth / aspectRatio, maxHeight);

      setDisplaySize({
        width: containerWidth,
        height: newHeight,
      });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [width, height]);

  // Add native touch event listeners with {passive: false} to prevent scroll while drawing
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touchStartHandler = (e) => {
      e.preventDefault();
      handleDrawStart(e);
    };
    const touchMoveHandler = (e) => {
      e.preventDefault();
      handleDrawMove(e);
    };
    const touchEndHandler = (e) => {
      e.preventDefault();
      handleDrawEnd();
    };

    canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
    canvas.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
      canvas.removeEventListener("touchend", touchEndHandler);
    };
  }, [handleDrawStart, handleDrawMove, handleDrawEnd]);

  return (
    <div ref={containerRef} className="drawing-canvas-container w-full">
      {/* Canvas */}
      <div
        className={`canvas-wrapper relative rounded bg-white overflow-hidden ${
          existingDrawing ? "" : "border-2 border-gray-300"
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            cursor: currentTool === "eraser" ? eraserCursor : penCursor,
            display: "block",
            border: "1px solid #e5e7eb",
            touchAction: "none",
          }}
        />
        {/* Hidden drawing layer canvas */}
        <canvas
          ref={drawingCanvasRef}
          style={{ display: "none" }}
        />

        {/* Cursor dot overlay */}
        {cursorPosition && (
          <div
            className="cursor-dot pointer-events-none absolute rounded-full border-2"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              width: `${currentTool === "eraser" ? eraserWidth : currentSize * 2}px`,
              height: `${currentTool === "eraser" ? eraserWidth : currentSize * 2}px`,
              borderColor: currentTool === "eraser" ? "#ef4444" : currentColor,
              backgroundColor: currentTool === "eraser" ? "rgba(239, 68, 68, 0.1)" : `${currentColor}20`,
              transform: "translate(-50%, -50%)",
              transition: "width 0.1s, height 0.1s",
            }}
          />
        )}

        {/* Action Buttons - Right Side */}
        {showControls && (hasDrawing || canUndo || canRedo) && (
          <div className="action-buttons absolute top-2 right-2 flex flex-col md:flex-row gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="undo-btn w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded shadow-md transition touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo"
            >
              <svg className="undo-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="redo-btn w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded shadow-md transition touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo"
            >
              <svg className="redo-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
            <button
              onClick={clearCanvas}
              className="clear-btn w-7 h-7 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded shadow-md transition touch-manipulation"
              title="Clear"
            >
              <X_ICON className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tool Controls - Below Canvas */}
      {showControls && (
        <div className="tool-controls-toolbar flex gap-2 rounded mt-2 px-0.5">
          {/* Tool Selector */}
          <button
            onClick={() => setCurrentTool("pen")}
            className={`tool-btn tool-btn-pen w-7 h-7 flex items-center justify-center rounded transition-colors touch-manipulation ${
              currentTool === "pen"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Pen"
          >
            <PEN_ICON className="w-4 h-4" />
          </button>
          {hasEraser && (
            <button
              onClick={() => setCurrentTool("eraser")}
              className={`tool-btn tool-btn-eraser w-7 h-7 flex items-center justify-center rounded transition-colors touch-manipulation ${
                currentTool === "eraser"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="Eraser"
            >
              <ERASER_ICON className="w-4 h-4" />
            </button>
          )}

          {/* Divider */}
          {currentTool === "pen" && <div className="toolbar-divider w-px bg-gray-300" />}

          {/* Color Selector */}
          {currentTool === "pen" && (
            <>
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color);
                  }}
                  className={`color-btn w-7 h-7 rounded transition-all touch-manipulation ${
                    currentColor === color
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}

              {/* Custom Color Slot */}
              <div
                className={`custom-color-slot w-7 h-7 rounded cursor-pointer transition-all touch-manipulation ${
                  customColor && currentColor === customColor
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
                style={{ backgroundColor: customColor || "#808080" }}
              >
                <input
                  type="color"
                  value={customColor || "#808080"}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setCurrentColor(e.target.value);
                  }}
                  className="w-full h-full opacity-0 cursor-pointer"
                  title="Custom color"
                />
              </div>

              {/* Divider */}
              <div className="toolbar-divider w-px bg-gray-300" />

              {/* Size Selector */}
              {sizePalette.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setCurrentSize(size);
                  }}
                  className={`size-btn w-7 h-7 flex items-center justify-center rounded transition-all touch-manipulation ${
                    currentSize === size
                      ? "bg-blue-500 ring-2 ring-blue-500 ring-offset-2"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title={`Size ${size}px`}
                >
                  <div
                    className={`size-indicator rounded-full ${currentSize === size ? "bg-white" : "bg-gray-700"}`}
                    style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
                  />
                </button>
              ))}

              {/* Custom Size Slot */}
              <div className="custom-size-slot relative" ref={sizePickerRef}>
                <button
                  onClick={() => {
                    setTempSize(customSize || 5);
                    setShowSizePicker(!showSizePicker);
                  }}
                  className={`custom-size-btn w-7 h-7 flex items-center justify-center rounded transition-colors touch-manipulation ${
                    currentSize === customSize && customSize !== null
                      ? "bg-blue-500 ring-2 ring-blue-500 ring-offset-2"
                      : "bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300"
                  }`}
                  title="Custom size"
                >
                  {customSize ? (
                    <div
                      className={`size-indicator rounded-full ${currentSize === customSize ? "bg-white" : "bg-gray-700"}`}
                      style={{ width: `${Math.min(customSize * 1.5, 20)}px`, height: `${Math.min(customSize * 1.5, 20)}px` }}
                    />
                  ) : (
                    <span className="text-xs text-gray-500">+</span>
                  )}
                </button>

                {/* Size Picker Modal - Vertical Slider */}
                {showSizePicker && (
                  <div className="size-picker-modal absolute bottom-full -left-2 mb-2 flex flex-col items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 w-fit">
                    <input
                      type="range"
                      min="4"
                      max="20"
                      value={tempSize}
                      onChange={(e) => setTempSize(parseInt(e.target.value))}
                      onMouseUp={() => {
                        setCustomSize(tempSize);
                        setCurrentSize(tempSize);
                        setShowSizePicker(false);
                      }}
                      onTouchEnd={() => {
                        setCustomSize(tempSize);
                        setCurrentSize(tempSize);
                        setShowSizePicker(false);
                      }}
                      className="size-slider h-24 w-5"
                      style={{
                        writingMode: 'bt-lr',
                        WebkitAppearance: 'slider-vertical'
                      }}
                    />
                    <div className="size-preview flex items-center justify-center w-6 h-6">
                      <div
                        className="size-preview-dot rounded-full bg-gray-700 transition-all"
                        style={{ width: `${tempSize}px`, height: `${tempSize}px` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{tempSize}px</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
