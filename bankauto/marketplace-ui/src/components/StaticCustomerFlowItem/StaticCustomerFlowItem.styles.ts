import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    flowItemContainer: {
      boxSizing: 'content-box',
    },

    arrow: {
      position: 'relative',
      width: '100%',

      '&::after': {
        content: '""',
        position: 'absolute',
        backgroundImage: 'url(/icons/btnArrowRight.svg)',
        display: 'block',
        width: '2.375rem',
        height: '1rem',
        backgroundSize: '2.375rem 1rem',
        backgroundRepeat: 'no-repeat',
        right: '-0.4rem',
        top: '50%',
        transform: 'translate(100%, -50%)',
      },
    },

    shortList: {
      '&::after': {
        right: '-50%',
      },
    },

    last: {
      '&::after': {
        display: 'none',
      },
    },

    iconContainer: {
      width: '3.5rem',
      height: '3.5rem',
    },
    icon: {
      fill: 'none',
      fontSize: '3rem',
    },
    title: {
      textAlign: 'center',
      lineHeight: '1.5rem',
      [down('sm')]: {
        width: '11.75rem',
      },
    },
  }),
  {
    name: 'StaticCustomerFlowItem',
  },
);

export { useStyles };
