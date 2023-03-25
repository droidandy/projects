import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  partners: {
    [down('xs')]: {
      padding: '1.25rem !important',
    },
    '& h2': {
      fontSize: '2rem',
      lineHeight: 1.5,
      marginBottom: 0,
      [down('xs')]: {
        fontSize: '1.25rem',
      },
    },
  },
  heroinnerContentClassName: {
    position: 'relative',
    top: '1.56rem',
  },
}));

export { useStyles };
