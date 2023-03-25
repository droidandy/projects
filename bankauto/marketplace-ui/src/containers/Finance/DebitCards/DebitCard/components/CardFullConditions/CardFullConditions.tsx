import React, { FC } from 'react';
import { ContainerWrapper, useBreakpoints, Box, Typography, Divider, Paper } from '@marketplace/ui-kit';
import { Grid } from '@material-ui/core';
import { ReactComponent as IconCheckedGreen } from 'icons/iconCheckedGreen.svg';
import { FullCondition } from 'store/types';
import { InfoTooltip } from 'components';

interface Props {
  fullConditions: FullCondition[];
}

const CardFullConditions: FC<Props> = ({ fullConditions }) => {
  const { isMobile } = useBreakpoints();

  return (
    <ContainerWrapper>
      <Paper elevation={0} variant={isMobile ? 'elevation' : 'outlined'}>
        <Box p={isMobile ? '0.625rem 0 0' : '3.75rem 3.75rem 2.5rem'}>
          <Typography variant={isMobile ? 'h4' : 'h3'} align={isMobile ? 'center' : 'left'} paragraph>
            Условия и преимущества
          </Typography>

          {fullConditions.map(({ label, value, tooltipText }, index) => (
            <Box key={index}>
              <Divider color="secondary" />
              <Box p="1rem 0 1.25rem">
                <Grid container spacing={3}>
                  <Grid item sm={7} xs={6}>
                    <Typography variant={isMobile ? 'h6' : 'h5'}>{label}</Typography>
                  </Grid>
                  <Grid item sm={5} xs={6}>
                    {value === true ? (
                      <Box display="flex" justifyContent={isMobile ? 'center' : 'flex-start'}>
                        <IconCheckedGreen width="1.125rem" height="0.875rem" />
                      </Box>
                    ) : (
                      <Typography variant={isMobile ? 'h6' : 'h5'}>
                        {value}
                        {tooltipText && (
                          <InfoTooltip
                            preWrap
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            title={
                              <Box color="#fff" fontWeight={isMobile ? 400 : 600} whiteSpace="pre-wrap">
                                <Typography variant={isMobile ? 'body2' : 'body1'}>{tooltipText}</Typography>
                              </Box>
                            }
                          />
                        )}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}
          {isMobile && <Divider color="secondary" />}
        </Box>
      </Paper>
    </ContainerWrapper>
  );
};

export { CardFullConditions };
