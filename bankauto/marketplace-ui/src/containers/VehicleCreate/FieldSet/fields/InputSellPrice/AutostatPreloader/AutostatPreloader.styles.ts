import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    circle: {
      width: '0.625rem',
      height: '0.625rem',
      borderRadius: '50%',
      animation: '$preloader 1s infinite ease-in-out',
      transitionProperty: 'background-color',
      backgroundColor: '#C4C4C4',
    },
    '@keyframes preloader': {
      from: {
        backgroundColor: '#C4C4C4',
      },
      '50%': {
        backgroundColor: '#4B4B4D',
      },
      to: {
        backgroundColor: '#2222',
      },
    },
  }),
  { name: 'AutostatPreloader' },
);

export { useStyles };
