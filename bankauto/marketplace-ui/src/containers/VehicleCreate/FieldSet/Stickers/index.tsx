import React, { FC, useCallback, ChangeEvent, useEffect } from 'react';
import cx from 'classnames';
import { Field } from 'react-final-form';
import { StickerData } from '@marketplace/ui-kit/types';
import Grid from '@marketplace/ui-kit/components/Grid';
import Typography from '@marketplace/ui-kit/components/Typography';
import { useVehicleCreateStickers } from 'store/catalog/create/stickers';
import { FieldsContainer, FieldsContainerProps } from 'components/FieldsContainer';
import { useStyles } from './Stickers.styles';

const ACTIVE_STICKERS_COUNT = 3;

interface StickersMultySelectProps extends FieldsContainerProps {
  name: string;
  options?: StickerData[];
  subtitle?: string;
}

interface SticerProps {
  values: number[];
  currentValue: number;
  label: string;
  onChange: (event: ChangeEvent<HTMLElement> | any) => void;
}

const Sticker: FC<SticerProps> = ({ values, currentValue, label, onChange }) => {
  const classes = useStyles();
  const isExists = values.includes(currentValue);

  const toggleSetValue = useCallback(() => {
    if (values.length) {
      if (values.length >= ACTIVE_STICKERS_COUNT && !isExists) return;
      if (isExists) {
        const filtredValues = values.filter((item) => item !== currentValue);
        onChange(filtredValues);
        return;
      }
      onChange([...values, currentValue]);
      return;
    }
    onChange([currentValue]);
  }, [values, currentValue, isExists, onChange]);

  return (
    <div
      className={cx(
        classes.button,
        isExists ? classes.buttonActive : [classes.buttonDefault, values.length === 3 && classes.buttonDisabled],
      )}
      onClick={toggleSetValue}
    >
      {label}
    </div>
  );
};

export const StickersMultySelect: FC<StickersMultySelectProps> = ({ id, name, subtitle, options, ...rest }) => {
  const classes = useStyles();
  const {
    state: { stickers, initial },
    fetchVehicleCreateStickers,
  } = useVehicleCreateStickers();

  useEffect(() => {
    if (!initial) {
      fetchVehicleCreateStickers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVehicleCreateStickers, initial]);

  return (
    <Field name={name}>
      {({ input }) => {
        return stickers.length ? (
          <FieldsContainer id={id || name} {...rest}>
            <div className={classes.root}>
              {subtitle && (
                <Typography variant="h5" component="p" className={classes.title}>
                  {subtitle}
                </Typography>
              )}
              <Grid container spacing={2}>
                {stickers.map(({ label, id }) => (
                  <Grid item key={id}>
                    <Sticker values={input.value} currentValue={id} label={label} onChange={input.onChange} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </FieldsContainer>
        ) : null;
      }}
    </Field>
  );
};
