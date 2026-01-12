import React from "react";
import ToolPanel from "./toolPanel/ToolPanel";
import EditPanel from "./editPanel/EditPanel";
import FormBuilderMain from "../FormBuilderMain";
import CodeEditor from "../CodeEditor";
import { useUIApi } from "@mieweb/forms-engine";

export default function Layout({ selectedField }) {
  const ui = useUIApi();
  const [isMobileToolPanelOpen, setIsMobileToolPanelOpen] = React.useState(false);

  const isPreview = ui.state.isPreview;
  const isCodeEditor = ui.state.isCodeEditor;
  const isEditModalOpen = ui.state.isEditModalOpen;
  const panelResetKey = ui.state.panelResetKey;

  const editMode = !isPreview;

  return (
    <div className="layout-container mie:w-full mie:h-fit mie:rounded-lg mie:mt-2 mie:md:mt-4 mie:lg:mt-6">
      {isCodeEditor ? (
        <div className="mie:border mie:border-gray-200 mie:rounded-lg">
          <CodeEditor />
        </div>

      ) : (
        <div className={`layout-grid mie:flex mie:lg:gap-3 mie:h-full`}>
          {editMode && (
            <div className="layout-tool-panel mie:hidden mie:lg:block mie:lg:w-72">
              <ToolPanel />
            </div>
          )}

          <div className="layout-main-content mie:flex-1 mie:min-w-0">
            <FormBuilderMain />
          </div>

          {editMode && (
            <div className="layout-edit-panel mie:hidden mie:lg:block mie:lg:w-90 mie:md:w-80">
              <EditPanel key={panelResetKey} />
            </div>
          )}

          {editMode && (
            <div className="layout-mobile-modal mie:lg:hidden">
              {isEditModalOpen && selectedField && (
                <>
                  <div
                    className="mie:fixed mie:inset-0 mie:z-40 mie:bg-black/30 mie:lg:hidden"
                    onClick={() => ui.modal.set(false)}
                  />
                  <div className="mie:fixed mie:bottom-0 mie:left-0 mie:right-0 mie:z-50 mie:bg-white mie:rounded-t-2xl mie:shadow-2xl mie:max-h-[60vh] mie:overflow-y-auto custom-scrollbar mie:lg:hidden">
                    <div className="[&_.edit-panel-container]:overflow-visible [&_.edit-panel-container]:max-h-none">
                      <EditPanel key={panelResetKey} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Tool Panel - Slides up above keyboard */}
      {editMode && !isCodeEditor && (
        <>
          {/* Floating button to open mobile tool panel */}
          <button
            onClick={() => setIsMobileToolPanelOpen(!isMobileToolPanelOpen)}
            className="mie:lg:hidden mie:fixed mie:bottom-5 mie:left-5 mie:z-40 mie:bg-blue-500 mie:hover:bg-blue-600 mie:text-white mie:rounded-full mie:w-12 mie:h-12 mie:flex mie:items-center mie:justify-center mie:shadow-lg mie:transition-all"
            title="Add field"
          >
            <svg className="mie:w-6 mie:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Mobile Tool Panel Sheet */}
          {isMobileToolPanelOpen && (
            <>
              <div className="mie:fixed mie:inset-0 mie:z-40 mie:bg-black/30 mie:lg:hidden"
                onClick={() => setIsMobileToolPanelOpen(false)}
              />
              <div className="mie:fixed mie:bottom-0 mie:left-0 mie:right-0 mie:z-50 mie:bg-white mie:rounded-t-2xl mie:shadow-2xl mie:max-h-[60vh] mie:overflow-y-auto custom-scrollbar mie:lg:hidden">
                <ToolPanel />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
