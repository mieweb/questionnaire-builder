import React from "react"
import { v4 as uuidv4 } from "uuid"
import { initializeField } from "../utils/initializedFieldOptions"
import { checkFieldVisibility } from "../utils/visibilityChecker"
import fieldTypes from "./fields/fieldTypes-config"
import MobileToolBar from "./MobileToolBar"

// Importing the AI suggestion utility
import { getSuggestedQuestions } from '../utils/aiSuggest';


const FormBuilder = ({ formData, setFormData, isPreview, setIsPreview }) => {

    const addField = (type) => {
        const fieldTemplate = fieldTypes[type]?.defaultProps
        if (fieldTemplate) {
            const initializedField = initializeField({ ...fieldTemplate, id: uuidv4() })
            setFormData([...formData, initializedField])
        } else {
            alert("Unknown field type")
        }
    }

    const updateField = (id, key, value) => {
        setFormData(
            formData.map((field) =>
                field.id === id ? { ...field, [key]: value } : field
            )
        )
    }


    const deleteField = (id) => {
        setFormData(formData.filter((field) => field.id !== id))
    }


     // Snippet 2 // Add this function here:
    const handleSuggestQuestion = async () => {
    const topic = prompt("What is your form about?");
    if (!topic) return;

    try {
        const suggestions = await getSuggestedQuestions(topic);
        alert("AI Suggestions:\n\n" + suggestions.join('\n'));
    } catch (error) {
        alert("Failed to get AI suggestions.");
    }
};

    //snippet 2 ends here


    return (
        <div className="formBuilderMain pt-8 px-4 pb-20">
            {/*MOBILE TOOL BAR COMPONENT 
            CONTAINING - TOOLBAR && JSON LOG MODAL */}

            <MobileToolBar
                addField={addField}
                fieldTypes={fieldTypes}
                formData={formData}
                isPreview={isPreview}
                setIsPreview={setIsPreview}
            />

            
            {/* Suggest Question Button */}
            <div className="my-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleSuggestQuestion}
                    disabled={isPreview}
                >
                    Suggest Question (AI)
                </button>
            </div>

            {/*MAIN FORM COMPONENT CONTAINING ALL FIELDS */}
            <div>
                {
                    formData.map((field) => {
                        const FieldComponent = fieldTypes[field.fieldType]?.component
                        const shouldShow = isPreview ? checkFieldVisibility(field, formData) : true
                        return (
                            FieldComponent && shouldShow && (
                                <div key={field.id} className="mb-4">
                                    <FieldComponent
                                        field={field}
                                        label={fieldTypes[field.fieldType]?.label}
                                        onUpdate={(key, value) => updateField(field.id, key, value)}
                                        onDelete={() => !isPreview && deleteField(field.id)}
                                        isPreview={isPreview}
                                        formData={formData}
                                    />
                                </div>
                            )
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FormBuilder
