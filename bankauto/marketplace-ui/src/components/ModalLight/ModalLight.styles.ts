import { makeStyles, Theme } from '@material-ui/core/styles';

type ModalLightStyleProps = {
  isMobile: boolean;
};

const useStyles = makeStyles<Theme, ModalLightStyleProps>(
  ({ breakpoints: { down } }) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      outline: 0,
      position: 'relative',
      minWidth: '31.25rem',
      [down('xs')]: {
        minWidth: 'unset',
        position: 'absolute',
        borderRadius: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    iconCloseWrapper: {
      margin: '0.75rem',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
    },
    iconClose: {
      fontSize: '1.125rem',
    },
    content: {
      margin: ({ isMobile }) => (isMobile ? '1.25rem' : '3.25rem'),
      marginTop: ({ isMobile }) => (isMobile ? '2.5rem' : '3.25rem'),
    },
  }),
  { name: 'ModalLight' },
);

export { useStyles };
