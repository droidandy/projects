import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    breadcrumbsWrapper: {
      display: 'none',
      paddingBottom: '.625rem',
      [down('xs')]: {
        display: 'block',
      },
    },
  }),
  { name: 'ReviewHero' },
);
