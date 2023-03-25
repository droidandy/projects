import React, { FC } from 'react';
import { Box } from '@material-ui/core';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { KeyConditionType } from 'containers/Finance/types/KeyConditionType';
import { CardConditionItem } from './CardConditionItem';
import { useStyles } from './CardConditions.styles';

interface Props {
  conditions: KeyConditionType[];
  align?: 'center' | 'left';
}

const CardConditions: FC<Props> = React.memo(({ conditions }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  return (
    <ContainerWrapper>
      <Box
        bgcolor="#fff"
        borderRadius={isMobile ? 0 : '0.5rem'}
        boxShadow={isMobile ? 'none' : '0px 0.5rem 3rem rgba(0, 0, 0, 0.1)'}
      >
        <Box display="flex" flexWrap="wrap">
          {conditions.map(
            (card, index) =>
              (!isMobile || (isMobile && !card.hideInMobile)) && (
                <Box p={isMobile ? '0' : '1.875rem 2.5rem 1.875rem'} flexGrow={0} flexBasis={isMobile ? '100%' : '25%'}>
                  <CardConditionItem item={card} key={index} />
                </Box>
              ),
          )}
        </Box>
      </Box>
    </ContainerWrapper>
  );
});

export { CardConditions };
