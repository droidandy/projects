import React, { useMemo, useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import useAutocomplete, { AutocompleteCloseReason } from '@material-ui/lab/useAutocomplete';
import { FormControl, FormHelperText, Input, OutlinedInput, InputLabel } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { StyledProps } from '@marketplace/ui-kit/types';
import { Paper, Divider, Typography, Icon, IconButton } from '@marketplace/ui-kit/components';
import { useBreakpoints } from '@marketplace/ui-kit/hooks';
import { ReactComponent as IconDown } from '@marketplace/ui-kit/icons/arrow-down';
import cx from 'classnames';
import Options from './Options';
import { TagsHook } from './Tags';
import { AutocompleteValue, AutocompleteRootProps, AutocompleteSolo } from './types';
import AutocompleteModal from './AutocompleteModal';
import { LOADING_TEXT } from './constants';
import { useStyles, useEndAdornmentStyles } from './Autocomplete.styles';

const AutocompleteRoot = <T extends boolean | undefined, Option>(
  props: AutocompleteRootProps<T, Option> & StyledProps,
) => {
  const {
    placeholder,
    name,
    multiple,
    helperText,
    area,
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
    onInputChange: onInputChangeProp,
    handleBlur,
    handleFocus,
    variant = 'standard',
    className,
    fullWidth = false,
    renderOption,
  } = props;
  const s = useStyles();
  const endAdornmentClasses = useEndAdornmentStyles();
  const { isMobile } = useBreakpoints();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [valueState, setValueState] = useState<AutocompleteValue<T, Option>>(
    valueProp || ((multiple ? [] : null) as AutocompleteValue<T, Option>),
  );
  useEffect(() => {
    setValueState(valueProp === undefined ? ((multiple ? [] : null) as AutocompleteValue<T, Option>) : valueProp);
  }, [setValueState, valueProp]);

  const [inputValueState, setInputValueState] = useState(inputValueProp);
  const onInputChange = (event: ChangeEvent<{}>, val: string, reason: any) => {
    setInputValueState(val);
    if (onInputChangeProp) {
      onInputChangeProp(event, val, reason);
    }
  };
  // последнее состояние перед открытием модалки (для отмены выбора)
  const [state, setState] = useState<{
    value?: AutocompleteValue<T, Option>;
    inputValue?: string;
  }>({ value: valueProp, inputValue: inputValueProp });

  const handleClose = (event: React.ChangeEvent<{}>, reason?: AutocompleteCloseReason) => {
    if (isMobile) {
      // сбрасываем на значения до открытия модалки
      if (onChange) {
        const v = state.value || ((multiple ? [] : null) as AutocompleteValue<T, Option>);
        onChange({} as ChangeEvent<{}>, v, 'blur');
      }
    }
    if (reason && reason === 'blur') {
      return;
    }
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (!disabled) {
      setState({ ...state, value: valueProp, inputValue: inputValueProp });
      setOpen(true);
    }
  };

  const handleClear = useCallback(() => {
    const v = (multiple ? [] : null) as AutocompleteValue<T, Option>;
    if (onChange) {
      onChange({} as ChangeEvent<{}>, v, 'blur');
    }
  }, [multiple, onChange]);

  const getOptionSelected = useMemo(
    () => getOptionSelectedProp || ((option: Option, value: Option) => option === value),
    [getOptionSelectedProp],
  );

  const id = useMemo(() => `autocomplete-${name}`, [name]);
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    value: valueHook,
  } = useAutocomplete({
    id,
    disableClearable: false,
    freeSolo: false,
    value: valueState,
    inputValue: inputValueState,
    multiple,
    options,
    open,
    onOpen: handleOpen,
    onClose: handleClose,
    filterOptions,
    onChange,
    onInputChange,
    getOptionLabel,
    getOptionSelected,
    disableCloseOnSelect: multiple,
    blurOnSelect: true,
  });
  const value = useMemo<AutocompleteValue<T, Option>>(() => valueHook as AutocompleteValue<T, Option>, [valueHook]);

  // prepare options props
  const valuesArray = useMemo<Option[]>(() => {
    if (value) {
      return Array.isArray(value) ? (value as Option[]) : [value as Option];
    }
    return [] as Option[];
  }, [value]);

  const valueSolo = useMemo<AutocompleteSolo<Option>>(() => {
    let autocompleteSolo: AutocompleteSolo<Option> = {
      option: undefined,
      countOther: 0,
    };
    if (valueProp) {
      if (Array.isArray(valueProp)) {
        autocompleteSolo = { option: valueProp[0] || undefined, countOther: valueProp.length - 1 };
      } else {
        autocompleteSolo = { option: valueProp as Option, countOther: 0 };
      }
    }
    return autocompleteSolo;
  }, [valueProp]);

  // prepare input props
  const rootProps = useMemo<any>(() => getRootProps(), [getRootProps]);
  const { ref: inputRef, ...inputProps } = useMemo<any>(() => getInputProps(), [getInputProps]);

  const onBlur = useCallback(
    (e: any) => {
      if (!isMobile) {
        inputProps.onBlur(e);
      }
      if (handleBlur && !open) {
        handleBlur(e);
      }
    },
    [isMobile, inputProps, handleBlur, open],
  );

  const onFocus = useCallback(
    () => (e: any) => {
      if (!isMobile) {
        inputProps.onFocus(e);
      }
      if (handleFocus) {
        handleFocus(e);
      }
    },
    [isMobile, inputProps, handleFocus],
  );

  const startAdornment = useMemo(() => {
    if (valueSolo.option && multiple) {
      return (
        <TagsHook
          label={getOptionLabel(valueSolo.option)}
          suffix={valueSolo.countOther ? `+${valueSolo.countOther}` : undefined}
        />
      );
    }
    return null;
  }, [valueSolo, focused]);

  const endAdornment = useMemo(
    () => (
      <IconButton
        classes={endAdornmentClasses}
        className={cx({ [endAdornmentClasses.opened]: open })}
        style={{ padding: 0 }}
      >
        <Icon viewBox="0 0 20 20" component={IconDown} style={{ width: '1.25rem', height: '1.25rem' }} />
      </IconButton>
    ),
    [open, isMobile],
  );

  return (
    <>
      <ClickAwayListener
        onClickAway={(e) => {
          if (!isMobile) {
            handleClose(e);
            if (inputRef) {
              inputRef.current.blur();
            }
          }
        }}
      >
        <FormControl
          {...rootProps}
          className={`${s.root} ${className}`}
          error={error}
          ref={anchorRef}
          area={area}
          variant={variant}
          fullWidth={fullWidth}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          <InputLabel shrink={focused || !!valueSolo.option} disabled={disabled}>
            {placeholder}
          </InputLabel>
          {variant === 'outlined' ? (
            <OutlinedInput
              fullWidth={fullWidth}
              name={name}
              value={value}
              onChange={onChange}
              inputRef={inputRef}
              startAdornment={startAdornment}
              endAdornment={endAdornment}
              disabled={disabled}
              {...inputProps}
            />
          ) : (
            <Input
              fullWidth={fullWidth}
              name={name}
              value={value}
              onChange={onChange}
              inputRef={inputRef}
              startAdornment={startAdornment}
              endAdornment={endAdornment}
              disabled={disabled}
              {...inputProps}
            />
          )}
          <Popper
            {...getListboxProps()}
            anchorEl={anchorRef.current}
            open={!isMobile && open}
            transition
            className={s.paper}
          >
            {({ TransitionProps: transitionProps, placement }) => (
              <>
                {placement === 'bottom' && <Divider />}
                <Paper
                  {...transitionProps}
                  className={s.listbox}
                  style={{
                    width: anchorRef.current?.offsetWidth || 'auto',
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
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
                      optionClassName={s.optionItemPlain}
                      renderOption={renderOption}
                    />
                  ) : (
                    <Typography variant="body1" className={s.loadingText}>
                      {LOADING_TEXT}
                    </Typography>
                  )}
                </Paper>
                {placement !== 'bottom' && <Divider />}
              </>
            )}
          </Popper>
          {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
      </ClickAwayListener>
      <AutocompleteModal
        {...props}
        open={isMobile && open}
        onClose={(event) => handleClose(event)}
        onApply={handleApply}
      />
    </>
  );
};

export default AutocompleteRoot;
