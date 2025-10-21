import InputField from "../basic_field/TextInput_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
import UnsupportedField from "../basic_field/Unsupported_Field"
import { fieldTypes } from "../../dist"


const fieldTypes = {
  section: {
    label: "Section Field",
    componentKey: "section",
    defaultProps: {
      fieldType: "section",
      title: "New section",
      fields: [],
    }
  },
  input: {
    label: "Input Field",
    componentKey: "input",
    defaultProps: {
      fieldType: "input",
      question: "",
      answer: "",
    },
  },
  radio: {
    label: "Radio Field",
    componentKey: "radio",
    defaultProps: {
      fieldType: "radio",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
      selected: null,
    },
  },
  check: {
    label: "Check Field",
    componentKey: "check",
    defaultProps: {
      fieldType: "check",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
      selected: [],
    },
  },
  dropdown: {
    label: "Dropdown Field",
    componentKey: "dropdown",
    defaultProps: {
      fieldType: "dropdown",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
      selected: null,
    },
  },
  unsupported: {
    label: "Unsupported Field",
    componentKey: "unsupported",
    defaultProps: {
      fieldType: "unsupported",
      question: "Unsupported field type",
      unsupportedType: "unknown",
      unsupportedData: {},
    },
  },

  singlematrix: {
    label: "singlematrix field",
    componentKey: "singlematrix",
    defaultProps: {
      fieldTypes: "singlematrix",
      question: "",
      rows: [],
      columns: [],
      selected: {},
    }
  },

  multimatrix: {
    label: "multimatrix field",
    componentKey: "multimatrix",
    defaultProps: {
      fieldTypes: "multimatrix",
      question: "",
      columns: [
        {
          id: "col1",
          value: "Column 1",
          options: [
            { id: "opt1", value: "Option 1" },
            { id: "opt2", value: "Option 2" },
            { id: "opt3", value: "Option 3" },
          ]
        },
        {
          id: "col2",
          value: "Column 2",
          options: [
            { id: "opt1", value: "Option 1" },
            { id: "opt3", value: "Option 3" },
          ]
        },
        {
          id: "col3",
          value: "Column 3",
          options: [
            { id: "opt1", value: "Option 1" },  
          ]
        },
      ],
      rows: [
        { id: "row1", value: "Row 1" },
        { id: "row2", value: "Row 2" },
        { id: "row3", value: "Row 3" },
      ],
      selected: {},
    }
  }
};

const componentMap = {
  input: InputField,
  radio: RadioField,
  check: CheckField,
  dropdown: SelectionField,
  unsupported: UnsupportedField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

