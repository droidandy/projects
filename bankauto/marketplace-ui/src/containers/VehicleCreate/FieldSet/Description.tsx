import React from 'react';
import { Field } from 'react-final-form';
import { InputBase, Typography } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      focused: {},
      root: {},
      shrink: {
        '&+$inputRoot $input': {
          padding: '1.25rem 0 0',
        },
      },
      label: {
        '&$shrink': {
          top: '1.5rem',
        },
      },
      caption: {},
      input: {},
      inputRoot: {
        padding: '1.25rem',
        '&$focused $caption': {
          display: 'none',
        },
        [down('xs')]: {
          '& $caption': {
            display: 'none',
          },
        },
      },
    };
  },
  { name: 'VehicleCreateComment' },
);

export const VehicleDescriptionFieldSet = () => {
  const classes = useStyles();
  return (
    <Field name="comment">
      {({ input, meta }) => (
        <InputBase
          label="Описание"
          classes={{ root: classes.root }}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          onBlur={input.onBlur}
          onChange={input.onChange}
          InputLabelProps={{
            classes: { root: classes.label, shrink: classes.shrink },
          }}
          InputProps={{
            classes: { root: classes.inputRoot, input: classes.input, focused: classes.focused },
            rowsMax: 4,
            endAdornment: !input.value?.length ? (
              <Typography variant="caption" color="textSecondary" className={classes.caption}>
                Необязательно
              </Typography>
            ) : undefined,
            inputProps: {
              maxLength: 10000,
            },
          }}
          variant="outlined"
          multiline
          fullWidth
        />
      )}
    </Field>
  );
};
