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
import DiagramField from "../adv_field/Diagram_Field"
import UnsupportedField from "../basic_field/Unsupported_Field"
import ImageField from "../adv_field/Image_Field"
import ExpressionField from "../adv_field/Expression_Field"

/**
 * Field Type Configuration Schema
 * 
 * Each field type is configured with the following properties:
 * 
 * @property {string} label - Display name for the field type (shown in UI)
 * @property {string} category - Category grouping for the tool panel
 *   Available categories:
 *   - "Text Fields" - Single/long/multi text input fields
 *   - "Selection Fields" - Radio, checkbox, dropdown selections
 *   - "Rating & Ranking" - Rating scales, ranking, sliders
 *   - "Matrix Fields" - Single/multi matrix questions
 *   - "Rich Content" - Images, HTML, signature pads, and other rich media content
 *   - "Organization" - Sections and field grouping
 *   - "Other" - Miscellaneous fields
 * 
 * @property {string} componentKey - Internal key for component mapping
 * @property {boolean} hasOptions - If true, field has selectable answer options (radio, check, dropdown)
 * @property {boolean} hasMatrix - If true, field has matrix structure with rows/columns
 * 
 * @property {Object} defaultProps - Default properties when field is created
 *   Structure varies by field type:
 *   - Text fields: fieldType, question, answer
 *   - Option fields: fieldType, question, options[], selected
 *   - Matrix fields: fieldType, question, rows[], columns[], selected{}
 *   - Media fields: fieldType, label, imageUri, altText, etc.
 *   - Section: fieldType, title, fields[]
 * 
 * @property {Object} placeholder - Placeholder text/help text for form editors
 *   Keys: question, answer, options, rows, columns, altText, caption, etc.
 * 
 * Available Categories:
 * - Text Fields: text, longtext, multitext
 * - Selection Fields: radio, check, boolean, dropdown, multiselectdropdown
 * - Rating & Ranking: rating, slider, ranking
 * - Matrix Fields: singlematrix, multimatrix
 * - Rich Content: image
 * - Organization: section
 * - Other: unsupported
 */

const fieldTypes = {
  section: {
    label: "Section Field",
    category: "Organization",
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
    category: "Text Fields",
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
    category: "Text Fields",
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
    category: "Text Fields",
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
    category: "Selection Fields",
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
    category: "Selection Fields",
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
    category: "Selection Fields",
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
    label: "Dropdown Field",
    category: "Selection Fields",
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
    category: "Selection Fields",
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
    category: "Rating & Ranking",
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
    category: "Rating & Ranking",
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
    category: "Rating & Ranking",
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
    category: "Matrix Fields",
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
    category: "Matrix Fields",
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
    category: "Rich Content",
    componentKey: "signature",
    defaultProps: {
      fieldType: "signature",
      question: "",
      placeholder: "Sign here",
      signatureData: "",
      signatureImage: "",
      required: false,
    },
    placeholder: {
      question: "Enter your question...",
      pad: "Enter placeholder text for signature pad...",
    }
  },
  diagram: {
    label: "Diagram Field",
    category: "Rich Content",
    componentKey: "diagram",
    defaultProps: {
      fieldType: "diagram",
      question: "",
      placeholder: "Draw on the diagram",
      diagramImage: "",
      markupData: "",
      markupImage: "",
      required: false,
    },
    placeholder: {
      question: "Enter your question...",
      pad: "Enter placeholder text for diagram pad...",
    }
  },
  unsupported: {
    label: "Unsupported Field",
    category: "Other",
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
    category: "Rich Content",
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
  expression: {
    label: "Expression Field",
    category: "Rich Content",
    componentKey: "expression",
    defaultProps: {
      fieldType: "expression",
      label: "Calculated Result",
      expression: "",
      displayFormat: "number",
      decimalPlaces: 2,
      sampleDataFields: [],
      answer: "",
    },
    placeholder: {
      label: "Expression Field",
      expression: "{fieldId1} + {fieldId2}",
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
  diagram: DiagramField,
  unsupported: UnsupportedField,
  image: ImageField,
  expression: ExpressionField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

