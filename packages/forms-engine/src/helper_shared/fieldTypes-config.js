import Text from "../basic_field/Text_Field"
import LongTextField from "../basic_field/LongText_Field"
import MultiTextField from "../basic_field/MultiText_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
import BooleanField from "../basic_field/Boolean_Field"
import RatingField from "../basic_field/Rating_Field"
import SliderField from "../basic_field/Slider_Field"
import MultiMatrixField from "../basic_field/MultiMatrix_Field"
import UnsupportedField from "../basic_field/Unsupported_Field"


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
  text: {
    label: "Text Field",
    componentKey: "text",
    defaultProps: {
      fieldType: "text",
      question: "",
      answer: "",
    },
  },
  longtext: {
    label: "Long Text Field",
    componentKey: "longtext",
    defaultProps: {
      fieldType: "longtext",
      question: "",
      answer: "",
    },
  },
  multitext: {
    label: "Multi Text Field",
    componentKey: "multitext",
    defaultProps: {
      fieldType: "multitext",
      question: "",
      options: [
        { value: "Field 1" },
        { value: "Field 2" },
        { value: "Field 3" },
      ],
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
  boolean: {
    label: "Boolean Field",
    componentKey: "boolean",
    defaultProps: {
      fieldType: "boolean",
      question: "",
      options: [
        { id: "yes", value: "Yes" },
        { id: "no", value: "No" },
      ],
      selected: null,
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
  rating: {
    label: "Rating Field",
    componentKey: "rating",
    defaultProps: {
      fieldType: "rating",
      question: "",
      options: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
      ],
      selected: null,
    },
  },
  slider: {
    label: "Slider Field",
    componentKey: "slider",
    defaultProps: {
      fieldType: "slider",
      question: "",
      options: [
        { value: "Low" },
        { value: "Medium" },
        { value: "High" },
      ],
      selected: null,
    },
  },
  multimatrix: {
    label: "Multi Matrix Field",
    componentKey: "multimatrix",
    defaultProps: {
      fieldType: "multimatrix",
      question: "",
      rows: [
        { value: "Row 1" },
        { value: "Row 2" },
        { value: "Row 3" },
      ],
      columns: [
        { value: "Column 1" },
        { value: "Column 2" },
        { value: "Column 3" },
      ],
      selected: {},
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
};

const componentMap = {
  text: Text,
  longtext: LongTextField,
  multitext: MultiTextField,
  radio: RadioField,
  check: CheckField,
  boolean: BooleanField,
  dropdown: SelectionField,
  rating: RatingField,
  slider: SliderField,
  multimatrix: MultiMatrixField,
  unsupported: UnsupportedField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

