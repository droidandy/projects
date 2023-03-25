import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down }, typography }) => {
    return {
      root: {
        maxWidth: '48.125rem',
        margin: '0 auto',
        textAlign: 'start',
      },
      infoBlockTitle: {
        ...typography.h2,
        [down('xs')]: {
          ...typography.h4,
          textAlign: 'center',
        },
      },
      infoBlockText: {
        padding: '1.25rem 0',
        ...typography.subtitle1,
        [down('xs')]: {
          ...typography.body1,
        },
      },
      buttonBlock: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '3.75rem',
        [down('xs')]: {
          flexDirection: 'column',
          marginTop: '1.25rem',
        },
      },
      button: {
        padding: '1rem',
        minHeight: '3.75rem',
        width: '21.5rem',
        marginRight: '2.5rem',
        ...typography.h5,
        [down('xs')]: {
          width: '100%',
          marginRight: '0',
          marginBottom: '1.25rem',
        },
      },
      buttonLink: {
        marginRight: '2.5rem',
        [down('xs')]: {
          marginRight: '0',
          marginBottom: '1.25rem',
        },
      },
      registerButton: {
        padding: '0 0 0.1875rem 0',
        ...typography.body1,
        fontWeight: 700,
      },
    };
  },
  { name: 'InfoBlock' },
);
