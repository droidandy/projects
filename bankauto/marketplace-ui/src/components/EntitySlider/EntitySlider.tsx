import React, { ChangeEvent, FocusEvent, FC, ReactNode, useState, useMemo, useEffect, useCallback } from 'react';
import { Mark } from '@material-ui/core';
import { Grid, InputNumber, Slider, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ComponentProps } from '@marketplace/ui-kit/types';
import debounce from 'lodash/debounce';
import _ from 'lodash';
import { useSliderStyles, useInputStyles, useStyles } from './EntitySlider.styles';

export interface Props extends ComponentProps {
  label: ReactNode;
  valueLabel: ReactNode;
  value: number;
  min: Mark;
  max: Mark;
  step?: number;
  whiteRail?: boolean;
  editable?: boolean;
  suffix?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  nonLinear?: boolean;
  map?: Array<{
    value: number;
    scaledValue: number;
  }>;
}

const EntitySliderRoot: FC<Props> = ({
  label,
  valueLabel,
  value,
  min,
  max,
  step = 1,
  whiteRail = false,
  onChange,
  className,
  editable = false,
  suffix,
  disabled = false,
  nonLinear,
  map = [], // описывает нелинейную шкалу
}) => {
  const { isMobile } = useBreakpoints();
  const [innerValue, setInnerValue] = useState(value);
  const sliderClasses = useSliderStyles();
  const inputClasses = useInputStyles();
  const s = useStyles();
  const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  // from scale to value
  const scale = useCallback(
    // проверка граничных условий
    (value: number) => {
      if (value <= map[0].value) {
        return map[0].scaledValue;
      }
      if (value >= map[map.length - 1].value) {
        return map[map.length - 1].scaledValue;
      }
      // определяем точки между которыми находится значение
      const previousMarkIndex = map.findIndex((v) => v.value > value) - 1;
      const previousMark = map[previousMarkIndex];
      const nextMark = map[previousMarkIndex + 1];
      // если попали точно в точку то возвращаем её значение
      const remainder = (value - previousMark.value) % (nextMark.value - previousMark.value);
      if (_.round(remainder, 6) === 0) {
        return previousMark?.scaledValue;
      }
      // иначе - возвращаем точку и прибавку
      const increment = (nextMark?.scaledValue - previousMark?.scaledValue) / (nextMark.value - previousMark.value);
      return remainder * increment + previousMark?.scaledValue;
    },
    [map],
  );

  // from value to scale
  const toScale = useCallback(
    (scaledValue: number) => {
      // проверка граничных условий
      if (scaledValue <= map[0].scaledValue) {
        return map[0].value;
      }
      if (scaledValue >= map[map.length - 1].scaledValue) {
        return map[map.length - 1].value;
      }
      // определяем точки между которыми находится значение
      const previousMarkIndex = map.findIndex((v) => v.scaledValue > scaledValue) - 1;
      const previousMark = map[previousMarkIndex];
      const nextMark = map[previousMarkIndex + 1];
      // если попали точно в точку то возвращаем её значение
      const remainder = (scaledValue - previousMark.scaledValue) % (nextMark.scaledValue - previousMark.scaledValue);
      if (_.round(remainder, 6) === 0) {
        return previousMark?.value;
      }
      // иначе - возвращаем точку и прибавку
      const increment = (nextMark?.value - previousMark?.value) / (nextMark.scaledValue - previousMark.scaledValue);
      return remainder * increment + previousMark?.value;
    },
    [map],
  );

  const handleChangeInnerValue = (e: ChangeEvent<{}>, v: number) => {
    const innerValue = nonLinear ? scale(v) : v;
    setInnerValue(innerValue);
    debouncedOnChange(innerValue);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((e.target.value || '0').replaceAll(' ', ''), 10);
    setInnerValue(value);
    debouncedOnChange(value);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value.replaceAll(' ', ''), 10);

    if (value < min.value) {
      value = min.value;
    } else if (value > max.value) {
      value = max.value;
    }

    setInnerValue(value);
    debouncedOnChange(value);
  };

  return (
    <Grid item xs className={className}>
      <Grid container direction="row" justify="space-between" wrap="nowrap">
        <Grid item>
          <Typography variant={isMobile ? 'h6' : 'h4'} component="div" align="left">
            {label}
          </Typography>
        </Grid>
        <Grid item>
          {editable && !disabled ? (
            <InputNumber
              InputProps={{
                classes: inputClasses,
              }}
              name="entity-slider-input"
              value={innerValue}
              suffix={suffix}
              thousandSeparator=" "
              onChange={onInputChange}
              onBlur={handleInputBlur}
              className={s.formControl}
            />
          ) : (
            <Typography variant={isMobile ? 'h6' : 'h4'} component="div" align="right">
              {valueLabel}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container wrap="nowrap">
        <Grid item xs={12}>
          <Slider
            classes={whiteRail ? sliderClasses : undefined}
            min={nonLinear ? map[0].value : min.value}
            max={nonLinear ? map[map.length - 1].value : max.value}
            value={nonLinear ? toScale(innerValue) : innerValue}
            step={nonLinear ? 1 : step}
            // @ts-ignore: https://github.com/mui-org/material-ui/issues/20191
            onChange={handleChangeInnerValue}
            disabled={disabled}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="textSecondary">
            {min.label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="textSecondary" align="right">
            {max.label}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const EntitySlider: FC<Props> = React.memo(EntitySliderRoot);
export { EntitySlider };
