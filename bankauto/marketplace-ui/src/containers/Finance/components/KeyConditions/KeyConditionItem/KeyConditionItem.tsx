import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components';
import { KeyConditionType } from 'containers/Finance/types/KeyConditionType';
import { useStyles } from './KeyConditionItem.styles';

interface Props {
  item: KeyConditionType;
  align: 'center' | 'left';
}

const KeyConditionItem: FC<Props> = ({ item, align }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <Box
      className={isMobile ? s.root : ''}
      p={isMobile ? '2.875rem 1.25rem 1.875rem' : '1.875rem 2.5rem 1.875rem 1.875rem'}
    >
      <Box mb="1.25rem">
        <Typography variant="h4" align={isMobile ? 'center' : align}>
          {item.valueSmallText && <span className={s.smallText}>{item.valueSmallText}</span>}{' '}
          <span className={s.titleValue}>{item.valueBigText}</span>
          {item.valueSmallText2}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        align={isMobile ? 'center' : align}
        style={{ whiteSpace: 'pre-line' }}
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
  );
};

export { KeyConditionItem };
