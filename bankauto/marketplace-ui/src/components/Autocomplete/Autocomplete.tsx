import React, { useCallback, useMemo, useState } from 'react';
import { AutocompleteOption, AutocompleteProps, AutocompleteValue } from './types';
import AutocompleteRoot from './AutocompleteRoot';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';

const Autocomplete = <Multiple extends boolean | undefined>({
  value,
  multiple,
  options,
  ...rest
}: AutocompleteProps<Multiple>) => {
  const getOptionSelected = useCallback((option, valueItem) => option.value === valueItem.value, []);
  const getOptionLabel = useCallback((option) => option.label || '', []);

  const optionsTree = useMemo(
    () => (!options.length ? null : Object.fromEntries(options.map((item) => [item.value, item]))),
    [options],
  );

  const prepareValue = useMemo(() => {
    if (value && optionsTree && Array.isArray(value) && value.length) {
      return value.map((item) => optionsTree[item.value]);
    }
    return value;
  }, [optionsTree, value]) as AutocompleteValue<Multiple, AutocompleteOption<any>> | undefined;

  return (
    <AutocompleteRoot
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      {...rest}
      value={prepareValue}
      multiple={multiple}
      options={options}
    />
  );
};

interface AsyncAutocompleteProps {
  loadOptions: (query: string) => Promise<AutocompleteOption[]>;
}

export const AsyncAutocomplete = <Multiple extends boolean | undefined>({
  loadOptions,
  ...rest
}: AsyncAutocompleteProps & Omit<AutocompleteProps<Multiple>, 'options' | 'loading' | 'onInputChange'>) => {
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

  const onInputChange = useCallback((event, value) => {
    setQuery(value);
  }, []);

  return <Autocomplete {...rest} options={options} loading={isLoading} onInputChange={onInputChange} />;
};

export default Autocomplete;
