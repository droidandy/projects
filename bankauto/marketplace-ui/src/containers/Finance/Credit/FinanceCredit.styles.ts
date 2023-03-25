import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  hero: {
    height: '22.5rem',
    '&>div:first-child>div': {
      height: '22.5rem',
    },
    [down('xs')]: {
      height: '23.4375rem',
      '&>div:first-child>div': {
        height: '23.4375rem',
      },
    },
    '& h1': {
      [down('xs')]: {
        marginBottom: '0.625rem',
      },
    },
  },
}));

export { useStyles };
