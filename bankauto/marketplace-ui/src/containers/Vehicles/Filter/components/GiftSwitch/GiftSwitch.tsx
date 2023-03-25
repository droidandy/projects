import React, { FC } from 'react';
import { Field } from 'react-final-form';
import { Switch, Typography } from '@marketplace/ui-kit';
import { useStyles } from './GiftSwitch.styles';

interface Props {}

export const GiftSwitch: FC<Props> = () => {
  const s = useStyles();

  return (
    <Field name="withGift">
      {({ input }) => (
        <Switch
          className={s.root}
          labelPlacement="start"
          color="primary"
          checked={!!input.value}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
          onChange={(e, checkedState) => {
            input.onChange(checkedState);
          }}
          disabled={input.disabled}
          label={
            <>
              <Typography variant="subtitle1" component="b" color="textPrimary">
                Только с подарком
              </Typography>
            </>
          }
        />
      )}
    </Field>
  );
};
