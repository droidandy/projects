import { HeaderComparisonProps } from 'containers/Header/types';
import React, { FC } from 'react';
import { Link } from 'components';
import { Button, Icon, Typography } from '@marketplace/ui-kit';
import { ReactComponent as CompareIcon } from 'icons/compareCarColored.svg';

export const HeaderComparisonMobile: FC<HeaderComparisonProps> = ({ href, textStyle, transparent }) => {
  return (
    <div style={{ padding: '0.75rem 1.25rem' }}>
      <Link href={href} color="inherit">
        <Button
          startIcon={
            <Icon
              viewBox="0 0 24 24"
              component={CompareIcon}
              htmlColor={transparent ? 'white' : 'black'}
              style={{
                stroke: 'currentColor',
                fill: 'none',
              }}
            />
          }
        >
          <Typography className={textStyle} variant="subtitle1" component="div">
            Сравнение автомобилей
          </Typography>
        </Button>
      </Link>
    </div>
  );
};
