import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [fields, setFields] = React.useState([
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Patient Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'input',
          question: 'Full Name',
          answer: ''
        },
        {
          id: 'q-dob',
          fieldType: 'input',
          question: 'Date of Birth',
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
          question: 'Do you have any of the following conditions? (Check all that apply)',
          options: [
            { id: 'cond-diabetes', value: 'Diabetes' },
            { id: 'cond-hypertension', value: 'Hypertension' },
            { id: 'cond-asthma', value: 'Asthma' },
            { id: 'cond-heart', value: 'Heart Disease' },
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
        },
        {
          id: 'q-allergies',
          fieldType: 'check',
          question: 'Known allergies (select all that apply)',
          options: [
            { id: 'alg-none', value: 'No known allergies' },
            { id: 'alg-penicillin', value: 'Penicillin' },
            { id: 'alg-peanut', value: 'Peanuts' },
            { id: 'alg-other', value: 'Other (specify below)' }
          ],
          selected: []
        },
        {
          id: 'q-allergy-details',
          fieldType: 'input',
          question: 'Please specify allergy details (reaction, severity)',
          answer: '',
          enableWhen: {
            logic: 'OR',
            conditions: [
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-penicillin' },
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-peanut' },
              { targetId: 'q-allergies', operator: 'includes', value: 'alg-other' }
            ]
          }
        }
      ]
    },
    {
      id: 'q-notes',
      fieldType: 'input',
      question: 'Additional notes or comments',
      answer: ''
    }
  ]);

  return (
    <div className="w-full h-dvh bg-slate-100">
      <div className="absolute inset-0 overflow-auto">
        <QuestionnaireEditor
          initialFields={fields}
          onChange={setFields}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);