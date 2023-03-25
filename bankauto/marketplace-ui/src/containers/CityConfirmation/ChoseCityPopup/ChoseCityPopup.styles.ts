import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => {
    return {
      mobileRoot: {
        width: 'calc(100vw - 1.25rem)',
        padding: '1.875rem 1.25rem',
        marginTop: '-50%',
      },
      desktopRoot: {
        position: 'fixed',
        width: '27.5rem',
        padding: '1.875rem',
        top: '3.5rem',
        right: '11.25rem',
        zIndex: 10000,
      },
      desktopButton: {
        width: '11.25rem',
      },
    };
  },
  {
    name: 'ChoseCityPopup',
  },
);

export { useStyles };
