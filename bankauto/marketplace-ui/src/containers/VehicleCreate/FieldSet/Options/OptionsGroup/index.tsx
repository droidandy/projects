import React, { useMemo } from 'react';
import cx from 'classnames';
import { FieldProps, FieldRenderProps } from 'react-final-form';
import { Grid, GridProps, Typography } from '@material-ui/core';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import { VehicleFormOption, VehicleFormOptionGroup } from 'types/VehicleFormType';
import { AutocompleteNew as Autocomplete, Checkbox, SelectNew as Select } from 'components/Fields';
import CheckboxMobile from 'components/Fields/CheckboxMobile';
import { useStyles } from './OptionsGroup.styles';

const mapOption = (option: VehicleFormOption): FieldProps<any, FieldRenderProps<any, HTMLElement>> => {
  if (option.multiChoice === null) {
    return {
      type: 'checkbox',
      name: `option-${option.id}`,
      value: option.id,
      label: option.name,
    };
  }
  return {
    type: 'select',
    name: `option-${option.id}`,
    variant: 'outlined',
    placeholder: option.name,
    multiple: option.multiChoice,
    options: option.subgroups.map((item) => ({ label: item.name, value: item.id })),
  };
};

const OptionField = ({ type, multiple, className, ...input }: FieldProps<any, FieldRenderProps<any, HTMLElement>>) => {
  const { isMobile } = useBreakpoints();
  const Component = useMemo(() => {
    if (type === 'checkbox') {
      return !isMobile ? Checkbox : CheckboxMobile;
    }
    if (multiple) {
      return Autocomplete;
    }
    return Select;
  }, [type, multiple, isMobile]);
  return <Component label={input.placeholder} {...{ type, multiple, className, ...input }} />;
};

type GridSize = Required<GridProps>['xs'];

type OptionsGroupProps = VehicleFormOptionGroup &
  Pick<GridProps, 'spacing' | 'direction'> & {
    gridItemSize?: GridSize;
    classNames?: Partial<ReturnType<typeof useStyles>>;
  };

const RestGridItem = ({ gridLength, gridSize }: { gridLength: number; gridSize: GridSize }) => {
  const rowLength = 12 / +gridSize;
  const rest = rowLength - (gridLength % rowLength);
  return gridLength && rest ? <Grid item xs={(rest * +gridSize) as GridSize} /> : null;
};

export const OptionsGroup = ({
  name,
  options,
  spacing = 4,
  gridItemSize = 4,
  direction,
  classNames,
}: OptionsGroupProps) => {
  const classes = useStyles();

  const [selects, checkboxes] = useMemo(() => {
    const fields = options.map(mapOption);
    return [fields.filter((a) => a.type === 'select'), fields.filter((a) => a.type === 'checkbox')];
  }, [options]);

  return (
    <div className={cx(classes.root, classNames?.root)}>
      <Typography variant="h5" component="p" className={cx(classes.title, classNames?.title)}>
        {name}
      </Typography>
      <div className={cx(classes.container, classNames?.container)}>
        <Grid container direction={direction} spacing={spacing}>
          {selects.map((field) => (
            <Grid item className={cx(classes.item, classNames?.item)} xs={gridItemSize}>
              <OptionField key={field.id} {...field} className={cx(classes.select, classNames?.select)} />
            </Grid>
          ))}
          <RestGridItem gridLength={selects.length} gridSize={gridItemSize} />
          {checkboxes.map((field) => (
            <Grid item className={cx(classes.item, classNames?.item)} xs={gridItemSize}>
              <OptionField key={field.id} {...field} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};
