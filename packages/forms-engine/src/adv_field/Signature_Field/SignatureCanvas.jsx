import React from "react";

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 150;

export default function SignatureCanvas({
  onSignatureChange,
  existingSignature,
}) {
  const canvasRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);
  const lastCoordRef = React.useRef({ x: 0, y: 0 });
  
  // Use device pixel ratio for crisp drawing
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // ────────── Helper: Get mouse position relative to canvas ──────────
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width * CANVAS_WIDTH,
      y: (e.clientY - rect.top) / rect.height * CANVAS_HEIGHT,
    };
  };

  // ────────── Helper: Get touch position relative to canvas ──────────
  const getTouchCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) / rect.width * CANVAS_WIDTH,
      y: (touch.clientY - rect.top) / rect.height * CANVAS_HEIGHT,
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

  // ────────── Effect: Initialize canvas on mount or when signature changes ──────────
  React.useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // ────────── Clear canvas ──────────
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    onSignatureChange("");
  };

  return (
    <div className="flex flex-col gap-3">
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
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
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
