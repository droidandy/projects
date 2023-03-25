import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  breadcrumbs: {
    padding: '0.625rem 0',
    [down('xs')]: {
      padding: 0,
    },
  },
}));

export { useStyles };
