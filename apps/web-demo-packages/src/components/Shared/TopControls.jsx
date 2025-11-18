import React from 'react';
import { BackButton } from './BackButton';
import { ExamplesDropdown } from './ExamplesDropdown';
import { HideUnsupportedToggle } from './HideUnsupportedToggle';

export function TopControls({
  selectedExample,
  onSelectExample,
  onLoadData,
  hideUnsupportedFields,
  setHideUnsupportedFields,
}) {
  return (
    <div className="fixed inset-x-0 top-5 z-50 flex items-center justify-center px-5">
      <div className="w-full max-w-6xl px-4 flex items-center justify-between">
        <ExamplesDropdown
          selectedExample={selectedExample}
          onSelectExample={onSelectExample}
          onLoadData={onLoadData}
        />
        <HideUnsupportedToggle
          hideUnsupportedFields={hideUnsupportedFields}
          setHideUnsupportedFields={setHideUnsupportedFields}
        />
        <BackButton />
      </div>
    </div>

  );
}
