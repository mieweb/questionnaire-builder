import Text from "../basic_field/Text_Field"
import LongTextField from "../basic_field/LongText_Field"
import MultiTextField from "../basic_field/MultiText_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
import BooleanField from "../basic_field/Boolean_Field"
import RatingField from "../basic_field/Rating_Field"
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
  unsupported: UnsupportedField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

