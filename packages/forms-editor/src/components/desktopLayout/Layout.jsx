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
    <div className="layout-container mie:w-full mie:h-fit mie:rounded-lg mie:mt-3">
      {isCodeEditor ? (
        <div className="mie:border mie:border-mieborder mie:rounded-lg">
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
                    className="mie:fixed mie:inset-0 mie:z-40 mie:bg-mietext/30 mie:lg:hidden"
                    onClick={() => ui.modal.set(false)}
                  />
                  <div className="mie:fixed mie:bottom-0 mie:left-0 mie:right-0 mie:z-50 mie:bg-miesurface mie:rounded-t-2xl mie:shadow-2xl mie:max-h-[60vh] mie:overflow-y-auto mie:custom-scrollbar mie:lg:hidden">
                    <EditPanel key={panelResetKey} isMobileModal={true} />
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
            className="mie:lg:hidden mie:fixed mie:bottom-5 mie:left-5 mie:z-40 mie:bg-mieprimary mie:hover:bg-mieprimary/90 mie:text-miesurface mie:rounded-full mie:w-12 mie:h-12 mie:flex mie:items-center mie:justify-center mie:shadow-lg mie:transition-all"
            title="Add field"
          >
            <svg className="mie:w-6 mie:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Mobile Tool Panel Sheet */}
          {isMobileToolPanelOpen && (
            <>
              <div className="mie:fixed mie:inset-0 mie:z-40 mie:bg-mietext/30 mie:lg:hidden"
                onClick={() => setIsMobileToolPanelOpen(false)}
              />
              <div className="mie:fixed mie:bottom-0 mie:left-0 mie:right-0 mie:z-50 mie:bg-miesurface mie:rounded-t-2xl mie:shadow-2xl mie:max-h-[60vh] mie:overflow-y-auto mie:custom-scrollbar mie:lg:hidden">
                <ToolPanel />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
