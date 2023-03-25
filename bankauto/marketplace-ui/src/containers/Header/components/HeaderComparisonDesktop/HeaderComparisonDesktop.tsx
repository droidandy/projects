import React, { FC } from 'react';
import { HeaderComparisonProps } from 'containers/Header/types';
import { Icon, IconButton } from '@marketplace/ui-kit';
import { ReactComponent as CompareIcon } from 'icons/compareCarColored.svg';
import { Link } from 'components';

export const HeaderComparisonDesktop: FC<HeaderComparisonProps> = ({ href }) => {
  return (
    <Link href={href} style={{ marginRight: '1.875rem' }} shallow>
      <IconButton arial-label="перейти к сравнению автомобилей" size="small" color="inherit">
        <Icon
          component={CompareIcon}
          htmlColor="black"
          style={{
            stroke: 'currentColor',
            fill: 'none',
          }}
        />
      </IconButton>
    </Link>
  );
};
