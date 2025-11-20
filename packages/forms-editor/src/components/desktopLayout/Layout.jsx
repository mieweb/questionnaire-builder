import React from "react";
import ToolPanel from "./toolPanel/ToolPanel";
import EditPanel from "./editPanel/EditPanel";
import FormBuilderMain from "../FormBuilderMain";
import CodeEditor from "../CodeEditor";
import { useUIApi } from "@mieweb/forms-engine";

export default function Layout({ selectedField }) {
  const ui = useUIApi();

  const isPreview = ui.state.isPreview;
  const isCodeEditor = ui.state.isCodeEditor;
  const isEditModalOpen = ui.state.isEditModalOpen;
  const panelResetKey = ui.state.panelResetKey;

  const editMode = !isPreview;

  return (
    <div className="layout-container w-full h-fit rounded-lg mt-2">
      {isCodeEditor ? (
        <div className="border border-gray-200 rounded-lg">
          <CodeEditor />
        </div>

      ) : (
        <div className={`layout-grid flex gap-3 h-full items-start`}>
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
                <div
                  className="edit-modal-overlay fixed inset-0 top-5 z-50 flex items-center justify-center bg-transparent/30 backdrop-blur-sm p-4"
                  onClick={() => ui.modal.set(false)}
                >
                  <div
                    className="edit-modal-content w-full max-w-md mx-auto relative bg-white rounded-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="edit-modal-close absolute top-3 right-7 text-gray-500"
                      onClick={() => ui.modal.set(false)}
                    >
                      <span className="text-3xl">&times;</span>
                    </button>
                    <EditPanel key={panelResetKey} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
