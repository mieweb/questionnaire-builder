// Preset schemas for testing multi-instance scenarios

export const PRESETS = {
  simple: {
    label: '📝 Simple Form',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Simple Form',
      fields: [
        { id: 'name', fieldType: 'text', question: 'Your name?' },
        { id: 'email', fieldType: 'text', inputType: 'email', question: 'Email address?' },
      ],
    },
  },
  conditional: {
    label: '🔀 Conditional Logic',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Conditional Form',
      fields: [
        {
          id: 'has_allergies',
          fieldType: 'radio',
          question: 'Do you have any allergies?',
          options: [{ id: 'allergy-yes', value: 'Yes' }, { id: 'allergy-no', value: 'No' }],
        },
        {
          id: 'allergy_details',
          fieldType: 'longtext',
          question: 'Please describe your allergies',
          enableWhen: {
            logic: 'AND',
            conditions: [
              { targetId: 'has_allergies', operator: 'equals', value: 'allergy-yes' }
            ]
          },
        },
      ],
    },
  },
  large: {
    label: '📊 Large Form (20 fields)',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Large Form',
      fields: Array.from({ length: 20 }, (_, i) => ({
        id: `field_${i + 1}`,
        fieldType: i % 3 === 0 ? 'text' : i % 3 === 1 ? 'radio' : 'checkbox',
        question: `Question ${i + 1}`,
        ...(i % 3 !== 0 && {
          options: [{ value: 'Option A' }, { value: 'Option B' }, { value: 'Option C' }],
        }),
      })),
    },
  },
  rating: {
    label: '⭐ Rating Scale',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Rating Form',
      fields: [
        {
          id: 'satisfaction',
          fieldType: 'rating',
          question: 'How satisfied are you with our service?',
          options: Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1) })),
        },
        {
          id: 'comments',
          fieldType: 'longtext',
          question: 'Additional comments?',
        },
      ],
    },
  },
  sections: {
    label: '📁 Nested Sections',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Sectioned Form',
      fields: [
        {
          id: 'section_personal',
          fieldType: 'section',
          title: 'Personal Information',
          fields: [
            { id: 'first_name', fieldType: 'text', question: 'First name' },
            { id: 'last_name', fieldType: 'text', question: 'Last name' },
          ],
        },
        {
          id: 'section_contact',
          fieldType: 'section',
          title: 'Contact Details',
          fields: [
            { id: 'phone', fieldType: 'text', inputType: 'tel', question: 'Phone number' },
            { id: 'address', fieldType: 'longtext', question: 'Address' },
          ],
        },
      ],
    },
  },
  checkbox: {
    label: '☑️ Multi-Select',
    schema: {
      schemaType: 'mieforms-v1.0',
      title: 'Multi-Select Form',
      fields: [
        {
          id: 'interests',
          fieldType: 'checkbox',
          question: 'Select your interests',
          options: [
            { value: 'Technology' },
            { value: 'Sports' },
            { value: 'Music' },
            { value: 'Travel' },
            { value: 'Food' },
          ],
        },
        {
          id: 'newsletter',
          fieldType: 'radio',
          question: 'Subscribe to newsletter?',
          options: [{ value: 'Yes' }, { value: 'No' }],
        },
      ],
    },
  },
};

export const PRESET_KEYS = Object.keys(PRESETS);
