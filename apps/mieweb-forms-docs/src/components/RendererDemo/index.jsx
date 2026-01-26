import React, { useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

export default function RendererDemo() {
  const { colorMode } = useColorMode();
  const rendererRef = useRef();
  
  const formData = {
    schemaType: 'mieforms-v1.0',
    title: 'Patient Survey',
    fields: [
      {
        id: 'name',
        fieldType: 'text',
        question: 'What is your full name?',
        required: true
      },
      {
        id: 'rating',
        fieldType: 'radio',
        question: 'How would you rate your experience?',
        options: [
          { value: 'Excellent' },
          { value: 'Good' },
          { value: 'Fair' }
        ]
      },
      {
        id: 'feedback',
        fieldType: 'longtext',
        question: 'Additional comments'
      }
    ]
  };

  const handleSubmit = () => {
    const response = rendererRef.current.getResponse();
    console.log('Raw response:', response);
    console.log('Formatted response:', JSON.stringify(response, null, 2));
    alert('Response logged to console! for the demo!');
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
      <QuestionnaireRenderer 
        ref={rendererRef}
        formData={formData} 
        theme={colorMode === 'dark' ? 'dark' : 'light'} 
      />
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button 
          onClick={handleSubmit}
          style={{ 
            padding: '16px 32px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

