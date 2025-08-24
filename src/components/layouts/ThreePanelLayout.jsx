import React from "react";

export default function EditorLayout({ left, center, right, isPreview }) {
  return (
    <div className="layout-container w-full max-w-6xl mx-auto px-4 pb-24">
      {/* Prevent stretch, keep columns at natural height */}
      <div className= {` three-panel-container grid grid-cols-1 ${isPreview ? "grid-cols-1" : "grid-cols-3"} lg:grid-cols-[280px_minmax(0,1fr)_320px] gap-4`}>
        {/* Left (sticky, its own scroll) */}
        {!isPreview && (
          <aside
            className="left-panel bg-white border border-gray-200 rounded-lg shadow-sm
                    lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto"
          >
            {left}
          </aside>
        )}


        {/* Center (normal flow; can grow as much as needed) */}
        <main className="center-panel rounded-lg">
          {center}
        </main>

        {/* Right (sticky, its own scroll) */}

        {!isPreview && (
          <aside
            className="right-panel bg-white border border-gray-200 rounded-lg shadow-sm
                    lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto"
          >
            {right}
          </aside>
        )}
      </div>
    </div>
  );
} 
