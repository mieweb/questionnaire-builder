import React from "react";
import ToolPanel from "./toolPanel/ToolPanel";
import EditPanel from "./editPanel/EditPanel";
import FormBuilderMain from "../FormBuilderMain";
import { useUIApi } from "@mieweb/forms-engine";

export default function Layout({ selectedField }) {
  const ui = useUIApi();

  const isPreview       = ui.state.isPreview;
  const isEditModalOpen = ui.state.isEditModalOpen;
  const panelResetKey   = ui.state.panelResetKey;

  const editMode = !isPreview;
  const cols = editMode
    ? "lg:grid-cols-[280px_minmax(0,1fr)_320px]"
    : "lg:grid-cols-[minmax(0,1fr)]";

  return (
    <div className="layout-container w-full max-w-6xl mx-auto px-4 h-fit rounded-lg mt-2">
      <div className={`layout-grid grid grid-cols-1 ${cols} gap-3 h-full items-start`}>
        {editMode && (
          <div className="layout-tool-panel hidden lg:block">
            <ToolPanel />
          </div>
        )}

        <div className="layout-main-content">
          <FormBuilderMain />
        </div>

        {editMode && (
          <div className="layout-edit-panel hidden lg:block">
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
    </div>
  );
}
