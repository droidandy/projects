import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
      grey,
    },
    breakpoints: { down },
  }) => {
    return {
      root: {
        border: `0.0625rem solid ${grey['200']}`,
        borderRadius: '0.5rem',
        background: white,
        padding: '1.125rem 4.5625rem 1.375rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        [down('xs')]: {
          padding: '1.125rem 6rem 1.375rem 1.25rem',
        },
      },
      icon: {
        height: '4rem',
        width: '4rem',
        marginRight: '1.25rem',
        [down('xs')]: {
          height: '3rem',
          width: '3rem',
        },
      },
    };
  },
);

export { useStyles };
