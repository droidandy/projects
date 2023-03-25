import { useBreakpoints } from '@marketplace/ui-kit';
import React, { FC, memo } from 'react';
import { HeaderComparisonProps } from 'containers/Header/types';
import { HeaderComparisonMobile } from './components/HeaderComparisonMobile/HeaderComparisonMobile';
import { HeaderComparisonDesktop } from './components/HeaderComparisonDesktop/HeaderComparisonDesktop';
import { useStyles } from './components/HeaderMobile/Header.styles';

const ComparisonRoot: FC<HeaderComparisonProps> = ({ href, transparent }) => {
  const { isMobile } = useBreakpoints();
  const classes = useStyles();

  return (
    <>
      {isMobile ? (
        <HeaderComparisonMobile href={href} textStyle={classes.profileButtonText} transparent={transparent} />
      ) : (
        <HeaderComparisonDesktop href={href} />
      )}
    </>
  );
};

export const HeaderComparison = memo(ComparisonRoot);
