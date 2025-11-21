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
import SignatureField from "../adv_field/Signature_Field"
import UnsupportedField from "../basic_field/Unsupported_Field"
import ImageField from "../adv_field/Image_Field"


const fieldTypes = {
  section: {
    label: "Section Field",
    componentKey: "section",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "section",
      title: "",
      fields: [],
    },
    placeholder: {
      title: "Enter section title...",
      question: "Not applicable for section",
      options: "Not applicable for section",
    }
  },
  text: {
    label: "Text Field",
    componentKey: "text",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "text",
      question: "",
      answer: "",
    },
    placeholder: {
      question: "Enter your question...",
      answer: "Enter answer...",
      options: "Not applicable for text field",
    }
  },
  longtext: {
    label: "Long Text Field",
    componentKey: "longtext",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "longtext",
      question: "",
      answer: "",
    },
    placeholder: {
      question: "Enter your question...",
      answer: "Enter detailed answer...",
      options: "Not applicable for long text field",
    }
  },
  multitext: {
    label: "Multi Text Field",
    componentKey: "multitext",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "multitext",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
    },
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  radio: {
    label: "Radio Field",
    componentKey: "radio",
    hasOptions: true,
    hasMatrix: false,
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
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  check: {
    label: "Check Field",
    componentKey: "check",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "check",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
      answer: [],
    },
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  boolean: {
    label: "Boolean Field",
    componentKey: "boolean",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "boolean",
      question: "",
      options: [
        { value: "Yes" },
        { value: "No" },
      ],
      selected: null,
    },
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  dropdown: {
    label: "Drop Down Field",
    componentKey: "dropdown",
    hasOptions: true,
    hasMatrix: false,
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
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  multiselectdropdown: {
    label: "Multi-Select Dropdown",
    componentKey: "multiselectdropdown",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "multiselectdropdown",
      question: "",
      options: [
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" },
      ],
      selected: [],
    },
    placeholder: {
      question: "Enter your question...",
      options: "Enter option text...",
    }
  },
  rating: {
    label: "Rating Field",
    componentKey: "rating",
    hasOptions: true,
    hasMatrix: false,
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
    placeholder: {
      question: "Enter your question...",
      options: "Enter rating level...",
    }
  },
  ranking: {
    label: "Ranking Field",
    componentKey: "ranking",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "ranking",
      question: "",
      options: [
        { value: "Item 1" },
        { value: "Item 2" },
        { value: "Item 3" },
      ],
      selected: [],
    },
    placeholder: {
      question: "Enter your question...",
      options: "Enter item to rank...",
    }
  },
  slider: {
    label: "Slider Field",
    componentKey: "slider",
    hasOptions: true,
    hasMatrix: false,
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
    placeholder: {
      question: "Enter your question...",
      options: "Enter scale label...",
    }
  },
  multimatrix: {
    label: "Multi Matrix Field",
    componentKey: "multimatrix",
    hasOptions: false,
    hasMatrix: true,
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
    placeholder: {
      question: "Enter your question...",
      rows: "Enter row label...",
      columns: "Enter column label...",
    }
  },
  singlematrix: {
    label: "Single Matrix Field",
    componentKey: "singlematrix",
    hasOptions: false,
    hasMatrix: true,
    defaultProps: {
      fieldType: "singlematrix",
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
    placeholder: {
      question: "Enter your question...",
      rows: "Enter row label...",
      columns: "Enter column label...",
    }
  },
  signature: {
    label: "Signature Field",
    componentKey: "signature",
    defaultProps: {
      fieldType: "signature",
      question: "",
      placeholder: "Sign here",
      answer: "",
      required: false,
    },
    placeholder: {
      question: "Enter your question...",
      pad: "Enter placeholder text for signature pad...",
    }
  },
  unsupported: {
    label: "Unsupported Field",
    componentKey: "unsupported",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "unsupported",
      question: "Unsupported field type",
      unsupportedType: "unknown",
      unsupportedData: {},
    },
    placeholder: {
      question: "Unsupported field type",
      options: "Cannot edit unsupported field",
    }
  },
  image: {
    label: "Image Field",
    componentKey: "image",
    defaultProps: {
      fieldType: "image",
      label: "",
      imageUri: "",
      altText: "",
      caption: "",
      size: "full",
      alignment: "center",
      padding: "padded",
    },
    placeholder: {
      label: "Image Block",
      altText: "Descriptive alt text for accessibility",
      caption: "Optional caption below image",
    }
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
  signature: SignatureField,
  unsupported: UnsupportedField,
  image: ImageField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

