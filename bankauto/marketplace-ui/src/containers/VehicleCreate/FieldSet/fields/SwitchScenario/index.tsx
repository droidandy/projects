import React from 'react';
import { Field } from 'react-final-form';
import { Typography, Switch } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components/InfoTooltip';
import { useStyles } from './SwitchScenario.styles';

export type SwitchScenarioProps = {
  name: string;
  label: string;
  info?: string;
};

export const SwitchScenario = ({ name, label, info }: SwitchScenarioProps) => {
  const { switchBlock, switchItem } = useStyles();

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <div className={switchBlock}>
          <div className={switchItem}>
            <Switch
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
                    {label}
                  </Typography>
                </>
              }
            />
            {info && (
              <InfoTooltip
                title={
                  <Typography variant="subtitle1" style={{ color: '#FFF' }}>
                    {info}
                  </Typography>
                }
              />
            )}
          </div>
          {meta.touched && !!meta.error ? (
            <Typography variant="subtitle2" component="div" color="error" style={{ paddingTop: '.5rem' }}>
              {meta.error}
            </Typography>
          ) : null}
        </div>
      )}
    </Field>
  );
};
