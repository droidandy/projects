import * as Router from "@Core/app/router";

export default function(
  props = {
    email,
    password,
    returnURL: Router.getURLForPage("PAGE_CUSTOMER_ACCOUNT"),
  }
) {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", Router.getURLForPage("PAGE_CUSTOMER_LOGIN"));

  const formTypeField = document.createElement("input");
  formTypeField.setAttribute("hidden", true);
  formTypeField.setAttribute("name", "form_type");
  formTypeField.setAttribute("value", "customer_login");
  form.appendChild(formTypeField);

  const formFieldsMapping = {
    email: "customer[email]",
    password: "customer[password]",
    returnURL: "return_url",
  };

  Object.keys(formFieldsMapping).map((key) => {
    const field = document.createElement("input");
    field.setAttribute("hidden", true);
    field.setAttribute("name", formFieldsMapping[key]);
    field.setAttribute("value", props[key]);
    form.appendChild(field);
  });

  document.body.appendChild(form);
  return form.submit();
}
