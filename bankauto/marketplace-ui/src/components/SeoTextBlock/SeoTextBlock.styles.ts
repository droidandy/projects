import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, breakpoints: { down } }) => ({
  root: {
    '& > *': {
      fontWeight: 400,
      fontSize: '1.25rem',
      lineHeight: '1.625rem',
      [down('xs')]: {
        fontSize: '1rem',
        lineHeight: '1.5rem',
      },
    },
    '& > h2': {
      margin: '1rem 0',
      fontSize: '2rem',
      lineHeight: '3rem',
      fontWeight: 'bold',
      color: palette.primary.main,
      [down('xs')]: {
        fontSize: '1.5rem',
        lineHeight: '2.25rem',
      },
    },
    '& > ul': {
      listStyle: 'disc',
      marginLeft: '1.375rem',
    },
    '& > ol': {
      listStyle: 'decimal',
      marginLeft: '1.375rem',
    },
  },
}));

export { useStyles };
