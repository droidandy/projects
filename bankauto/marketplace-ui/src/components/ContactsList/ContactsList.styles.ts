import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  contactItem: {
    '&:first-of-type': {
      [down('xs')]: {
        marginBottom: '1.25rem',
      },
    },
  },
  icon: { height: '1.65rem', width: '1.65rem', fill: 'none' },
}));

export { useStyles };
