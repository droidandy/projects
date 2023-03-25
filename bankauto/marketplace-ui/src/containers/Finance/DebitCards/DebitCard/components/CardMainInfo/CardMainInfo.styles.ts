import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey, warning } }) => ({
    img: {
      width: '100%',
      position: 'relative',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      objectPosition: '50% 50%',
      [down('xs')]: {
        width: 'auto',
      },
    },

    paymentIconBlock: {
      display: 'flex',
      flexDirection: 'row-reverse',
      [down('xs')]: {
        flexDirection: 'row',
        paddingTop: '1.25rem',
      },
    },
    bulletData: {
      color: warning.main,
      fontSize: '1.25rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        fontSize: '0.875rem',
        marginBottom: '0.125rem',
      },
    },
    paymentIcon: {
      border: `1px solid ${grey[200]}`,
      borderRadius: '1rem',
      width: '8.125rem',
      height: '5rem',
      [down('xs')]: {
        width: '6.125rem',
        height: '3.75rem',
      },
    },
  }),
  { name: 'CardMainInfo' },
);

export { useStyles };
