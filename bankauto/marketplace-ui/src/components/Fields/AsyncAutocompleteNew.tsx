import React, { FC, useCallback, useState } from 'react';
import { useField } from 'react-final-form';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';
import debounce from 'lodash/debounce';
import { AutocompleteOption } from 'components/Autocomplete';
import BaseAutocomplete from '../Autocomplete/Autocomplete';

interface AsyncAutocompleteProps {
  loadOptions: (query: string) => Promise<AutocompleteOption[]>;
}

const AsyncAutocompleteNew: FC<AsyncAutocompleteProps & any> = ({ loadOptions, name, onBlur, ...rest }) => {
  const { input, meta } = useField(name);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isLoading, setLoading] = useState(false);

  useLayoutEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    loadOptions(query)
      .then((response: AutocompleteOption[]) => (isSubscribed ? setOptions(response) : null))
      .catch(() => (isSubscribed ? setOptions([]) : null))
      .finally(() => (isSubscribed ? setLoading(false) : null));

    return () => {
      isSubscribed = false;
      setLoading(false);
    };
  }, [loadOptions, query]);

  const onInputChange = debounce((event, value) => {
    setQuery(value);
  }, 500);

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
      handleBlur={() => {
        onBlur?.();
        input.onBlur();
      }}
      options={options}
      loading={isLoading}
      onInputChange={onInputChange}
    />
  );
};

export default AsyncAutocompleteNew;
