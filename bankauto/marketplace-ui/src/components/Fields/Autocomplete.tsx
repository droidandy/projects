import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Autocomplete as BaseAutocomplete } from '@marketplace/ui-kit';
import { FieldProps, Field, useField } from 'react-final-form';
import { FieldsetContext } from './Fieldset';

type AsyncAutocompleteProps = {
  loadOptions: (query: string) => Promise<any>;
};

const Autocomplete: FC<FieldProps<any, any> & any> = ({ name, multiple, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  return (
    <Field name={name} {...rest}>
      {({ input, meta }) => {
        const empty = multiple ? [] : input.value;
        const value = multiple && ['array', 'object'].includes(typeof input.value) ? input.value : empty;
        return (
          <BaseAutocomplete
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={value}
            handleBlur={input.onBlur}
            handleChange={input.onChange}
            onChange={(_, value) => input.onChange(value)}
            multiple={multiple}
            disabled={isDisabledFromFieldset}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

const AsyncAutocomplete: FC<AsyncAutocompleteProps & any> = ({ loadOptions, name, ...rest }) => {
  const { input, meta } = useField(name);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    loadOptions(query)
      .then((response: any) => (isSubscribed ? setOptions(response) : null))
      .catch(() => (isSubscribed ? setOptions([]) : null))
      .finally(() => (isSubscribed ? setLoading(false) : null));

    return () => {
      isSubscribed = false;
      setLoading(false);
    };
  }, [loadOptions, query]);

  const onInputChange = useCallback((event, value) => {
    setQuery(value);
  }, []);

  const onChange = useCallback(
    (_, value) => {
      input.onChange(value);
    },
    [input],
  );

  return (
    <BaseAutocomplete
      {...rest}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
      name={input.name}
      value={input.value}
      onChange={onChange}
      handleBlur={input.onBlur}
      options={options}
      loading={isLoading}
      onInputChange={onInputChange}
    />
  );
};

export default Autocomplete;

export { AsyncAutocomplete };
