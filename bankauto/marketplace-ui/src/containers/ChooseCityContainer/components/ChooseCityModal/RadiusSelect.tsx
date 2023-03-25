import React, { FC } from 'react';
import cx from 'classnames';
import { Typography } from '@marketplace/ui-kit';
import { useCity } from 'store/city';
import { useStyles } from './ChooseCityModal.styles';

const options = [0, 100, 200, 300, 400, 500, 1000];

export const RadiusSelect: FC = () => {
  const s = useStyles();
  const { extraCoverageRadius, changeExtraCoverageRadius } = useCity();

  const handleRadiusItemClick = (val: number) => changeExtraCoverageRadius(val);

  return (
    <div className={s.radiusSelectRoot}>
      <Typography variant="caption" className={s.radiusSelectLabel}>
        Радиус поиска, км
      </Typography>

      <div className={s.radiusSelectOptionsContainer}>
        {options.map((val) => (
          <button
            type="button"
            onClick={() => handleRadiusItemClick(val)}
            className={cx(s.radiusItem, { [s.radiusItemActive]: extraCoverageRadius === val })}
          >
            <Typography variant="subtitle2" component="span">
              {val}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
};
