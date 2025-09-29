import React from "react";
import InputField from "./basic_field/TextInput_Field.jsx"
import RadioField from "./basic_field/Radio_Field.jsx"
import CheckField from "./basic_field/Check_Field.jsx"
import SelectionField from "./basic_field/DropDown_Field.jsx"
import SectionField from "./adv_field/section_Field.jsx"
import { TEXTINPUT_ICON, RADIOINPUT_ICON, CHECKINPUT_ICON, SELECTINPUT_ICON, PLUSSQUARE_ICON } from "@questionnaire-builder/icons"

const fieldTypes = {
    section: {
      label: "Section Field",
      icon: <PLUSSQUARE_ICON className="w-5 h-5" />,
      component: SectionField,
      defaultProps: {
        fieldType: "section",
        title: "New section",
        fields: [],
      }
    },

    input: {
        label: "Input Field",
        icon: <TEXTINPUT_ICON className="w-5 h-5" />,
        component: InputField,
        defaultProps: { 
            fieldType: "input", 
            question: "", 
            answer: "", 
        },
    },
    radio: {
        label: "Radio Field",
        icon: <RADIOINPUT_ICON className="w-5 h-5" />,
        component: RadioField,
        defaultProps: {
            fieldType: "radio",
            question: "",
            options: ["", "", ""], 
            selected: null,
        },
    },
    check: {
        label: "Check Field",
        icon: <CHECKINPUT_ICON className="w-5 h-5" />,
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
        icon: <SELECTINPUT_ICON className="w-5 h-5" />,
        component: SelectionField,
        defaultProps: {
            fieldType: "selection",
            question: "",
            options: ["", "", ""], 
            selected: null,
        },
    },
}

export default fieldTypes
