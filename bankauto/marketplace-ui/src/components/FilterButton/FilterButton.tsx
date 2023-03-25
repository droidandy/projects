import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import ButtonAdvanced, { Props as ButtonAdvancedProps } from '@marketplace/ui-kit/components/ButtonAdvanced';
import Icon from '@marketplace/ui-kit/components/Icon';
import { ReactComponent as BtnArrowRight } from 'icons/btnArrowRightWhite.svg';
import { UrlObject } from 'url';
import { useStyles } from './FilterButton.styles';

type Url = UrlObject | string;

interface Props {
  link: [Url, Url];
  disabled?: boolean;
  onClick?(e?: any): void;
  onSubmit?(e?: any): void;
}

const FilterButton: FC<Props> = ({ link: [href, as], disabled, onClick, onSubmit }) => {
  const s = useStyles();
  const router = useRouter();

  const handleClick = useCallback(
    (e) => {
      if (onSubmit) {
        onSubmit(e);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onClick && onClick(e);
        router.push(href, as);
      }
    },
    [href, as, router, onClick],
  );

  return (
    <ButtonAdvanced variant="contained" className={s.showVehiclesButton} disabled={disabled} onClick={handleClick}>
      <Icon className={s.buttonIcon} component={BtnArrowRight} viewBox="0 0 40 12" />
    </ButtonAdvanced>
  );
};

const FilterButtonSubmit: FC<ButtonAdvancedProps> = ({ children, ...props }) => {
  const s = useStyles();

  return (
    <ButtonAdvanced variant="contained" className={s.showVehiclesButton} type="submit" {...props}>
      {children || <Icon className={s.buttonIcon} component={BtnArrowRight} viewBox="0 0 40 12" />}
    </ButtonAdvanced>
  );
};

export { FilterButton, FilterButtonSubmit };
