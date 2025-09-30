import InputField from "../basic_field/TextInput_Field"
import RadioField from "../basic_field/Radio_Field"
import CheckField from "../basic_field/Check_Field"
import SelectionField from "../basic_field/DropDown_Field"
import SectionField from "../adv_field/section_Field"

const fieldTypes = {
    section: {
      label: "Section Field",
      component: SectionField,
      defaultProps: {
        fieldType: "section",
        title: "New section",
        fields: [],
      }
    },

    input: {
        label: "Input Field",
        component: InputField,
        defaultProps: { 
            fieldType: "input", 
            question: "", 
            answer: "", 
        },
    },
    radio: {
        label: "Radio Field",
        component: RadioField,
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
        component: CheckField,
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
        component: SelectionField,
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
}

export default fieldTypes
