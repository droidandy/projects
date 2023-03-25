import React, { ChangeEvent, FC, FocusEventHandler, useCallback, useMemo } from 'react';
import { FormControl, FormHelperText, SvgIcon, InputLabel, MenuList, Select } from '@material-ui/core';
import { ComponentProps } from '@marketplace/ui-kit/types';
import { useToggle, useBreakpoints } from '@marketplace/ui-kit/hooks';
import { ReactComponent as ArrowDown } from '@marketplace/ui-kit/icons/arrow-down';
import { ReactComponent as IconCheckList } from '@marketplace/ui-kit/icons/icon-check-list';
import { MobileModalContent, MobileModalDrawer, MobileModalHeader } from 'components/MobileModalLayout';
import Option, { OptionSelected } from 'components/Option';

import { useStyles } from './Select.styles';

export type SelectChangeEvent = ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

export interface Props extends ComponentProps {
  placeholder?: string;
  name: string;
  value?: string | number | null;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  fullWidth?: boolean;
  disabled?: boolean;
  onChange: (event: SelectChangeEvent, child: React.ReactNode) => void;
  onBlur?: FocusEventHandler<HTMLElement>;
}

interface SelectOptionComponentProps {
  selected: SelectOption | undefined;
  option: SelectOption;
  onClear: () => void;
  onOptionClick: (option: SelectOption) => void;
}

const IconDown = (props: Object) => (
  <SvgIcon viewBox="0 0 20 20" component={ArrowDown} style={{ width: '1.25rem', height: '1.25rem' }} {...props} />
);

const MobileSelectOptionComponent = ({ selected, option, onClear, onOptionClick }: SelectOptionComponentProps) => {
  const s = useStyles();

  if (selected === option) {
    return (
      <>
        <OptionSelected key={option.value} icon={IconCheckList} onClick={onClear} className={s.optionModalItem}>
          {option.label}
        </OptionSelected>
      </>
    );
  }

  return (
    <>
      <Option value={option.value} onClick={() => onOptionClick(option)} className={s.optionModalItem}>
        <span>{option.label}</span>
      </Option>
    </>
  );
};

const SelectWithLabel: FC<Props> = ({
  placeholder,
  name,
  value,
  options,
  error = false,
  helperText,
  fullWidth = false,
  variant,
  disabled,
  className,
  onChange,
  onBlur,
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const [open, openActions] = useToggle();
  const shrink = value !== undefined && value !== null && value !== '';

  const selected = useMemo(() => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return options.find((option) => option.value === value);
  }, [value, options]);

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { name, value: null } } as SelectChangeEvent, null);
    }
    openActions.handleClose();
  };

  const handleMobileOptionClick = (option: SelectOption) => {
    openActions.handleClose();
    onChange({ target: { name, value: option.value } } as SelectChangeEvent, '');
  };

  const openSelect = useCallback(() => {
    if (!disabled) {
      openActions.handleToggle();
    }
  }, [disabled, openActions.handleToggle]);

  return (
    <>
      <FormControl error={error} className={className} variant={variant} fullWidth={fullWidth}>
        <InputLabel shrink={shrink} id={name} disabled={disabled} onClick={openSelect}>
          {placeholder}
        </InputLabel>
        <Select
          open={open && !isMobile}
          labelId={name}
          name={name}
          onChange={onChange}
          onBlur={!open ? onBlur : () => {}}
          onOpen={openActions.handleOpen}
          onClose={openActions.handleClose}
          value={value}
          IconComponent={IconDown}
          disabled={disabled}
        >
          {!!selected ? (
            <OptionSelected key={selected.value} onClick={handleClear} className={s.optionItem}>
              {selected.label}
            </OptionSelected>
          ) : null}

          {options.map((option) => (
            <Option key={option.value} value={option.value} className={s.optionItem}>
              {option.label}
            </Option>
          ))}
        </Select>
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
      {isMobile ? (
        <MobileModalDrawer open={open} onClose={openActions.handleClose}>
          <MobileModalHeader onClose={openActions.handleClose}>{placeholder}</MobileModalHeader>
          <MobileModalContent>
            <MenuList className={s.optionsList}>
              {options.map((option) => (
                <MobileSelectOptionComponent
                  key={option.value}
                  option={option}
                  selected={selected}
                  onClear={handleClear}
                  onOptionClick={handleMobileOptionClick}
                />
              ))}
            </MenuList>
          </MobileModalContent>
        </MobileModalDrawer>
      ) : null}
    </>
  );
};

export default SelectWithLabel;
