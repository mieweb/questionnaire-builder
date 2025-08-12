
---

# 📝 Questionnaire Builder


🔗 [questionnnaire-demo](https://questionnaire-builder-beige.vercel.app/)

A modular, FHIR-compatible questionnaire builder built with **React**, **Tailwind CSS**, and **Framer Motion**.
Supports custom field types, conditional visibility with `enableWhen` logic, and exporting to the [FHIR Questionnaire](https://hl7.org/fhir/questionnaire.html) format.

---

## 🚀 Features

* Add, edit, and delete multiple field types (input, radio, checkbox, dropdown).
* Modular `fieldTypes` configuration for easy extension.
* Conditional field visibility via `enableWhen` logic.
* Mobile-friendly toolbar with preview mode toggle.
* JSON import/export.
* Export to **FHIR Questionnaire JSON**.

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/lattln/questionnaire-builder.git

cd questionnaire-builder

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 📂 Project Structure

```
src/
  components/
    fields/
      basic_field/
        TextInput_Field.jsx
        Radio_Field.jsx
        Check_Field.jsx
        DropDown_Field.jsx
      fieldTypes-config.js    # Modular field type definitions
    EnableWhenLogic.jsx       # Conditional logic editor
    FormBuilderMain.jsx
    Header.jsx
    MobileToolBar.jsx
  utils/
    initializedFieldOptions.js
    visibilityChecker.js
  toFHIR.js                   # FHIR export logic
```

---

## ⚙️ Modular Field Types

The `fieldTypes-config.js` file defines all supported field types in one place:

```js
const fieldTypes = {
  input: {
    label: "Input Field",
    component: InputField,
    defaultProps: { fieldType: "input", question: "", answer: "" },
  },
  radio: {
    label: "Radio Field",
    component: RadioField,
    defaultProps: {
      fieldType: "radio",
      question: "",
      options: ["", "", ""],
      selected: null,
    },
  },
  // ...other types
}
```

Each field type has:

* **label** → Name displayed in the toolbar.
* **component** → React component used for rendering.
* **defaultProps** → Initial values when the field is added.

---

## 🛠 Adding Your Own Field Type
```
* Guide TBA
```
---
