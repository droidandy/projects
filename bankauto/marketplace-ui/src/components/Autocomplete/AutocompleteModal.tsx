import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { FormControl } from '@material-ui/core';
import { Button, Grid, Input, Typography } from '@marketplace/ui-kit';
import { ReactComponent as IconSearch } from 'icons/iconSearch.svg';
import {
  MobileModalContent,
  MobileModalDrawer,
  MobileModalFooter,
  MobileModalHeader,
  MobileModalProps,
} from 'components/MobileModalLayout';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';
import Options from './Options';
import { AutocompleteRootProps, AutocompleteValue } from './types';
import { useSearchInputStyles, useStyles } from './Autocomplete.styles';
import { LOADING_TEXT } from './constants';

interface Props<Multiple extends boolean | undefined, Option>
  extends AutocompleteRootProps<Multiple, Option>,
    MobileModalProps {
  onApply: () => void;
}

const AutocompleteModal = <T extends boolean | undefined, Option>({
  open,
  onClose,
  onApply,
  placeholder,
  name,
  multiple,
  helperText,
  loading,
  error,
  value: valueProp,
  inputValue: inputValueProp,
  options,
  disabled,
  getOptionLabel,
  getOptionSelected: getOptionSelectedProp,
  filterOptions,
  onChange,
  onInputChange,
}: Props<T, Option>) => {
  const s = useStyles();
  const searchInputClasses = useSearchInputStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [openHok, setOpenHok] = useState<boolean>(false);
  const [valueState, setValueState] = useState<AutocompleteValue<T, Option>>(
    valueProp || ((multiple ? [] : null) as AutocompleteValue<T, Option>),
  );

  useEffect(() => {
    setValueState(valueProp === undefined ? ((multiple ? [] : null) as AutocompleteValue<T, Option>) : valueProp);
  }, [setValueState, valueProp]);
  const getOptionSelected = useMemo(
    () => getOptionSelectedProp || ((option: Option, value: Option) => option === value),
    [getOptionSelectedProp],
  );
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: valueHook,
  } = useAutocomplete({
    id: `autocomplete-${name}-modal`,
    disableClearable: false,
    freeSolo: false,
    value: valueState,
    inputValue: inputValueProp,
    multiple,
    options,
    getOptionSelected,
    filterOptions,
    onChange,
    onInputChange,
    getOptionLabel,
    disableCloseOnSelect: multiple,
    open: openHok,
  });
  const value = useMemo<AutocompleteValue<T, Option>>(() => valueHook as AutocompleteValue<T, Option>, [valueHook]);

  // prepare options props
  const valuesArray = useMemo<Option[]>(() => {
    if (value) {
      return Array.isArray(value) ? (value as Option[]) : [value as Option];
    }
    return [] as Option[];
  }, [value]);

  // prepare input props
  const rootProps = useMemo<any>(() => getRootProps(), [getRootProps]);
  const { ref: inputRef, ...inputProps } = useMemo<any>(() => getInputProps(), [getInputProps]);

  // костыль для рефа, не удалять. (должно открываться только при наличии рефа на инпуте, иначе выдает ошибку)
  useLayoutEffect(() => {
    setOpenHok(open);
  }, [setOpenHok, open, getInputProps]);

  const handleClear = () => {
    const v = (multiple ? [] : null) as AutocompleteValue<T, Option>;
    if (onChange) {
      onChange({} as ChangeEvent<{}>, v, 'blur');
    }
  };

  return (
    <MobileModalDrawer open={open} onClose={onClose}>
      <MobileModalHeader onClose={onClose}>{placeholder}</MobileModalHeader>
      <MobileModalContent>
        <FormControl {...rootProps} onClick={undefined} error={error} ref={anchorRef}>
          <Input
            className={s.searchInput}
            label={null}
            inputRef={inputRef}
            InputProps={{
              placeholder: 'Поиск',
              classes: searchInputClasses,
              startAdornment: <IconSearch viewBox="0 0 24 24" />,
            }}
            {...inputProps}
            onBlur={undefined}
            {...{ name, error, disabled }}
          />
          <div {...getListboxProps()}>
            {!loading ? (
              <Options
                values={valuesArray}
                options={options}
                groupedOptions={groupedOptions}
                getOptionLabel={getOptionLabel}
                getOptionProps={getOptionProps}
                getOptionSelected={getOptionSelected}
                onClear={handleClear}
                multiple={multiple}
                optionClassName={s.optionItemModal}
              />
            ) : (
              <Typography variant="body1" className={s.loadingText}>
                {LOADING_TEXT}
              </Typography>
            )}
          </div>
        </FormControl>
      </MobileModalContent>
      <MobileModalFooter>
        <Grid container direction="column" alignItems="center">
          {helperText && (
            <Grid item>
              <Typography variant="body1" color="primary">
                {helperText}
              </Typography>
            </Grid>
          )}
          <Grid item className={s.applyButton}>
            <Button variant="contained" onClick={onApply} fullWidth color="primary" size="large">
              <Typography variant="h5" component="span">
                Применить
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </MobileModalFooter>
    </MobileModalDrawer>
  );
};

export default AutocompleteModal;
