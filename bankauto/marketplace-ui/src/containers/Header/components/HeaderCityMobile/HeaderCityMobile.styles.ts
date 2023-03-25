import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ typography }) => ({
    root: {
      padding: '0.75rem 1.25rem',
    },
    texts: {
      display: 'flex',
      alignItems: 'baseline',
    },
    icon: {
      fill: 'none',
    },
    coverage: {
      ...typography.caption,
      fontWeight: 600,
      marginLeft: '0.625rem',
    },
  }),
  { name: 'HeaderCityMobile' },
);

export { useStyles };
