import React, { useMemo, useCallback } from 'react';
import cx from 'classnames';
import Option, { OptionSelected } from 'components/Option';
import { ReactComponent as IconCheckList } from '@marketplace/ui-kit/icons/icon-check-list';
import { StyledProps } from '@marketplace/ui-kit/types';
import { Typography } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import { AutocompleteOption } from '../types';

type AutocompleteOptionSelected<Option> = { option: Option; index: number };

interface Props<Option = AutocompleteOption> extends StyledProps {
  values: Option[];
  options: Option[];
  groupedOptions: Option[];
  getOptionLabel: (option: Option) => string;
  getOptionProps: ({ option, index }: { option: Option; index: number }) => {};
  getOptionSelected: (option: Option, value: Option) => boolean;
  onClear?: () => void;
  multiple?: boolean;
  optionClassName?: string;
  renderOption?: (label: string) => JSX.Element;
}

const useStyles = makeStyles(({ palette: { grey, text } }) => ({
  selectedOptions: {
    background: grey[200],
    padding: '0.625rem 0',
  },
  selectedOption: {
    margin: '0 1.25rem',
    padding: '0.625rem 0',
    color: text.primary,
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
  optionItem: {
    whiteSpace: 'normal',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${grey[200]}`,
    },
  },
}));

const ITEM_SIZE = 47;
const MAX_ITEM_SIZE = 4;

const AutocompleteOptions = <Option extends any>({
  values,
  onClear,
  multiple,
  groupedOptions,
  getOptionLabel: getOptionLabelProp,
  getOptionProps,
  getOptionSelected,
  className,
  optionClassName,
  renderOption = (label: string) => <span>{label}</span>,
}: Props<Option>) => {
  const s = useStyles();

  const selectedOptions = useMemo<AutocompleteOptionSelected<Option>[]>(
    () =>
      groupedOptions.reduce((r, i, k) => {
        return values.find((v) => getOptionSelected(i, v)) ? [...r, { option: i, index: k }] : r;
      }, [] as AutocompleteOptionSelected<Option>[]),
    [values, getOptionSelected, groupedOptions],
  );

  const getOptionLabel = useCallback(
    ({ index, style }) => {
      const option: any = groupedOptions[index];
      const selected: boolean = !!selectedOptions.find((selectedOption) => option === selectedOption.option);
      if (selected) {
        return (
          <div key={option.value} style={style}>
            <OptionSelected className={cx(s.optionItem, optionClassName)} icon={IconCheckList}>
              {renderOption(getOptionLabelProp(option))}
              {option.hint && <Typography variant="caption">{option.hint}</Typography>}
            </OptionSelected>
          </div>
        );
      }
      return (
        <div key={option.value} style={style}>
          <Option {...getOptionProps({ option, index })} className={cx(s.optionItem, optionClassName)}>
            {renderOption(getOptionLabelProp(option))}
            {option.hint && <Typography variant="caption">{option.hint}</Typography>}
          </Option>
        </div>
      );
    },
    [selectedOptions, getOptionLabelProp, groupedOptions],
  );

  return (
    <div className={cx(className)}>
      {selectedOptions.length > 0 && (
        <div className={s.selectedOptions}>
          {selectedOptions.map((selected) => {
            const { onMouseDown, ...optionProps }: any = getOptionProps({
              option: selected.option,
              index: selected.index,
            });
            return (
              <OptionSelected
                key={selected.index}
                className={s.selectedOption}
                {...optionProps}
                onMouseDown={(e: any) => {
                  if (!multiple && onClear) {
                    onClear();
                  } else if (onMouseDown) {
                    onMouseDown(e);
                  }
                }}
              >
                {getOptionLabelProp(selected.option)}
              </OptionSelected>
            );
          })}
        </div>
      )}
      <FixedSizeList
        width="100%"
        height={groupedOptions.length > MAX_ITEM_SIZE ? MAX_ITEM_SIZE * ITEM_SIZE : groupedOptions.length * ITEM_SIZE}
        itemCount={groupedOptions.length}
        itemSize={ITEM_SIZE}
      >
        {getOptionLabel}
      </FixedSizeList>
    </div>
  );
};

export default AutocompleteOptions;
