import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    ul: {
      [down('xs')]: {
        width: '100%',
      },
      '& > li:first-child': {
        flex: '1 1 auto',
      },
      '& > li:last-child': {
        flex: '1 1 auto',
        textAlign: 'right',
      },
    },
  }),
  { name: 'OFFICE-Pagination' },
);

export { useStyles };
