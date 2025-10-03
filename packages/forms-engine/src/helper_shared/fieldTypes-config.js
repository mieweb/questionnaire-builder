import InputField from "../basic_field/TextInput_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"


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
    selection: {
        label: "Dropdown Field",
        componentKey: "selection",
        defaultProps: {
            fieldType: "selection",
            question: "",
            options: [
                { value: "Option 1" },
                { value: "Option 2" },
                { value: "Option 3" },
            ],
            selected: null,
        },
    },
};

// Internal component map (key -> React component). Leaf components registered eagerly.
const componentMap = {
    input: InputField,
    radio: RadioField,
    check: CheckField,
    selection: SelectionField,
    // section added lazily
};

export function registerFieldComponent(key, component) {
    if (!componentMap[key]) componentMap[key] = component;
}

export function getFieldComponent(type) {
    return componentMap[type] || null;
}

export default fieldTypes;
