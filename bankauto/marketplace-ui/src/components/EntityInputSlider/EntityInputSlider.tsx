import React, { ChangeEvent, FocusEvent, FC, ReactNode, useState, useMemo, useEffect, useCallback } from 'react';
import { Box, BoxProps, Mark } from '@material-ui/core';
import { Grid, Slider, Typography, useBreakpoints } from '@marketplace/ui-kit';
import debounce from 'lodash/debounce';
import _ from 'lodash';
import { useSliderStyles, useInputStyles } from './EntityInputSlider.styles';
import { InputNumber } from 'components/Input';

export interface Props extends BoxProps {
  label: ReactNode;
  value: number;
  min: Mark;
  max: Mark;
  step?: number;
  whiteRail?: boolean;
  editable?: boolean;
  suffix?: string;
  onAmountChange: (value: number) => void;
  disabled?: boolean;
  nonLinear?: boolean;
  map?: Array<{
    value: number;
    scaledValue: number;
  }>;
}

const EntityInputSlider: FC<Props> = ({
  label,
  value,
  min,
  max,
  step = 1,
  whiteRail = false,
  onAmountChange,
  className,
  editable = false,
  suffix,
  disabled = false,
  nonLinear,
  map = [], // описывает нелинейную шкалу
  ...rest
}) => {
  const { isMobile } = useBreakpoints();
  const [innerValue, setInnerValue] = useState(value);
  const { rail, thumb } = useSliderStyles();
  const inputClasses = useInputStyles();
  const debouncedOnChange = useMemo(() => debounce(onAmountChange, 100), [onAmountChange]);
  // const mapFirstDot = useMemo(() => map[0], [map]);
  // const mapLastDot = useMemo(() => map[map.length - 1], [map]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  // from scale to value
  const scale = useCallback(
    // проверка граничных условий
    (newValue: number) => {
      let currentValue = newValue;
      if (isNaN(currentValue)) currentValue = min.value;
      if (currentValue <= map[0].value) {
        return map[0].scaledValue;
      }
      if (currentValue >= map[map.length - 1].value) {
        return map[map.length - 1].scaledValue;
      }
      // определяем точки между которыми находится значение
      let previousMarkIndex = map.findIndex((v) => v.value > currentValue) - 1;
      const previousMark = map[previousMarkIndex];
      const nextMark = map[previousMarkIndex + 1];
      // если попали точно в точку то возвращаем её значение
      const remainder = (currentValue - previousMark.value) % (nextMark.value - previousMark.value);
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
    (newValue: number) => {
      let scaledValue = newValue;
      if (isNaN(scaledValue)) scaledValue = min.value;
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
    const newValue = nonLinear ? scale(v) : v;
    setInnerValue(newValue);
    debouncedOnChange(newValue);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt((e.target.value || '0').replaceAll(' ', ''), 10);
    setInnerValue(newValue);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    let newValue = parseInt((e.target.value || '0').replaceAll(' ', ''), 10);

    if (isNaN(newValue)) newValue = min.value;
    if (newValue < min.value) {
      newValue = min.value;
    } else if (newValue > max.value) {
      newValue = max.value;
    }

    setInnerValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <Box className={className} {...rest}>
      <Box mb={isMobile ? '0.1875rem' : '0.625rem'}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="div" align="left">
          {label}
        </Typography>
      </Box>
      <Box height={isMobile ? '2.625rem' : '3.75rem'} alignItems="center" justifyContent="center" justifyItems="center">
        <InputNumber
          name="entity-slider-input"
          value={innerValue}
          suffix={suffix}
          thousandSeparator=" "
          onChange={onInputChange}
          onBlur={handleInputBlur}
          fullWidth
          disabled={!editable}
          inputClasses={inputClasses}
        />
      </Box>
      <Box mt="-1rem">
        <Slider
          classes={whiteRail ? { rail, thumb } : { thumb }}
          min={nonLinear ? map[0].value : min.value}
          max={nonLinear ? map[map.length - 1].value : max.value}
          value={nonLinear ? toScale(innerValue) : innerValue}
          step={nonLinear ? 1 : step}
          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20191
          onChange={handleChangeInnerValue}
          disabled={disabled}
        />
      </Box>
      <Box mt={isMobile ? '-1.25rem' : '-0.5rem'}>
        <Grid container>
          <Grid item xs={6}>
            <Box>
              <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="div" color="secondary">
                {min.label}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography
                variant={isMobile ? 'subtitle2' : 'subtitle1'}
                component="div"
                color="secondary"
                align="right"
              >
                {max.label}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export { EntityInputSlider };
