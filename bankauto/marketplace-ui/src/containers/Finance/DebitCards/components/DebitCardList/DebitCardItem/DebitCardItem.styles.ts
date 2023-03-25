import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey, warning } }) => ({
    wrapper: {
      [down('xs')]: {
        pb: '3.25rem',
        '&::before': {
          position: 'absolute',
          left: '0',
          content: '""',
          height: '0.625rem',
          width: '100%',
          backgroundColor: grey[100],
        },
      },
    },

    img: {
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: '0.5rem',
      objectPosition: '50% 50%',
      [down('xs')]: {
        height: '13rem',
      },
    },

    advantagesBlock: {
      borderLeft: `0.0625rem solid ${grey[200]}`,
      padding: '1.875rem 2.5rem',
      [down('xs')]: {
        padding: '0.625rem 0',
        borderTop: `0.0625rem solid ${grey[200]}`,
        borderLeft: 'none',
      },
    },
    bonusValueBigText: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: '1.5em',
      [down('xs')]: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: '1.5em',
      },
    },
    tags: {
      color: warning.main,
    },

    details: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },

    paymentIcon: {
      border: `1px solid ${grey[200]}`,
      borderRadius: '0.5rem',
      width: '4.375rem',
      height: '2.69rem',
    },
  }),
  { name: 'DebitCardItem' },
);

export { useStyles };
