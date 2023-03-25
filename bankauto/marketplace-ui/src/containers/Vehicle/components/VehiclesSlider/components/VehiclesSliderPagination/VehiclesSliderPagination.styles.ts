import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
      grey: { '500': g500 },
    },
    breakpoints: { down },
  }) => ({
    desktop: {
      display: 'block',
    },
    dotsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      outline: 'none',
      marginTop: '2.375rem',
      height: '0.26rem',

      [down('xs')]: {
        marginTop: '1.25rem',
      },
    },
    dot: {
      position: 'relative',
      height: '2px',
      width: '2.5rem',
      margin: '0 0.625rem',
      borderRadius: '1rem',
      background: g500,
      transition: 'all .2s ease-in',
      '&:after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: '-1rem',
        bottom: '-1rem',
        left: '-0.33rem',
        right: '-0.33rem',
        cursor: 'pointer',
      },
      '&.active': {
        width: '5rem',
        background: main,
      },
      [down('xs')]: {
        width: '0.625rem',
        '&.active': {
          width: '1.25rem',
        },
      },
    },
  }),
  { name: 'VehiclesSliderPagination' },
);
