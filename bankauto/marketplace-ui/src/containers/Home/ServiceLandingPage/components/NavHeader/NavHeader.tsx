import React from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './NavHeader.style';
import { BackButton } from '../Button';

type NavHeaderProps = {
  onBack: () => void;
  children?: any;
  items?: any;
};

export const NavHeader = React.memo(({ onBack, items = [], children }: NavHeaderProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const renderItem = React.useCallback(
    (i, index) => {
      return (
        <>
          <p onClick={i?.onClick} className={s.item}>
            {i?.label}
          </p>
          {index + 1 < items.length && !isMobile && <span className={s.delimiter}>•</span>}
        </>
      );
    },
    [isMobile, onBack, items],
  );

  return (
    <div className={s.container}>
      {onBack && <BackButton onClick={onBack} />}
      <div className={s.right}>{items.length ? items.map(renderItem) : children}</div>
    </div>
  );
});
