import React, { FC } from 'react';

import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { InfoTooltip } from 'components/InfoTooltip';
import { CircledDigit } from 'components/CircledDigit';
import { Color } from 'constants/Color';
import { AdditionalSubtitle, MainSubtitle, MainSubtitleProps, AdditionalSubtitleProps } from './components';
import { useStyles } from './DefaultCollapseHeader.styles';

interface Props {
  digit?: {
    value: number;
    circleColor: Color;
  };
  main: {
    title: string;
    tooltipText?: string;
    subtitle?: MainSubtitleProps;
  };
  additional?: {
    title: React.ReactNode;
    subtitle?: AdditionalSubtitleProps;
  };
  status?: APPLICATION_VEHICLE_STATUS;
  ref?: any;
}

export const DefaultCollapseHeader: FC<Props> = ({ digit, main, additional, ref }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <Box display="flex" width="100%" pl={isMobile ? 2.5 : 3.75}>
      {digit && (
        <Box pr={isMobile ? 1.25 : 3.75} display="flex" alignItems={isMobile ? 'flex-start' : 'center'}>
          <CircledDigit circleColor={digit.circleColor}>
            <Typography variant={isMobile ? 'subtitle1' : 'h3'}>{digit.value}</Typography>
          </CircledDigit>
        </Box>
      )}

      <Box
        display="flex"
        width="100%"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent={isMobile ? 'center' : 'space-between'}
      >
        <Box
          display="flex"
          width="100%"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent={isMobile ? 'center' : 'space-between'}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <Typography className={s.mainTitle} variant={isMobile ? 'subtitle1' : 'h4'}>
                {main.title}
              </Typography>

              {main.tooltipText && (
                <InfoTooltip
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  title={
                    <Box color="#fff">
                      <Typography variant="subtitle1">{main.tooltipText}</Typography>
                    </Box>
                  }
                />
              )}
            </Box>

            <Box pt={isMobile && !additional?.subtitle && main.subtitle?.onClick ? 1.25 : 0}>
              {main.subtitle && <MainSubtitle subtitle={main.subtitle} />}
            </Box>
          </Box>

          {additional?.title || additional?.subtitle ? (
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={isMobile ? 'flex-start' : 'flex-end'}
            >
              {isMobile ? (
                <>
                  {additional.subtitle && (
                    <Box pt={1.25}>
                      <AdditionalSubtitle subtitle={additional.subtitle} />
                    </Box>
                  )}
                  <Box pt={1.25}>
                    <Typography variant="subtitle2">{additional.title}</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">{additional.title}</Typography>
                  {additional.subtitle && <AdditionalSubtitle subtitle={additional.subtitle} />}
                </>
              )}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
