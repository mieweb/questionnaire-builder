import React from "react";

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 100;

export default function SignatureCanvas({
  onSignatureChange,
  existingSignature,
}) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);
  const lastCoordRef = React.useRef({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = React.useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  
  // Use device pixel ratio for crisp drawing
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // ────────── Helper: Get mouse position relative to canvas ──────────
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width * displaySize.width,
      y: (e.clientY - rect.top) / rect.height * displaySize.height,
    };
  };

  // ────────── Helper: Get touch position relative to canvas ──────────
  const getTouchCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) / rect.width * displaySize.width,
      y: (touch.clientY - rect.top) / rect.height * displaySize.height,
    };
  };

  // ────────── Draw a line on canvas ──────────
  const drawLine = (fromX, fromY, toX, toY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  };

  // ────────── Canvas Mouse Events ──────────
  const handleMouseDown = (e) => {
    const coords = getCoords(e);
    if (!coords) return;
    isDrawingRef.current = true;
    lastCoordRef.current = coords;
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    const coords = getCoords(e);
    if (!coords) return;

    drawLine(lastCoordRef.current.x, lastCoordRef.current.y, coords.x, coords.y);
    lastCoordRef.current = coords;
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveSignature();
  };

  // ────────── Canvas Touch Events ──────────
  const handleTouchStart = (e) => {
    e.preventDefault();
    const coords = getTouchCoords(e);
    if (!coords) return;
    isDrawingRef.current = true;
    lastCoordRef.current = coords;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;

    const coords = getTouchCoords(e);
    if (!coords) return;

    drawLine(lastCoordRef.current.x, lastCoordRef.current.y, coords.x, coords.y);
    lastCoordRef.current = coords;
  };

  const handleTouchEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveSignature();
  };

  // ────────── Save signature to parent as base64 ──────────
  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL("image/png");
    onSignatureChange(base64);
  };

  // ────────── Initialize canvas with existing signature ──────────
  const initCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale canvas for device pixel ratio
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      };
      img.src = existingSignature;
    }
  }, [existingSignature, dpr]);

  // ────────── Update canvas resolution when display size changes ──────────
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || displaySize.width === 0) return;

    // Set actual canvas resolution based on display size and DPR
    const actualWidth = displaySize.width * dpr;
    const actualHeight = displaySize.height * dpr;

    canvas.width = actualWidth;
    canvas.height = actualHeight;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, displaySize.width, displaySize.height);

    // Redraw existing signature if present
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, displaySize.width, displaySize.height);
      };
      img.src = existingSignature;
    }
  }, [displaySize, dpr, existingSignature]);

  // ────────── Handle responsive sizing ──────────
  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
      
      // Scale proportionally without limiting to max size
      const displayHeight = containerWidth / aspectRatio;
      
      setDisplaySize({
        width: containerWidth,
        height: displayHeight,
      });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // ────────── Clear canvas ──────────
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, displaySize.width, displaySize.height);
    onSignatureChange("");
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3 w-full">
      <div className="border-2 border-gray-300 rounded bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            cursor: "crosshair",
            display: "block",
            border: "1px solid #e5e7eb",
          }}
        />
      </div>

      {existingSignature && (
        <div className="border border-gray-200 rounded p-2 bg-gray-50">
          <img
            src={existingSignature}
            alt="signature"
            className="w-full h-auto max-h-32 object-contain"
          />
        </div>
      )}

      <button
        onClick={clearCanvas}
        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
      >
        Clear
      </button>
    </div>
  );
}
