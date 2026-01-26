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
import HTMLField from "../adv_field/HTML_Field"
import ExpressionField from "../adv_field/Expression_Field"

/**
 * Field Type Configuration Schema
 * 
 * @property {string} label - Display name shown in UI
 * @property {string} category - Tool panel grouping (Text Fields | Selection Fields | Rating & Ranking | Matrix Fields | Rich Content | Organization | Other)
 * @property {string} componentKey - Internal key for component mapping
 * @property {string} answerType - Answer extraction behavior (text | selection | multiselection | multitext | matrix | media | display | container | none)
 * @property {boolean} hasOptions - Has selectable answer options (radio, check, dropdown)
 * @property {boolean} hasMatrix - Has matrix structure with rows/columns
 * @property {Object} defaultProps - Default properties when field is created
 * @property {Object} placeholder - Placeholder text for form editors
 * 
 * Field Types by Category:
 * - Text Fields: text, longtext, multitext
 * - Selection Fields: radio, check, boolean, dropdown, multiselectdropdown
 * - Rating & Ranking: rating, slider, ranking
 * - Matrix Fields: singlematrix, multimatrix
 * - Rich Content: image, html, signature, diagram, expression
 * - Organization: section
 * - Other: unsupported
 * 
 * @see FIELDS_BY_ANSWER_TYPE for field groupings by answer extraction behavior
 */

const fieldTypes = {
  section: {
    label: "Section Field",
    category: "Organization",
    componentKey: "section",
    answerType: "container",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "section",
      fields: [],
    },
    placeholder: {
      title: "Enter section title...",
    }
  },
  text: {
    label: "Text Field",
    category: "Text Fields",
    componentKey: "text",
    answerType: "text",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "text",
      inputType: "string",  // string, number, email, tel, date, datetime-local, month, time, range
    },
    placeholder: {
      question: "Enter your question...",
      answer: "Enter answer...",
    }
  },
  longtext: {
    label: "Long Text Field",
    category: "Text Fields",
    componentKey: "longtext",
    answerType: "text",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "longtext",
    },
    placeholder: {
      question: "Enter your question...",
      answer: "Enter detailed answer...",
    }
  },
  multitext: {
    label: "Multi Text Field",
    category: "Text Fields",
    componentKey: "multitext",
    answerType: "multitext",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "multitext",
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
    answerType: "selection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "radio",
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
  check: {
    label: "Check Field",
    category: "Selection Fields",
    componentKey: "check",
    answerType: "multiselection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "check",
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
  boolean: {
    label: "Boolean Field",
    category: "Selection Fields",
    componentKey: "boolean",
    answerType: "selection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "boolean",
      options: [
        { value: "Yes" },
        { value: "No" },
      ],
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
    answerType: "selection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "dropdown",
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
  multiselectdropdown: {
    label: "Multi-Select Dropdown",
    category: "Selection Fields",
    componentKey: "multiselectdropdown",
    answerType: "multiselection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "multiselectdropdown",
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
  rating: {
    label: "Rating Field",
    category: "Rating & Ranking",
    componentKey: "rating",
    answerType: "selection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "rating",
      options: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
      ],
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
    answerType: "multiselection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "ranking",
      options: [
        { value: "Item 1" },
        { value: "Item 2" },
        { value: "Item 3" },
      ],
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
    answerType: "selection",
    hasOptions: true,
    hasMatrix: false,
    defaultProps: {
      fieldType: "slider",
      options: [
        { value: "Low" },
        { value: "Medium" },
        { value: "High" },
      ],
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
    answerType: "matrix",
    hasOptions: false,
    hasMatrix: true,
    defaultProps: {
      fieldType: "multimatrix",
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
    answerType: "matrix",
    hasOptions: false,
    hasMatrix: true,
    defaultProps: {
      fieldType: "singlematrix",
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
    answerType: "media",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "signature",
      placeholder: "Sign here",
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
    answerType: "media",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "diagram",
      placeholder: "Draw on the diagram",
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
    answerType: "none",
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
    }
  },
  image: {
    label: "Image Field",
    category: "Rich Content",
    componentKey: "image",
    answerType: "display",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "image",
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
  html: {
    label: "HTML Block",
    category: "Rich Content",
    componentKey: "html",
    answerType: "display",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "html",
      iframeHeight: 400,
    },
    placeholder: {
      htmlContent: "<p>Enter your HTML content here...</p>",
    }
  },
  expression: {
    label: "Expression Field",
    category: "Rich Content",
    componentKey: "expression",
    answerType: "text",
    hasOptions: false,
    hasMatrix: false,
    defaultProps: {
      fieldType: "expression",
      label: "Calculated Result",
      displayFormat: "number",
      decimalPlaces: 2,
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
  html: HTMLField,
  expression: ExpressionField,
};

export function registerFieldComponent(key, component) {
  if (!componentMap[key]) componentMap[key] = component;
}

/**
 * Numeric expression display formats
 * Used for formatting computed values in expression fields
 */
export const NUMERIC_EXPRESSION_FORMATS = ["number", "currency", "percentage"];

/**
 * Field types grouped by answerType (derived from fieldTypes config)
 * 
 * Answer Types:
 * - text: Single stringified value (text, longtext, expression)
 * - selection: Single choice (radio, dropdown, boolean, rating, slider)
 * - multiselection: Multiple choices (check, multiselectdropdown, ranking)
 * - multitext: Multiple text inputs per field
 * - matrix: Row/column selections (singlematrix, multimatrix)
 * - media: Binary/image data (signature, diagram)
 * - display: No user answer (image, html)
 * - container: Groups other fields (section)
 * - none: No answer support (unsupported)
 * 
 * @example FIELDS_BY_ANSWER_TYPE.text.has('expression') // true
 */
export const FIELDS_BY_ANSWER_TYPE = Object.entries(fieldTypes).reduce((acc, [key, config]) => {
  const type = config.answerType;
  if (type) {
    if (!acc[type]) acc[type] = new Set();
    acc[type].add(key);
  }
  return acc;
}, {});

export function getFieldComponent(type) {
  return componentMap[type] || null;
}

export default fieldTypes;

