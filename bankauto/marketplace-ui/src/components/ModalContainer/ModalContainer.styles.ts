import { makeStyles, Theme } from '@material-ui/core';

interface StyleProps {
  align: 'left' | 'right' | 'inherit' | 'center' | 'justify';
  narrow: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(
  ({
    palette: {
      common: { white },
    },
    breakpoints: { down },
  }) => ({
    root: {
      height: '100vh',
      overflow: 'auto',
      [down('xs')]: {
        position: 'relative',
      },
    },
    header: {
      paddingBottom: '5.5rem',
      [down('xs')]: {
        paddingBottom: '3.75rem',
      },
    },
    headerInner: {
      position: 'relative',
      [down('xs')]: {
        position: 'initial',
        textAlign: 'center',
      },
    },
    title: {
      textAlign: ({ align }) => align,
      margin: '5rem auto 1rem auto',
      color: white,
      [down('xs')]: {
        margin: '3.75rem auto 0.625rem auto',
      },
    },
    subtitle: {
      height: '5rem',
      maxWidth: ({ narrow }) => (narrow ? '50rem' : '100%'),
      margin: '0 auto',
      lineHeight: 1.5,
      [down('xs')]: {
        fontWeight: 400,
        fontSize: '0.875rem',
        height: 'initial',
        paddingBottom: '1.875rem',
      },
    },
    close: {
      position: 'absolute',
      right: '0',
      top: '.765rem',
      zIndex: 2,
      [down('xs')]: {
        top: '1.5625rem',
        right: '1.25rem',
      },
    },
  }),
  { name: 'ModalContainer' },
);

export { useStyles };
