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
 * @param {Function} props.onDrawingChange - Callback when drawing is finalized (receives base64 string)
 * @param {string} [props.existingDrawing] - Existing drawing as base64 (readonly mode)
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
 * @param {string} [props.mode] - "draw" (default), "signature", or "diagram"
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
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [tempRgb, setTempRgb] = React.useState({ r: 128, g: 128, b: 128 });
  const colorPickerRef = React.useRef(null);
  const sizePickerRef = React.useRef(null);
  const colorModalRef = React.useRef(null);
  
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

  // Helper: convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  };

  // Helper: convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
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

  // Close color picker when clicking outside
  React.useEffect(() => {
    if (!showColorPicker) return;
    
    const handleClickOutside = (e) => {
      if (colorModalRef.current && !colorModalRef.current.contains(e.target)) {
        const hexColor = rgbToHex(tempRgb.r, tempRgb.g, tempRgb.b);
        setCustomColor(hexColor);
        setCurrentColor(hexColor);
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker, tempRgb]);

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
  }, [displaySize.width, displaySize.height, getCoords]);

  const handleDrawMove = React.useCallback((e) => {
    if (!isDrawingRef.current) return;
    const coords = getCoords(e);
    if (!coords) return;
    drawLine(lastCoordRef.current.x, lastCoordRef.current.y, coords.x, coords.y, currentTool);
    lastCoordRef.current = coords;
  }, [currentTool, displaySize.width, displaySize.height, currentColor, currentSize, eraserWidth, drawLine, getCoords]);

  const handleDrawEnd = React.useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const displayCanvas = canvasRef.current;
    if (displayCanvas) {
      const base64Drawing = displayCanvas.toDataURL("image/png");
      setTempDrawing(base64Drawing);
      // Auto-save drawing when user releases mouse/touch
      onDrawingChange(base64Drawing);
    }
  }, [onDrawingChange]);

  const clearCanvas = React.useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;
    
    const ctx = drawingCanvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    compositeDisplay();

    setHasDrawing(false);
    setTempDrawing(null);
    onDrawingChange("");
  }, [displaySize.width, displaySize.height, compositeDisplay, onDrawingChange]);

  // Update canvas resolution and redraw
  React.useEffect(() => {
    const displayCanvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!displayCanvas || !drawingCanvas || displaySize.width === 0) return;

    const displayCtx = setupCanvas(displayCanvas);
    const drawingCtx = setupCanvas(drawingCanvas);
    
    displayCtx.clearRect(0, 0, displaySize.width, displaySize.height);
    drawingCtx.clearRect(0, 0, displaySize.width, displaySize.height);

    compositeDisplay();

    if (existingDrawing) {
      const img = new Image();
      img.onload = () => {
        drawingCtx.drawImage(img, 0, 0, displaySize.width, displaySize.height);
        displayCtx.drawImage(img, 0, 0, displaySize.width, displaySize.height);
      };
      img.src = existingDrawing;
    }
  }, [displaySize, existingDrawing, hasDrawing, backgroundLoaded, placeholder, backgroundColor]);

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

        {/* Action Buttons - Right Side */}
        {showControls && hasDrawing && (
          <div className="action-buttons absolute top-2 right-2 flex flex-col md:flex-row gap-2">
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
              <div className="custom-color-slot relative" ref={colorModalRef}>
                <button
                  onClick={() => {
                    setTempRgb(customColor ? hexToRgb(customColor) : { r: 128, g: 128, b: 128 });
                    setShowColorPicker(!showColorPicker);
                  }}
                  className={`custom-color-btn w-7 h-7 rounded transition-all touch-manipulation flex items-center justify-center ${
                    currentColor === customColor && customColor !== null
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300"
                  }`}
                  style={{
                    backgroundColor: customColor || "#f3f4f6",
                    border: customColor ? "none" : "2px dashed #9ca3af"
                  }}
                  title="Custom color"
                >
                  {!customColor && <span className="text-xs text-gray-500">+</span>}
                </button>

                {/* RGB Color Picker Modal */}
                {showColorPicker && (
                  <div className="color-picker-modal absolute bottom-full -left-14 sm:-left-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 pt-1 z-50 w-fit">
                    <div className="rgb-picker flex flex-col gap-3">
                      {/* Close Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowColorPicker(false)}
                          className="close-btn w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                          title="Close"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                      </div>

                      {/* R Slider */}
                      <div className="rgb-slider-group flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600 w-6">R</label>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={tempRgb.r}
                          onChange={(e) => {
                            const newR = parseInt(e.target.value);
                            // Prevent pure red (255,0,0)
                            if (newR === 255 && tempRgb.g === 0 && tempRgb.b === 0) return;
                            setTempRgb({ ...tempRgb, r: newR });
                          }}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-600 w-8 text-right">{tempRgb.r}</span>
                      </div>

                      {/* G Slider */}
                      <div className="rgb-slider-group flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600 w-6">G</label>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={tempRgb.g}
                          onChange={(e) => {
                            const newG = parseInt(e.target.value);
                            // Prevent pure red (255,0,0) and blue (0,0,255)
                            if ((tempRgb.r === 255 && newG === 0 && tempRgb.b === 0) ||
                                (tempRgb.r === 0 && newG === 0 && tempRgb.b === 255)) return;
                            setTempRgb({ ...tempRgb, g: newG });
                          }}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-600 w-8 text-right">{tempRgb.g}</span>
                      </div>

                      {/* B Slider */}
                      <div className="rgb-slider-group flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600 w-6">B</label>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={tempRgb.b}
                          onChange={(e) => {
                            const newB = parseInt(e.target.value);
                            // Prevent pure blue (0,0,255)
                            if (tempRgb.r === 0 && tempRgb.g === 0 && newB === 255) return;
                            setTempRgb({ ...tempRgb, b: newB });
                          }}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-600 w-8 text-right">{tempRgb.b}</span>
                      </div>

                      {/* Color Preview */}
                      <div className="color-preview flex items-center justify-center h-8 rounded border border-gray-300" style={{ backgroundColor: rgbToHex(tempRgb.r, tempRgb.g, tempRgb.b) }} />
                    </div>
                  </div>
                )}
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
