import InputField from "./basic_field/TextInput_Field"
import RadioField from "./basic_field/Radio_Field"
import CheckField from "./basic_field/Check_Field"
import SelectionField from "./basic_field/DropDown_Field"
import SectionField from "./adv_field/section_Field"

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
            options: ["", "", ""], 
            selected: null,
        },
    },
    radioYesNo: {
        label: "Yes/No Radio",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["Yes", "No"],
            selected: null,
        },
    },
    radioLikert4: {
        label: "4-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4"],
            selected: null,
        },
    },
    radioLikert5: {
        label: "5-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5"],
            selected: null,
        },
    },
    radioLikert6: {
        label: "6-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5", "6"],
            selected: null,
        },
    },
    radioLikert7: {
        label: "7-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5", "6", "7"],
            selected: null,
        },
    },
    radioLikert8: {
        label: "8-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5", "6", "7", "8"],
            selected: null,
        },
    },
    radioLikert9: {
        label: "9-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            selected: null,
        },
    },
    radioLikert10: {
        label: "10-Point Likert Scale",
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            selected: null,
        },
    },
    check: {
        label: "Check Field",
        component: CheckField,
        defaultProps: {
            fieldType: "check",
            question: "",
            options: ["", "", ""],
            selected: [],
        },
    },
    selection: {
        label: "Dropdown Field",
        component: SelectionField,
        defaultProps: {
            fieldType: "selection",
            question: "",
            options: ["", "", ""], 
            selected: null,
        },
    },

    // import EnableWhenField from "./adv_field/EnableWhen_Field"
    // enableWhen: {
    //     label: "Enable When",
    //     component: EnableWhenField,
    //     defaultProps: {
    //         fieldType: "enableWhen",
    //         question: "New EnableWhen Condition",
    //         condition: {
    //             fieldId: null,
    //             value: "", 
    //         },
    //         field1: {
    //             id: "child-field1-id",
    //             fieldType: "input", 
    //             question: "Child Field 1",
    //             answer: "",
    //         },
    //         field2: {
    //             id: "child-field2-id",
    //             fieldType: "input", 
    //             question: "Child Field 2",
    //             answer: "",
    //         },
    //     },
    // },
}

export default fieldTypes
