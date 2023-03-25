import * as StorefrontCustomerRecover from "@Core/api/shopify.storefront/customer.recoverPassword";

export default async (email) => {
  return StorefrontCustomerRecover.default(email)
    .then((response) => {
      if (!response || !response.data)
        throw "Storefront Customer Create response is incorect";

      //lang set for customer via storefront tags
      return response;
    })
    .then(selectErrorsFromResponse);
};

const selectErrorsFromResponse = (
  response: StorefrontCustomerRecover.StorefrontCustomerMutationRecoverPassword
) => {
  return response &&
    response.data &&
    response.data.customerRecover &&
    Array.isArray(response.data.customerRecover.customerUserErrors)
    ? response.data.customerRecover.customerUserErrors
    : [];
};
/* 
export default (email) => {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/account/recover");

  const formTypeField = document.createElement("input");
  formTypeField.setAttribute("hidden", true);
  formTypeField.setAttribute("name", "form_type");
  formTypeField.setAttribute("value", "recover_customer_password");
  form.appendChild(formTypeField);

  const field = document.createElement("input");
  field.setAttribute("hidden", true);
  field.setAttribute("name", "email");
  field.setAttribute("value", email);
  form.appendChild(field);

  document.body.appendChild(form);
  return form.submit();
}; */
