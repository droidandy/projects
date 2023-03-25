import React from 'react';
import Select, { components } from 'react-select';

const groupStyles = {
  background: '#fff',
};

const { Option } = components;
const IconOption = (props) => {
  return (
    <Option {...props}>
      {props.selectProps.getOptionLabel(props.data)}
      {props.isSelected && (
        <svg
          className="input-select__option-icon"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 4L5.5 8.5L13 1" stroke="#0085FF" strokeWidth="2" />
        </svg>
      )}
    </Option>
  );
};

const Group = (props) => (
  <div style={groupStyles}>
    <components.Group {...props} />
  </div>
);

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 7L8 3L12 7H4Z" fill="#0085FF" />
          <path d="M4 9L8 13L12 9H4Z" fill="#0085FF" />
        </svg>
      </components.DropdownIndicator>
    )
  );
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    {/* <span style={groupBadgeStyles}>{data.options.length}</span> */}
  </div>
);

export default ({ defaultValue = '',  bottomText = null, isGroup, options, ...rest }) => (
    <>
        <Select
            defaultValue={defaultValue}
            options={options}
            formatGroupLabel={formatGroupLabel}
            classNamePrefix="input-select"
            className="input-select input-select_blue"
            components={{
                Group: isGroup ? Group : null,
                DropdownIndicator,
                IndicatorSeparator: () => null,
                Option: IconOption
            }}
            {...rest}
        />
        {bottomText && (
            <div className="input-wrapper__bottom-text">{bottomText}</div>
        )}
    </>
);
