const formFieldsMapping = {
  name: "contact[name]",
  email: "contact[email]",
  phone: "contact[phone]",
  message: "contact[body]",
};

export default (props) => {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/contact");

  const formTypeField = document.createElement("input");
  formTypeField.setAttribute("hidden", true);
  formTypeField.setAttribute("name", "form_type");
  formTypeField.setAttribute("value", "contact");
  form.appendChild(formTypeField);

  Object.keys(formFieldsMapping).map((argument) => {
    const field = document.createElement("input");
    field.setAttribute("hidden", true);
    field.setAttribute("name", formFieldsMapping[argument]);
    field.setAttribute("value", props[argument]);
    form.appendChild(field);
  });

  document.body.appendChild(form);
  form.submit();
};
