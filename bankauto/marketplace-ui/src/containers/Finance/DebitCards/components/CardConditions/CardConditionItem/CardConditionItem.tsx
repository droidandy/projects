import React, { FC, useCallback } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components';
import { KeyConditionType } from 'containers/Finance/types/KeyConditionType';
import { useStyles } from './CardConditionItem.styles';
import { ReactComponent as CreditCardIcon } from '../../../icons/CreditCard.svg';
import { ReactComponent as PercentIcon } from '../../../icons/Percent.svg';
import { ReactComponent as CoffeeIcon } from '../../../icons/Coffee.svg';

interface Props {
  item: KeyConditionType;
}

const CardConditionItem: FC<Props> = ({ item }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const getIcon = useCallback((iconName?: string) => {
    if (!iconName) return;
    if (iconName === 'CreditCard') {
      return <CreditCardIcon />;
    }
    if (iconName === 'Percent') {
      return <PercentIcon />;
    }
    if (iconName === 'Coffee') {
      return <CoffeeIcon />;
    }
  }, []);
  return (
    <Box
      display={isMobile ? 'flex' : 'block'}
      height={isMobile ? '6.25rem' : 'auto'}
      mb={isMobile && '0.625rem'}
      boxShadow={isMobile && '0px 8px 48px rgba(0, 0, 0, 0.1)'}
      borderRadius={isMobile && '0.5rem'}
      padding={isMobile && '0 1.625rem'}
      alignItems={isMobile && 'center'}
    >
      {isMobile && (
        <Box width="3.25rem" flexShrink={0} mr="1.625rem">
          {getIcon(item.iconName)}
        </Box>
      )}
      <Box>
        <Box mb={!isMobile && '1rem'}>
          <Typography variant={isMobile ? 'h5' : 'h2'} align={isMobile ? 'left' : 'center'}>
            {item.valueSmallText && <span className={s.smallText}>{item.valueSmallText}</span>}{' '}
            <span className={s.titleValue}>{item.valueBigText}</span>
            {item.valueSmallText2}
          </Typography>
        </Box>
        <Box mb="0.75rem">
          <Typography
            variant={isMobile ? 'body2' : 'h4'}
            align={isMobile ? 'left' : 'center'}
            style={{
              whiteSpace: isMobile ? 'normal' : 'pre-line',
              fontWeight: 400,
              fontSize: isMobile ? '0.75rem' : '1.25rem',
              lineHeight: isMobile ? '1rem' : '1.875rem',
            }}
          >
            {item.title}
            {item.tooltipText && (
              <InfoTooltip
                preWrap
                isMobilePortalTooltip
                disablePortal={false}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                title={
                  <Box color="#fff" fontWeight={isMobile ? 400 : 600} whiteSpace="pre-wrap">
                    <Typography variant={isMobile ? 'body2' : 'body1'}>{item.tooltipText}</Typography>
                  </Box>
                }
              />
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export { CardConditionItem };
