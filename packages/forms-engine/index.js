import './src/styles.css';

// advanced fields
export { default as Section_Field } from './src/adv_field/section_Field.jsx';

// basic fields
export { default as Check_Field } from './src/basic_field/Check_Field.jsx';
export { default as DropDown_Field } from './src/basic_field/DropDown_Field.jsx';
export { default as Radio_Field } from './src/basic_field/Radio_Field.jsx';
export { default as TextInput_Field } from './src/basic_field/TextInput_Field.jsx';

// shared helper components and hooks
export { default as FieldWrapper } from './src/helper_shared/FieldWrapper.jsx';
export { default as useFieldController } from './src/helper_shared/useFieldController.jsx';
export { default as fieldTypes, getFieldComponent, registerFieldComponent } from './src/helper_shared/fieldTypes-config.js';
export { initializeField, initializeFieldOptions } from './src/helper_shared/initializedField.js';
export { isVisible } from './src/helper_shared/logicVisibility.js';
export { detectSchemaType, adaptSchema } from './src/helper_shared/schemaAdapter.js';
export { generateFieldId, generateOptionId } from './src/helper_shared/idGenerator.js';

// state: stores, apis, selectors

export { useFormStore, useField, useFieldsArray, useVisibleFields } from './src/state/formStore.js';
export { useFormApi } from './src/state/formApi.js';
export { useUIApi } from './src/state/uiApi.js';
export { useUIStore } from './src/state/uiStore.js';

//assets
export * from './src/helper_shared/icons.jsx';