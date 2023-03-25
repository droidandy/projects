import { ChangeEvent, FocusEventHandler } from 'react';
import { AutocompleteChangeReason, AutocompleteInputChangeReason } from '@material-ui/lab';

export type AutocompleteOption<Value extends any = any> = {
  label?: string;
  value: Value;
  hint?: string;
};

export type AutocompleteSolo<Option = AutocompleteOption> = {
  option?: Option;
  countOther: number;
};

export type AutocompleteValue<Multiple, Option = AutocompleteOption> = Multiple extends undefined | false
  ? Option | null
  : Array<Option>;

export interface AutocompleteRootProps<Multiple extends boolean | undefined, Option = AutocompleteOption> {
  name: string;
  options: Option[];
  area?: string;
  placeholder?: string;
  multiple?: Multiple;
  helperText?: string;
  error?: boolean;
  value?: AutocompleteValue<Multiple, Option>;
  inputValue?: string;
  loading?: boolean;
  disabled?: boolean;
  getOptionLabel: (option: Option) => string;
  getOptionSelected: (option: Option, value: Option) => boolean;
  filterOptions?: (options: Option[]) => Option[];
  onChange?: (
    event: ChangeEvent<{}>,
    value: AutocompleteValue<Multiple, Option>,
    reason: AutocompleteChangeReason,
  ) => void;
  onInputChange?: (event: ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => void;
  handleBlur?: FocusEventHandler;
  handleFocus?: FocusEventHandler;
  disableClearable?: boolean;
  clearOnBlur?: boolean;
  clearOnEscape?: boolean;
  blurOnSelect?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  fullWidth?: boolean;
  hideSearch?: boolean;
  renderOption?: (label: string) => JSX.Element;
}

export type AutocompleteProps<Multiple extends boolean | undefined> = Omit<
  AutocompleteRootProps<Multiple, AutocompleteOption>,
  'getOptionLabel' | 'getOptionSelected'
> &
  Partial<Pick<AutocompleteRootProps<Multiple, AutocompleteOption>, 'getOptionLabel' | 'getOptionSelected'>>;
