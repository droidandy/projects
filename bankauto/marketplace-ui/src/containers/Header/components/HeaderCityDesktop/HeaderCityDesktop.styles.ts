import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ typography }) => ({
    root: {
      fontWeight: 600,
      marginRight: '1.875rem',
      color: 'transparent',
    },
    texts: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'start',
    },
    icon: {
      fill: 'none',
    },
    coverage: {
      ...typography.caption,
      fontWeight: 600,
    },
  }),
  { name: 'HeaderCityDesktop' },
);

export { useStyles };
