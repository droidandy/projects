import React from "react";
import { action } from "@storybook/addon-actions";
import { text, boolean } from "@storybook/addon-knobs";
import CheckoutStepContact from ".";

export default {
  title: "Pages/CartCheckout/RU/Steps/2-Contact",
  component: CheckoutStepContact,
};

const actionsData = {
  onEmailUpdate: action("onEmailUpdate"),
  onAddressUpdate: action("onAddressUpdate"),
};

const emptyShippingAddress = {
  address1: "",
  address2: "",
  city: "",
  company: "",
  country: "",
  countryCode: "",
  firstName: "",
  lastName: "",
  phone: "",
  province: "",
  provinceCode: "",
  street: "",
  zip: "",
};

export const empty = (extraProps) => (
  <CheckoutStepContact
    acceptsMarketing={true}
    shippingAddress={emptyShippingAddress}
    {...actionsData}
  />
);

const addressBYData = {
  address1: "Stalinstreet 1",
  address2: "",
  city: "Minsk",
  company: "",
  countryCode: "BY",
  province: "",
  provinceCode: "",
  zip: "12345",
  firstName: "John",
  lastName: "Doe",
  phone: "1234567890",
  street: "",
};

export const BY = () => (
  <CheckoutStepContact
    email={"email@gmail.com"}
    isShippingRequired={true}
    acceptsMarketing={true}
    shippingAddress={addressBYData}
    {...actionsData}
  />
);

const addressRUData = {
  address1: "Stalinstreet 1",
  address2: "",
  city: "Москва",
  company: "",
  countryCode: "RU",
  provinceCode: "MOW",
  zip: "12345",
  firstName: "John",
  lastName: "Doe",
  phone: "1234567890",
  street: "",
};

export const RU = () => (
  <CheckoutStepContact
    email={text("email", "email@gmail.com")}
    isShippingRequired={true}
    acceptsMarketing={boolean("accepts Marketing", true)}
    shippingAddress={addressRUData}
    {...actionsData}
  />
);

export const RU_noProvince = () => (
  <CheckoutStepContact
    email={text("email", "email@gmail.com")}
    isShippingRequired={true}
    acceptsMarketing={boolean("accepts Marketing", true)}
    shippingAddress={{ ...addressRUData, provinceCode: null }}
    {...actionsData}
  />
);

export const RU_noValidZipCode = () => (
  <CheckoutStepContact
    {...actionsData}
    isShippingRequired
    isValidationMode
    shippingAddress={{
      ...addressRUData,
      zip: "1",
    }}
  />
);

/* 
export const DigitalProductNoShipping = () => (
  <CheckoutStepContact
    email={text("email", "email@gmail.com")}
    isShippingRequired={false}
    {...actionsData}
  />
);
 */

const errorForDigitalData = {
  ...actionsData,
  isShippingRequired: false,
  isValidationMode: true,
  shippingAddress: emptyShippingAddress,
};

export const ErrorForDigital = (extraProps) => (
  <CheckoutStepContact {...errorForDigitalData} />
);

const errorForPhysicalData = {
  ...errorForDigitalData,
  isShippingRequired: true,
};

export const ErrorForPhysical = (extraProps) => (
  <CheckoutStepContact {...errorForPhysicalData} />
);

const customerWithOnePreviousAddress = {
  id: 1,
  firstName: "Vasya",
  lastName: "Ivanov",
  email: "some@gmail.com",
  addresses: [{ ...addressBYData, id: 123 }],
  defaultAddressId: 123,
};

export const HasOnePreviousAddress = (props) => {
  return (
    <CheckoutStepContact
      isShippingRequired={true}
      shippingAddress={emptyShippingAddress}
      customer={customerWithOnePreviousAddress}
      {...actionsData}
      {...props}
    />
  );
};

const customerWithMultiplePreviousAddress = {
  ...customerWithOnePreviousAddress,
  addresses: [
    { ...addressBYData, id: 123 },
    { ...addressRUData, id: 1234 },
    {
      ...addressBYData,
      countryCode: "NL",
      city: "Amsterdam",
      zip: "1282MD",
      id: 1235,
    },
  ],
  defaultAddressId: 1235,
};

export const HasMultiplePreviousAddresses = (props) => {
  return (
    <CheckoutStepContact
      isShippingRequired={true}
      shippingAddress={emptyShippingAddress}
      customer={customerWithMultiplePreviousAddress}
      {...actionsData}
      {...props}
    />
  );
};

export const HasMultiplePreviousAddressesAndSelectedNotDefault = (props) => {
  return (
    <CheckoutStepContact
      isShippingRequired={true}
      shippingAddress={{ ...emptyShippingAddress, id: 123 }}
      customer={customerWithMultiplePreviousAddress}
      {...actionsData}
      {...props}
    />
  );
};

export const EnterNewAddress = (extraProps) => (
  <CheckoutStepContact
    isShippingRequired={true}
    isValidationMode={true}
    email={text("email", "aerase@gmail.com")}
    shippingAddress={emptyShippingAddress}
    {...actionsData}
    {...extraProps}
  />
);

export const HasCustomer = (props) => {
  console.log(props);
  /* store.dispatch(
    setCustomer({
      id: 1,
      addresses: [
        {
          id: 0,
          address1: "пр. Ленинский 138",
          country: "Россия",
          countryCode: "RU",
          last_name: "Иванов",
          first_name: "Иван",
        },
        {
          id: 2,
          address1: "пр. Ленинский 138",
          country: "Россия",
          countryCode: "RU",
          last_name: "Иванов",
          first_name: "Иван",
        },
      ],
    }) 
  );*/

  return (
    <CheckoutStepContact
      isShippingRequired={true}
      isValidationMode={true}
      email={text("email", "aerase@gmail.com")}
      shippingAddress={emptyShippingAddress}
      {...actionsData}
      {...props}
    />
  );
};
