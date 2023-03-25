import React from "react";

const DefaultInput = ({
  trimValue,
  onChange,
  value,
  className,
  placeholder,
  id,
  type,
  name,
  required
}) => {
  const handleOnChange = (event) => {
    if (trimValue) {
      event.target.value = event.target.value.trim();
      onChange(event);
      return;
    }
    onChange(event);
  };

  return (
      <>
        <input style={{ zIndex: 0, opacity: 0, position: "absolute"}} type="text" name="email" />
        <input
            onChange={handleOnChange}
            value={value}
            className={className}
            placeholder={placeholder}
            id={id}
            type={type}
            name={name}
            required={required}
            autoComplete="product-search-text"

        />
      </>
  );
};

export default DefaultInput;
