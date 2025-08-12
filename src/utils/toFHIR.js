const toFHIR = (formData) => {
  const questionnaire = {
    resourceType: "Questionnaire",
    status: "draft",
    item: formData.map((field) => {
      const item = {
        linkId: field.id,
        text: field.question,
        type: "string",
        answerOption: [],
        extension: [],
      }


      switch (field.fieldType) {
        case "input":
          item.type = "string"
          break

        case "radio":
          item.type = "choice"
          item.answerOption = field.options.map(option => ({
            valueCoding: {
              code: option.id,
              display: option.value
            }
          }))
          break

        case "check":
          item.type = "choice"
          item.answerOption = field.options.map(option => ({
            valueCoding: {
              code: option.id,
              display: option.value
            }
          }))
          break

        case "selection":
          item.type = "choice"
          item.answerOption = field.options.map(option => ({
            valueCoding: {
              code: option.id,
              display: option.value
            }
          }))
          break

        default:
          break
      }

      if (field.sublabel) {
        item.extension.push({
          url: "http://helsenorge.no/fhir/StructureDefinition/sdf-sublabel",
          valueMarkdown: field.sublabel,
        })
      }

      return item
    }),
  }

  return questionnaire
}
