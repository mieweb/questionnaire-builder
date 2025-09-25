import React from "react";
import ToolPanel from "../desktopLayout/toolPanel/ToolPanel";
import EditPanel from "../desktopLayout/editPanel/EditPanel";
import FormBuilderMain from "../FormBuilderMain";
import { useUIApi } from "../../state/uiApi";

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
    <div className="w-full max-w-6xl mx-auto px-4 h-fit rounded-lg mt-2">
      <div className={`grid grid-cols-1 ${cols} gap-3 h-full items-start`}>
        {editMode && (
          <div className="hidden lg:block">
            <ToolPanel />
          </div>
        )}

        <div>
          <FormBuilderMain />
        </div>

        {editMode && (
          <div className="hidden lg:block">
            <EditPanel key={panelResetKey} />
          </div>
        )}

        {editMode && (
          <div className="lg:hidden">
            {isEditModalOpen && selectedField && (
              <div
                className="fixed inset-0 top-5 z-50 flex items-center justify-center bg-transparent/30 backdrop-blur-sm p-4"
                onClick={() => ui.modal.set(false)} 
              >
                <div
                  className="w-full max-w-md mx-auto relative bg-white rounded-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-3 right-7 text-gray-500"
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
