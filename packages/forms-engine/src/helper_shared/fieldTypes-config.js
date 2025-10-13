import InputField from "../basic_field/TextInput_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
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
