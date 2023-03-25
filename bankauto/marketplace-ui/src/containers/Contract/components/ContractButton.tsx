import React, { FC } from 'react';
import cx from 'classnames';
import { GridProps } from '@material-ui/core/Grid';
import { Grid, Typography, Button } from '@marketplace/ui-kit';
import { useStyles } from '../Contract.styles';

type Props = {
  text: string;
  onClick: () => void;
  variant?: 'outlined' | 'contained';
} & GridProps;

export const ContractButton: FC<Props> = ({ text, onClick, variant = 'contained', ...rest }) => {
  const { buttonWrapper } = useStyles();
  return (
    <Grid item xs={12} sm={3} {...rest} alignItems="stretch">
      <div className={cx(buttonWrapper, [variant === 'outlined' && 'bgColorWhite'])}>
        <Button variant={variant} size="large" color="primary" onClick={onClick} fullWidth>
          <Typography variant="h5" component="span">
            {text}
          </Typography>
        </Button>
      </div>
    </Grid>
  );
};
