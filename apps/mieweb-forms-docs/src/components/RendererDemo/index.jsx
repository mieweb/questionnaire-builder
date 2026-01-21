import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

export default function RendererDemo() {
  const { colorMode } = useColorMode();
  const [formData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'Patient Survey',
    fields: [
      {
        id: 'name',
        fieldType: 'text',
        question: 'What is your full name?',
        required: true,
        answer: ''
      },
      {
        id: 'rating',
        fieldType: 'radio',
        question: 'How would you rate your experience?',
        options: [
          { value: 'Excellent' },
          { value: 'Good' },
          { value: 'Fair' }
        ],
        selected: null
      },
      {
        id: 'feedback',
        fieldType: 'textarea',
        question: 'Additional comments',
        answer: ''
      }
    ]
  });

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
      <QuestionnaireRenderer 
        formData={formData} 
        theme={colorMode === 'dark' ? 'dark' : 'light'} 
      />
    </div>
  );
}

