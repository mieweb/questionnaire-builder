import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fieldTypes } from "@questionnaire-builder/fields";
import DataViewer from "./DataViewer.jsx";
import { DATALOG_ICON, EYEEDIT_ICON, EYECLOSED_ICON, PLUSSQUARE_ICON, X_ICON } from "@questionnaire-builder/icons";

export default function MobileToolBar({ hooks }) {
  const [isToolBarExpanded, setIsToolBarExpanded] = useState(false);
  const [isLogExpanded, setIsLogExpanded] = useState(false);
  const containerRef = useRef(null);

  const addField = hooks.useFormStore((s) => s.addField);
  const fieldsArray = hooks.useFieldsArray();

  
  const ui = hooks.useUIApi();
  const isPreview = ui.state.isPreview;

  const handleToolBarExpanded = () => {
    setIsToolBarExpanded((v) => !v);
    setIsLogExpanded(false);
  };
  const handleLogExpanded = () => {
    setIsLogExpanded((v) => !v);
    setIsToolBarExpanded(false);
  };
  const handlePreviewMode = () => {
    ui.preview.toggle(); 
    setIsToolBarExpanded(false);
    setIsLogExpanded(false);
  };

  useEffect(() => {
    if (!isToolBarExpanded || isLogExpanded) return;
    const handleDocDown = (event) => {
      const el = containerRef.current;
      if (el && !el.contains(event.target)) {
        setIsToolBarExpanded(false);
        setIsLogExpanded(false);
      }
    };
    document.addEventListener("pointerdown", handleDocDown);
    return () => document.removeEventListener("pointerdown", handleDocDown);
  }, [isToolBarExpanded, isLogExpanded]);

  return (
    <div className="MobileToolBar fixed bottom-0 left-0 w-full text-stone-900 shadow-lg z-10">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`flex ${!isPreview ? "justify-around" : "justify-center"} pb-5 max-w-xl sm:max-w-4xl mx-auto`}
      >
        <motion.button
          onClick={handlePreviewMode}
          initial={{ opacity: 1, scale: 1, x: "0%" }}
          animate={{
            opacity: isToolBarExpanded || isLogExpanded ? 0 : 1,
            scale: isToolBarExpanded || isLogExpanded ? 0 : 1,
            x: !isPreview ? "0%" : "120%",
          }}
          className={`relative cursor-pointer ${!isPreview ? "" : "mx-29"} bg-black/5 rounded-2xl p-3 backdrop-blur-xl`}
        >
          {!isPreview ? <EYECLOSED_ICON className="h-12 w-12" /> : <EYEEDIT_ICON className="h-12 w-12" />}
        </motion.button>

        {!isPreview && (
          <motion.button
            onClick={handleToolBarExpanded}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isToolBarExpanded || isLogExpanded ? 0 : 1,
              scale: isToolBarExpanded || isLogExpanded ? 0 : 1,
            }}
            className="relative cursor-pointer bg-black/5 rounded-2xl p-3 backdrop-blur-xl"
          >
            <PLUSSQUARE_ICON className="h-12 w-12" />
          </motion.button>
        )}

        <motion.button
          onClick={handleLogExpanded}
          initial={{ opacity: 1, scale: 1, x: "0%" }}
          animate={{
            opacity: isLogExpanded || isToolBarExpanded ? 0 : 1,
            scale: isLogExpanded || isToolBarExpanded ? 0 : 1,
            x: !isPreview ? "0%" : "-120%",
          }}
          className={`relative cursor-pointer ${!isPreview ? "" : "mx-29"} bg-black/5 rounded-2xl p-3 backdrop-blur-xl`}
        >
          <DATALOG_ICON className="h-12 w-12" />
        </motion.button>
      </motion.div>

      <DataViewer
        open={isLogExpanded}
        onClose={() => setIsLogExpanded(false)}
        data={fieldsArray}
        title="Form Data"
        placement="bottom"
        contentClassName="custom-scrollbar"
      />

      <motion.div
        ref={containerRef}
        onPointerDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: "100%", scale: 0 }}
        animate={{
          opacity: isToolBarExpanded ? 1 : 0,
          y: isToolBarExpanded ? "0%" : "100%",
          scale: isToolBarExpanded ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="MobileToolBar-Modal fixed bottom-0 w-full mx-auto bg-black/5 border-black/15 border px-9 py-4 mb-2 rounded-2xl backdrop-blur-xl overflow-y-scroll"
      >
        <div className="grid grid-cols-1 gap-2">
          <button className="flex w-full justify-end" onClick={() => setIsToolBarExpanded(false)}>
            <X_ICON />
          </button>

          {Object.keys(fieldTypes).map((type) => (
            <button
              key={type}
              className="px-4 pl-6 py-2 text-black text-left rounded hover:bg-slate-50"
              onClick={() => {
                addField(type);
                setIsToolBarExpanded(false);
              }}
            >
              Add {fieldTypes[type].label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
