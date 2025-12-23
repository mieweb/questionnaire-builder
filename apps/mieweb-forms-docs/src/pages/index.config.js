export const heroSection = {
  title: "MIE Forms",
  description: "A flexible, embeddable form builder and renderer for creating FHIR-compatible questionnaires. Build dynamic forms with real-time preview and generate standardized QuestionnaireResponse outputs."
};

export default function IndexConfigPage() {
  return null;
}

export const featuresSection = {
  badge: "Features",
  title: "Key Features",
  subtitle: "Everything you need to build powerful forms",
  items: [
    {
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      title: "Visual Form Builder",
      description: "Visual editor with code view for creating complex questionnaires with live preview"
    },
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "FHIR Compatible",
      description: "Generate standard FHIR QuestionnaireResponse outputs for healthcare interoperability"
    },
    {
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      title: "Embeddable Components",
      description: "React components ready to integrate into your existing applications"
    }
  ]
};

export const features = featuresSection.items;

export const interactiveDemoSection = {
  badge: "Interactive Demo",
  title: "Try It Live",
  subtitle: "Experience the forms renderer in action. Edit the JSON on the left and watch the form update instantly in real-time.",
  inputLabel: "Input",
  outputLabel: "Live Preview",
  formatSwitcher: {
    json: "JSON",
    yaml: "YAML"
  },
  errorMessage: "Invalid format"
};

export const quickStart = {
  badge: "Quick Start",
  title: "Quick Start",
  subtitle: "Get up and running in minutes. Choose the package you need:",
  copyButton: {
    copy: "Copy",
    copied: "Copied!",
    tooltip: "Copy to clipboard"
  },
  installCommands: [
    {
      package: "@mieweb/forms-editor",
      command: "npm install @mieweb/forms-editor",
      description: "For building and editing forms"
    },
    {
      package: "@mieweb/forms-renderer",
      command: "npm install @mieweb/forms-renderer",
      description: "For rendering forms and collecting responses"
    }
  ],
  guides: [
    {
      to: "/docs/getting-started/quickstart-editor",
      title: "Editor Integration",
      description: "Add the form builder to your app"
    },
    {
      to: "/docs/getting-started/quickstart-renderer",
      title: "Renderer Integration",
      description: "Display and collect form responses"
    }
  ]
};

export const packagesSection = {
  badge: "Packages",
  title: "NPM Packages",
  subtitle: "Install and start building in seconds",
  items: [
    {
      name: "@mieweb/forms-engine",
      url: "https://www.npmjs.com/package/@mieweb/forms-engine",
      description: "Core state management, field primitives, and logic utilities"
    },
    {
      name: "@mieweb/forms-editor",
      url: "https://www.npmjs.com/package/@mieweb/forms-editor",
      description: "Visual form builder with edit and preview modes"
    },
    {
      name: "@mieweb/forms-renderer",
      url: "https://www.npmjs.com/package/@mieweb/forms-renderer",
      description: "Form renderer producing FHIR QuestionnaireResponse output"
    }
  ]
};

export const packages = packagesSection.items;

export const resourcesSection = {
  badge: "Resources",
  title: "Resources",
  subtitle: "Get help and contribute",
  items: [
    {
      url: "https://github.com/mieweb/questionnaire-builder",
      title: "GitHub Repository",
      subtitle: "Source code and examples",
      icon: "github"
    },
    {
      url: "https://github.com/mieweb/questionnaire-builder/issues/new",
      title: "Report an Issue",
      subtitle: "Bug reports and feature requests",
      icon: "issue"
    }
  ]
};

export const resources = resourcesSection.items;

export const initialFormData = {
  "schemaType": "mieforms-v1.0",
  "title": "BMI Calculator with Conditional Advice",
  "description": "Test conditional visibility based on expression field results",
  "fields": [
    {
      "id": "weight",
      "fieldType": "text",
      "question": "Your Weight (lb)",
      "answer": "160",
      "required": true
    },
    {
      "id": "height",
      "fieldType": "text",
      "question": "Your Height (in)",
      "answer": "68",
      "required": true
    },
    {
      "id": "bmi",
      "fieldType": "expression",
      "label": "BMI (Body Mass Index)",
      "expression": "{weight} / ({height} * {height}) * (703)",
      "displayFormat": "number",
      "decimalPlaces": 1,
      "sampleDataFields": [
        {"fieldId": "weight", "value": "160"},
        {"fieldId": "height", "value": "68"}
      ],
      "answer": ""
    },
    {
      "id": "underweight_advice",
      "fieldType": "html",
      "htmlContent": "<div style='background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;'><h3 style='color: #92400e; margin-top: 0; display: flex; align-items: center;'><span style='font-size: 24px; margin-right: 8px;'>⚠️</span> Health Advisory - Underweight</h3><p style='color: #78350f; margin: 0;'>Your BMI indicates you may be underweight. Consider consulting a healthcare provider for nutritional advice.</p></div>",
      "iframeHeight": 180,
      "enableWhen": {
        "logic": "AND",
        "conditions": [
          {
            "targetId": "bmi",
            "operator": "lessThan",
            "value": "18.5"
          }
        ]
      }
    },
    {
      "id": "healthy_advice",
      "fieldType": "html",
      "htmlContent": "<div style='background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;'><h3 style='color: #065f46; margin-top: 0; display: flex; align-items: center;'><span style='font-size: 24px; margin-right: 8px;'>✅</span> Health Advisory - Healthy Weight</h3><p style='color: #047857; margin: 0;'>Your BMI is in the healthy range. Keep up your current lifestyle habits!</p></div>",
      "iframeHeight": 180,
      "enableWhen": {
        "logic": "AND",
        "conditions": [
          {
            "targetId": "bmi",
            "operator": "greaterThanOrEqual",
            "value": "18.5"
          },
          {
            "targetId": "bmi",
            "operator": "lessThan",
            "value": "25"
          }
        ]
      }
    },
    {
      "id": "overweight_advice",
      "fieldType": "html",
      "htmlContent": "<div style='background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;'><h3 style='color: #991b1b; margin-top: 0; display: flex; align-items: center;'><span style='font-size: 24px; margin-right: 8px;'>🔴</span> Health Advisory - Overweight</h3><p style='color: #7f1d1d; margin: 0;'>Your BMI indicates you may be overweight. Consider speaking with a healthcare provider about healthy weight management strategies.</p></div>",
      "iframeHeight": 195,
      "enableWhen": {
        "logic": "AND",
        "conditions": [
          {
            "targetId": "bmi",
            "operator": "greaterThanOrEqual",
            "value": "25"
          }
        ]
      }
    }
  ]
};
