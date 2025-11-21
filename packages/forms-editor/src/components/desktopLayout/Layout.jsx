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
    <div className="layout-container w-full h-fit rounded-lg mt-2 md:mt-4 lg:mt-6">
      {isCodeEditor ? (
        <div className="border border-gray-200 rounded-lg">
          <CodeEditor />
        </div>

      ) : (
        <div className={`layout-grid flex lg:gap-3 h-full`}>
          {editMode && (
            <div className="layout-tool-panel hidden lg:block lg:w-72">
              <ToolPanel />
            </div>
          )}

          <div className="layout-main-content flex-1 ">
            <FormBuilderMain />
          </div>

          {editMode && (
            <div className="layout-edit-panel hidden lg:block lg:w-90 md:w-80">
              <EditPanel key={panelResetKey} />
            </div>
          )}

          {editMode && (
            <div className="layout-mobile-modal lg:hidden">
              {isEditModalOpen && selectedField && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => ui.modal.set(false)}
                  />
                  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar lg:hidden">
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
            className="lg:hidden fixed bottom-5 left-5 z-40 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
            title="Add field"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Mobile Tool Panel Sheet */}
          {isMobileToolPanelOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                onClick={() => setIsMobileToolPanelOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto custom-scrollbar lg:hidden">
                <ToolPanel />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
