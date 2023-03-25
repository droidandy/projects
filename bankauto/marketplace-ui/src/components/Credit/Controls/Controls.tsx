import React, { FC } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as ArrowBack } from 'icons/arrowBack.svg';
import { ProbabilityApproval } from 'components/Credit';

interface Props {
  submitLabel?: string;
  loading?: boolean;
  onBack?: () => void;
  approvalPercent: number;
  approvalTitle?: string;
  onSubmit: (event: React.SyntheticEvent) => void;
  step?: number;
  leftChild?: JSX.Element;
  hideProbabilityApproval?: boolean;
}

const Controls: FC<Props> = ({
  submitLabel = 'Продолжить',
  approvalPercent,
  approvalTitle,
  onBack,
  onSubmit,
  loading = false,
  step,
  leftChild,
  hideProbabilityApproval,
}) => {
  const { isMobile } = useBreakpoints();

  return (
    <Box mt={isMobile ? '1.25rem' : '2.5rem'}>
      <Grid
        container
        justify="space-between"
        direction={isMobile ? 'column-reverse' : 'row'}
        spacing={isMobile ? 2 : 4}
        wrap="nowrap"
      >
        <Grid item container xs={12} sm={4} alignItems="center">
          {onBack && (
            <Button
              fullWidth={isMobile}
              variant="text"
              size="large"
              color="primary"
              onClick={onBack}
              startIcon={<ArrowBack />}
            >
              <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                Назад
              </Typography>
            </Button>
          )}
          {leftChild}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box width="100%">
            <Button fullWidth variant="contained" size="large" color="primary" disabled={loading} onClick={onSubmit}>
              {loading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                  {submitLabel}
                </Typography>
              )}
            </Button>
          </Box>
        </Grid>
        {!hideProbabilityApproval && (
          <Grid item xs={12} sm={4}>
            <ProbabilityApproval percent={approvalPercent} title={approvalTitle} step={step} />
          </Grid>
        )}
        {hideProbabilityApproval && !isMobile && <Grid item sm={4} />}
      </Grid>
    </Box>
  );
};

export { Controls };
