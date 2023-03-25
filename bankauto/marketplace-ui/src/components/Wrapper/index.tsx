import React, { FC, memo } from 'react';
import { CircularProgress } from '@marketplace/ui-kit';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './Wrapper.styles';

interface WrapperProps {
  loading?: boolean;
  loadingMessage?: string;
}

const WrapperRoot: FC<WrapperProps> = ({ children, loading = true, loadingMessage }) => {
  const s = useStyles();
  if (loading) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ flex: '1 1 auto', width: '100%', height: '100%' }}
        className={s.root}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
        {loadingMessage && <Grid item>{loadingMessage}</Grid>}
      </Grid>
    );
  }

  return <>{children}</>;
};

const Wrapper: FC<WrapperProps> = memo(WrapperRoot);

export default Wrapper;
