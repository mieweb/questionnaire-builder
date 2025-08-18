import React, { useState, useEffect, useRef } from "react"
import { DATALOG_ICON, EYEEDIT_ICON, EYECLOSED_ICON, PLUSSQUARE_ICON, X_ICON } from "../assets/icons"
import { motion } from "framer-motion"

const MobileToolBar = ({ fieldTypes, formData, setFormData, isPreview, setIsPreview, addField }) => {
  const [isToolBarExpanded, setIsToolBarExpanded] = useState(false)
  const [isLogExpanded, setIsLogExpanded] = useState(false)
  const containerRef = useRef(null);

  const handleToolBarExpanded = () => {
    setIsToolBarExpanded(!isToolBarExpanded)
    setIsLogExpanded(false)
  }
  const handleLogExpanded = () => {
    setIsLogExpanded(!isLogExpanded)
    setIsToolBarExpanded(false)
  }

  const handlePreviewMode = () => {
    setIsPreview(!isPreview)
    setIsToolBarExpanded(false)
    setIsLogExpanded(false)
  }

  useEffect(() => {
    if (!isToolBarExpanded && !isLogExpanded) return;

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
        {/*MODE SWITCH BUTTON (PREVIEW / EDIT MODE) */}
        <motion.button
          onClick={handlePreviewMode}
          initial={{ opacity: 1, scale: 1, x: "0%" }}
          animate={{ opacity: isToolBarExpanded || isLogExpanded ? 0 : 1, scale: isToolBarExpanded || isLogExpanded ? 0 : 1, x: !isPreview ? "0%" : "120%" }}
          exit={{ opacity: 0 }}
          className={`relative cursor-pointer ${!isPreview ? "" : "mx-29"} bg-black/5 rounded-2xl p-3 backdrop-blur-xl`}
        >
          {!isPreview ? <EYECLOSED_ICON className="h-12 w-12" /> : <EYEEDIT_ICON className="h-12 w-12" />}
        </motion.button>

        {/*TOOL BAR BUTTON */}
        {!isPreview && (
          <motion.button
            onClick={handleToolBarExpanded}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: isToolBarExpanded || isLogExpanded ? 0 : 1, scale: isToolBarExpanded || isLogExpanded ? 0 : 1 }}
            exit={{ opacity: 0 }}
            className="relative cursor-pointer bg-black/5 rounded-2xl p-3 backdrop-blur-xl"
          >
            <PLUSSQUARE_ICON className="h-12 w-12" />
          </motion.button>
        )}

        {/*JSON DATA LOG BUTTON */}
        <motion.button
          onClick={handleLogExpanded}
          initial={{ opacity: 1, scale: 1, x: "0%" }}
          animate={{ opacity: isLogExpanded || isToolBarExpanded ? 0 : 1, scale: isLogExpanded || isToolBarExpanded ? 0 : 1, x: !isPreview ? "0%" : "-120%" }}
          exit={{ opacity: 0 }}
          className={`relative cursor-pointer ${!isPreview ? "" : "mx-29"} bg-black/5 rounded-2xl p-3 backdrop-blur-xl`}
        >
          <DATALOG_ICON className="h-12 w-12" />
        </motion.button>
      </motion.div>

      {/*JSON DATA LOG MODAL DIV*/}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: "100%", scale: 0 }}
        animate={{ opacity: isLogExpanded ? 1 : 0, y: isLogExpanded ? "0%" : "100%", scale: isLogExpanded ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="fixed isolate bottom-0 w-full bg-black/5 border-black/15 border px-6 py-4 max-h-96 rounded-2xl backdrop-blur-xl
                            overflow-hidden"
      >
        <button
          className="flex w-full justify-end"
          onClick={() => {
            setIsLogExpanded(!isLogExpanded)
          }}
        >
          <X_ICON />
        </button>
        <h3 className="font-bold text-lg mb-4">Form Data (JSON)</h3>
        <div className="p-4 rounded-lg overflow-y-auto max-h-80 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-700">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </motion.div>


      {/*TOOLBAR MODAL DIV */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: "100%", scale: 0 }}
        animate={{ opacity: isToolBarExpanded ? 1 : 0, y: isToolBarExpanded ? "0%" : "100%", scale: isToolBarExpanded ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="MobileToolBar-Modal fixed bottom-0 w-full mx-auto bg-black/5 border-black/15 border px-9 py-4 mb-2 rounded-2xl backdrop-blur-xl 
                            overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400"
      >
        <div className="grid grid-cols-1 gap-2">
          <button
            className="flex w-full justify-end"
            onClick={() => {
              setIsToolBarExpanded(!isToolBarExpanded)
            }}
          >
            <X_ICON />
          </button>
          {Object.keys(fieldTypes).map((type) => (
            <button
              key={type}
              className="px-4 pl-6 py-2 text-black text-left rounded hover:bg-slate-50"
              onClick={() => {
                addField(formData, setFormData, type)
                setIsToolBarExpanded(!isToolBarExpanded)
              }}
            >
              Add {fieldTypes[type].label}
            </button>
          ))}
        </div>

      </motion.div>
    </div>
  )
}

export default MobileToolBar
