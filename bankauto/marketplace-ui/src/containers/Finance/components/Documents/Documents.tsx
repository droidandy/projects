import React, { FC } from 'react';
import { Box, ContainerWrapper, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { LinkItem } from '@marketplace/ui-kit/types';

import { useStyles } from './Documents.styles';
import { Plank } from './Plank';
import { PlankSupport, Props as PlankSupportProps } from './PlankSupport';

interface Props {
  data: LinkItem[] | null;
  type?: PlankSupportProps['type'];
  headerMarginBottomDesktop?: any;
  isShowSupport?: boolean;
}

const Documents: FC<Props> = ({ data, type, headerMarginBottomDesktop = '2.5rem', isShowSupport = true }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  if ((!data || !data.length) && !isShowSupport) return null;
  return (
    <ContainerWrapper>
      <Box mb={isMobile ? '1.25rem' : headerMarginBottomDesktop}>
        <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" align="center">
          Остались вопросы?
        </Typography>
      </Box>
      <Box pb={isMobile ? '2.5rem' : '5rem'} className={s.container}>
        <Grid container spacing={isMobile ? 3 : 4} direction={isMobile ? 'column' : 'row'} justify="center">
          {data?.map((plank) => (
            <Grid item xs={12} sm={4} md={3} key={plank.id}>
              <Plank plank={plank} key={plank.id} />
            </Grid>
          ))}
          {isShowSupport && (
            <Grid item xs={12} sm={4} md={3}>
              <PlankSupport type={type} />
            </Grid>
          )}
        </Grid>
      </Box>
    </ContainerWrapper>
  );
};

export { Documents };
