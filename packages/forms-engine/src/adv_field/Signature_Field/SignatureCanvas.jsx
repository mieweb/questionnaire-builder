import React from "react";
import { X_ICON, CHECK_ICON } from "../../helper_shared/icons";

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 125;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

export default function SignatureCanvas({
  onSignatureChange,
  existingSignature,
  placeholder = "Please sign here",
}) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);
  const lastCoordRef = React.useRef({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = React.useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const [hasSignature, setHasSignature] = React.useState(!!existingSignature);
  const [tempSignature, setTempSignature] = React.useState(null);

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

  const drawLine = (fromX, fromY, toX, toY) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  };

  const drawPlaceholder = (ctx) => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ccc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(placeholder, displaySize.width / 2, displaySize.height / 2);
  };

  const drawFinalLabel = (ctx) => {
    ctx.font = "14px Arial";
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Final Signature", displaySize.width / 2, displaySize.height - 10);
  };

  const handleDrawStart = (e) => {
    if (existingSignature) return;
    e.preventDefault?.();
    const coords = getCoords(e);
    if (!coords) return;
    isDrawingRef.current = true;
    lastCoordRef.current = coords;
    setHasSignature(true);
  };

  const handleDrawMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault?.();
    const coords = getCoords(e);
    if (!coords) return;
    drawLine(lastCoordRef.current.x, lastCoordRef.current.y, coords.x, coords.y);
    lastCoordRef.current = coords;
  };

  const handleDrawEnd = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setTempSignature(canvas.toDataURL("image/png"));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, displaySize.width, displaySize.height);
    setHasSignature(false);
    setTempSignature(null);
    drawPlaceholder(ctx);
    onSignatureChange("");
  };

  // Update canvas resolution and redraw
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || displaySize.width === 0) return;

    const actualWidth = displaySize.width * DPR;
    const actualHeight = displaySize.height * DPR;

    canvas.width = actualWidth;
    canvas.height = actualHeight;

    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, displaySize.width, displaySize.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, displaySize.width, displaySize.height);

    if (!hasSignature) {
      drawPlaceholder(ctx);
    }

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, displaySize.width, displaySize.height);
        drawFinalLabel(ctx);
      };
      img.src = existingSignature;
    }
  }, [displaySize, existingSignature, hasSignature, placeholder]);

  // Handle responsive sizing
  React.useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
      const maxHeight = 200; // Prevent canvas from getting too tall
      let height = Math.min(containerWidth / aspectRatio, maxHeight);
      
      setDisplaySize({
        width: containerWidth,
        height: height,
      });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-[80svw] md:max-w-[75svw] lg:max-w-full">
      <div className={`relative rounded bg-white overflow-hidden ${existingSignature ? "" : "border-2 border-gray-300"}`}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
          onTouchStart={handleDrawStart}
          onTouchMove={handleDrawMove}
          onTouchEnd={handleDrawEnd}
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            cursor: existingSignature ? "default" : "crosshair",
            display: "block",
            border: "1px solid #e5e7eb",
          }}
        />
        {(existingSignature || (hasSignature && !existingSignature)) && (
          <div className="absolute top-2 right-2 flex gap-2">
            {hasSignature && !existingSignature && (
              <button
                onClick={() => onSignatureChange(tempSignature)}
                className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 rounded transition"
                title="Finalize"
              >
                <CHECK_ICON className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={clearCanvas}
              className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
              title="Clear"
            >
              <X_ICON className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
