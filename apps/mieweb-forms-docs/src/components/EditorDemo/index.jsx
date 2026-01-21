import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

export default function EditorDemo() {
  const { colorMode } = useColorMode();
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'Sample Questionnaire',
    description: 'Try editing the form below',
    fields: [
      {
        id: 'name',
        fieldType: 'text',
        question: 'What is your name?',
        required: true,
        answer: ''
      },
      {
        id: 'email',
        fieldType: 'text',
        question: 'Email address',
        answer: ''
      }
    ]
  });

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px', minHeight: '500px' }}>
      <QuestionnaireEditor 
        initialFormData={formData}
        onChange={setFormData}
        hideUnsupportedFields={true}
        theme={colorMode === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}



