import React from 'react';
import Layout from '@theme/Layout';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

export default function EditorDemo() {
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'My Custom Questionnaire',
    description: 'Build your own questionnaire using the editor below',
    fields: [
      {
        id: 'section-1',
        fieldType: 'section',
        title: 'Getting Started',
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
      }
    ]
  });

  return (
    <Layout
      title="Editor Demo"
      description="Interactive demo of the MIE Forms Editor">
      <div style={{ width: '100%', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ 
          backgroundColor: 'var(--ifm-background-surface-color)',
          padding: '1.5rem',
          borderBottom: '1px solid var(--ifm-color-emphasis-200)'
        }}>
          <div className="container">
            <h1 style={{ marginBottom: '0.5rem' }}>Forms Editor Demo</h1>
            <p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
              Build and customize questionnaires with a visual drag-and-drop interface
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ marginLeft: 'auto' }}>
                <a 
                  href="/docs/getting-started/quickstart-editor" 
                  className="button button--secondary button--sm"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <QuestionnaireEditor
            initialFormData={formData}
            onChange={setFormData}
            hideUnsupportedFields={true}
          />
        </div>

        <div style={{ 
          backgroundColor: 'var(--ifm-background-surface-color)',
          padding: '1rem',
          borderTop: '1px solid var(--ifm-color-emphasis-200)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--ifm-color-emphasis-600)'
        }}>
          <strong>Tip:</strong> Use the Build, Code, and Preview tabs to switch between editing modes. 
          Add fields from the Tools panel on the left.
        </div>
      </div>
    </Layout>
  );
}
