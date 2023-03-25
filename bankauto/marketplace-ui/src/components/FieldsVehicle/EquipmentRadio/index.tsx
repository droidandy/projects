import React, { FC } from 'react';
import { Field } from 'react-final-form';
import cx from 'classnames';
import { Box } from '@marketplace/ui-kit';
import { useStyles } from './EquipmentRadio.styles';

interface Option {
  label: JSX.Element | string;
  key: string;
  value: any;
}

interface Props {
  name: string;
  active?: any;
  options: Option[];
  className?: string;
}

export const EquipmentRadio: FC<Props> = ({ name: fieldName, active, options, className }) => {
  const classes = useStyles();

  return (
    <Box className={cx(classes.root, className)}>
      {options.map(({ key, label, value }) => {
        // eslint-disable-next-line eqeqeq
        const isActive = value == active;
        return (
          <label key={key} className={classes.label}>
            <Field name={fieldName} type="radio" value={value} className={classes.input} component="input" />
            <span className={cx(classes.button, isActive && classes.buttonActive)}>{label}</span>
          </label>
        );
      })}
    </Box>
  );
};
