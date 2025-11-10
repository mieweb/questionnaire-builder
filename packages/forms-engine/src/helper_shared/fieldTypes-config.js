import Text from "../basic_field/Text_Field"
import LongTextField from "../basic_field/LongText_Field"
import MultiTextField from "../basic_field/MultiText_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
import MultiSelectDropDownField from "../basic_field/multiSelectDropDown_Field"
import BooleanField from "../basic_field/Boolean_Field"
import RatingField from "../basic_field/Rating_Field"
import RankingField from "../basic_field/Ranking_Field"
import SliderField from "../basic_field/Slider_Field"
import MultiMatrixField from "../basic_field/MultiMatrix_Field"
import SingleMatrixField from "../basic_field/SingleMatrix_Field"
import UnsupportedField from "../basic_field/Unsupported_Field"


const fieldTypes = {
  section: {
    label: "Section Field",
    componentKey: "section",
    defaultProps: {
      fieldType: "section",
      title: "",
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
        { value: "" },
        { value: "" },
        { value: "" },
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
        { value: "" },
        { value: "" },
        { value: "" },
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
        { value: "" },
        { value: "" },
        { value: "" },
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
        { value: "" },
        { value: "" },
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
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      selected: null,
    },
  },
  multiselectdropdown: {
    label: "Multi-Select Dropdown",
    componentKey: "multiselectdropdown",
    defaultProps: {
      fieldType: "multiselectdropdown",
      question: "",
      options: [
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      selected: [],
    },
  },
  rating: {
    label: "Rating Field",
    componentKey: "rating",
    defaultProps: {
      fieldType: "rating",
      question: "",
      options: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      selected: null,
    },
  },
  ranking: {
    label: "Ranking Field",
    componentKey: "ranking",
    defaultProps: {
      fieldType: "ranking",
      question: "",
      options: [
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      selected: [],
    },
  },
  slider: {
    label: "Slider Field",
    componentKey: "slider",
    defaultProps: {
      fieldType: "",
      question: "",
      options: [
        { value: "" },
        { value: "" },
        { value: "" },
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
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      columns: [
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      selected: {},
    },
  },
  singlematrix: {
    label: "Single Matrix Field",
    componentKey: "singlematrix",
    defaultProps: {
      fieldType: "singlematrix",
      question: "",
      rows: [
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      columns: [
        { value: "" },
        { value: "" },
        { value: "" },
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
  multiselectdropdown: MultiSelectDropDownField,
  rating: RatingField,
  ranking: RankingField,
  slider: SliderField,
  multimatrix: MultiMatrixField,
  singlematrix: SingleMatrixField,
  unsupported: UnsupportedField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

