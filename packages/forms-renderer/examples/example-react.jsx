import React from 'react';
import { createRoot } from 'react-dom/client';
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

/**
 * Example: Using QuestionnaireRenderer as a React component
 * Requires: react, react-dom (peer dependencies)
 */
function App() {
  const [formData] = React.useState([
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Personal Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'text',
          question: 'What is your full name?',
          answer: ''
        },
        {
          id: 'q-gender',
          fieldType: 'radio',
          question: 'Biological sex',
          options: [
            { id: 'gender-male', value: 'Male' },
            { id: 'gender-female', value: 'Female' },
            { id: 'gender-other', value: 'Other' }
          ],
          selected: null
        },
        {
          id: 'q-email',
          fieldType: 'text',
          question: 'Email address',
          answer: ''
        },
        {
          id: 'q-contact',
          fieldType: 'multitext',
          question: 'Contact Information',
          options: [
            { id: 'contact-phone', value: 'Phone', answer: '' },
            { id: 'contact-address', value: 'Address', answer: '' },
            { id: 'contact-city', value: 'City', answer: '' }
          ]
        }
      ]
    },
    {
      id: 'sec-pregnancy',
      fieldType: 'section',
      title: 'Pregnancy Information',
      enableWhen: {
        logic: 'AND',
        conditions: [
          { targetId: 'q-gender', operator: 'equals', value: 'gender-female' }
        ]
      },
      fields: [
        {
          id: 'q-pregnant',
          fieldType: 'radio',
          question: 'Are you currently pregnant?',
          options: [
            { id: 'preg-yes', value: 'Yes' },
            { id: 'preg-no', value: 'No' }
          ],
          selected: null
        },
        {
          id: 'q-weeks',
          fieldType: 'text',
          question: 'Weeks gestation (if known)',
          answer: '',
          enableWhen: {
            logic: 'AND',
            conditions: [
              { targetId: 'q-pregnant', operator: 'equals', value: 'preg-yes' }
            ]
          }
        }
      ]
    },
    {
      id: 'sec-2',
      fieldType: 'section',
      title: 'Medical History',
      fields: [
        {
          id: 'q-medications',
          fieldType: 'radio',
          question: 'Are you currently taking any medications?',
          options: [
            { id: 'meds-yes', value: 'Yes' },
            { id: 'meds-no', value: 'No' }
          ],
          selected: null
        },
        {
          id: 'q-med-list',
          fieldType: 'longtext',
          question: 'List current medications (name, dose, frequency)',
          answer: '',
          enableWhen: {
            logic: 'AND',
            conditions: [
              { targetId: 'q-medications', operator: 'equals', value: 'meds-yes' }
            ]
          }
        },
        {
          id: 'q-conditions',
          fieldType: 'check',
          question: 'Do you have any of the following conditions?',
          options: [
            { id: 'cond-diabetes', value: 'Diabetes' },
            { id: 'cond-hypertension', value: 'Hypertension' },
            { id: 'cond-asthma', value: 'Asthma' },
            { id: 'cond-other', value: 'Other (specify below)' }
          ],
          selected: []
        },
        {
          id: 'q-conditions-other',
          fieldType: 'longtext',
          question: 'Please specify other conditions',
          answer: '',
          enableWhen: {
            logic: 'OR',
            conditions: [
              { targetId: 'q-conditions', operator: 'includes', value: 'cond-other' }
            ]
          }
        }
      ]
    }
  ]);

  const [submitted, setSubmitted] = React.useState(null);
  
  // Get current fields from form store
  const currentFields = useFieldsArray();

  const handleChange = (updatedFormData) => {
    console.log('Form changed:', updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = buildQuestionnaireResponse(currentFields, 'demo-questionnaire', 'patient-12345');
    console.log('Form submitted! FHIR Response:', fhirResponse);
    setSubmitted(fhirResponse);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>React Component Example</h1>
      
      <form onSubmit={handleSubmit}>
        <QuestionnaireRenderer
          formData={formData}
          onChange={handleChange}
          fullHeight={false}
          // Optional props (auto-detected if not provided):
          // schemaType: 'mieforms' | 'surveyjs' - Auto-detects from schema metadata
          // hideUnsupportedFields: boolean - Hide unsupported field types (default: true)
          // theme: 'light' | 'dark' - Theme mode (default: 'light')
        />
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#0076a8',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Submit Questionnaire
          </button>
        </div>
      </form>

      {submitted && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '0.5rem' }}>
          <h3>Submitted FHIR Response:</h3>
          <pre style={{ overflow: 'auto' }}>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
