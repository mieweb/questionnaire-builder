import React from 'react';
import { createRoot } from 'react-dom/client';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

/**
 * Example: Using QuestionnaireRenderer as a React component
 * Requires: react, react-dom (peer dependencies)
 */
function App() {
  const [fields] = React.useState([
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Personal Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'input',
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
          fieldType: 'input',
          question: 'Email address',
          answer: ''
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
          fieldType: 'input',
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
          fieldType: 'input',
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
          fieldType: 'input',
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

  const handleChange = (updatedFields) => {
    console.log('Form changed:', updatedFields);
  };

  const handleSubmit = (fhirResponse) => {
    console.log('Form submitted! FHIR Response:', fhirResponse);
    setSubmitted(fhirResponse);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>React Component Example</h1>
      
      <QuestionnaireRenderer
        questionnaireId="demo-questionnaire"
        subjectId="patient-12345"
        fields={fields}
        onChange={handleChange}
        onSubmit={handleSubmit}
        fullHeight={false}
      />

      {submitted && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
          <h3>Submitted FHIR Response:</h3>
          <pre>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
