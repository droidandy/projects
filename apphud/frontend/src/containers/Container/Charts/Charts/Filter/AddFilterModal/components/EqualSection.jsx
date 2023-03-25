import React, { useState } from 'react';
import sortBy from 'lodash/sortBy';
import Input from 'components/Input';
import Select from '../../Select';
import CustomSelect from "containers/Common/CustomSelect";

const EqualSection = ({ selectedFilter, fields, setFields, filterArr }) => {
  const [condition, setCondition] = useState(selectedFilter?.conditions[0] || {});
  const handleOnChangeSelect = (i) => (field) => {
    const copyArr = [...fields, {value: '', condition: condition?.value}];

    if (i === 5) return;

    copyArr[i] = { value: field?.value, condition: condition?.value };
    setFields(copyArr);
  };

  const handleOnChangeInput = (i) => ({ value }) => {
    if (i === 5) return;

    const field = { value, label: value };

    let copyArr = [...fields];

    if (!fields[i + 1].value && fields[i + 1].value !== '') {
      copyArr = [...fields, {value: '', condition: condition?.value}];
    }

    copyArr[i] = field;
    setFields(copyArr);
  };

  const isSearchableInput = selectedFilter?.value === 'customer_app_store_country' || selectedFilter?.value == 'customer_country'

  if (selectedFilter && !selectedFilter.values) {
    return fields.map((field, index) => {
      const label = index === 0 ? (
        <CustomSelect
          value={condition}
          onChange={v => {
            setCondition(v);
            setFields(fields.map(i => ({...i, condition: v.value})));
          }}
          options={selectedFilter?.conditions || []}
          className="custom-select_timezone"
          id="timezone"
          labelKey="label"
          valueKey="value"
        />
      ) : 'Or'
      return (
        <div className="input-wrapper" key={index}>
          <div>
            <div
              className={`chart-equal__wrapper-input`}
            >
              <Input
                disabled={!selectedFilter}
                onChange={handleOnChangeInput(index)}
                value={field?.label}
                label={
                  <label className="l-p__label">
                    {label}
                  </label>
                }
                placeholder={'Write...'}
                className='chart-equal__input'
              />
              {index > 0 && (
                <button
                  onClick={() => setFields(fields.filter((el) => el?.value !== field?.value))}
                  className="button button_red pushrules-content__row-column-3__button chart-equal__delete-row-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 3V2H6V3H2V5H14V3H10Z" fill="white" />
                    <path
                      d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                      fill="white"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

  return fields.map((e, i) => {
    const label = i === 0 ? (
      <CustomSelect
        value={condition}
        onChange={v => {
          setCondition(v);
          setFields(fields.map(i => ({...i, condition: v.value})));
        }}
        options={selectedFilter?.conditions || []}
        className="custom-select_timezone"
        id="timezone"
        labelKey="label"
        valueKey="value"
      />
    ) : 'Or'
    return (
      <div className="input-wrapper" key={i}>
        <label className="l-p__label">
          {label}
        </label>
        <div>
          <div
            className={`chart-equal__wrapper ${
              i === 0 && 'chart-equal__wrapper_100'
            }`}
          >
            <Select
              maxMenuHeight={190}
              value={e?.value?.value}
              onChange={handleOnChangeSelect(i)}
              isSearchable={isSearchableInput}
              autoFocus={false}
              clearable={false}
              options={sortBy(filterArr(selectedFilter?.values), 'label')}
            />
          </div>
          {i > 0 && (
            <button
              onClick={() => setFields(fields.filter((el) => el?.value !== e?.value))}
              className="button button_red pushrules-content__row-column-3__button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 3V2H6V3H2V5H14V3H10Z" fill="white" />
                <path
                  d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                  fill="white"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  });
};

export default EqualSection;
