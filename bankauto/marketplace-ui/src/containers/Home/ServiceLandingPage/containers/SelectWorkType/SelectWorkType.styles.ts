import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { secondary, text, grey, primary } }) => ({
    desktop: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
    },
    desktopGroup: {
      flexGrow: 1,
    },
    control: {
      height: '5rem',
      [down('xs')]: {
        border: `0.063rem solid ${grey[200]}`,
        borderRadius: '0.5rem',
        height: '3.75rem',
      },
    },
    btn: {
      marginTop: '1rem',
    },
    btnText: {
      ...typography.h5,
      color: secondary.contrastText,
    },
    label: {
      ...typography.h4,
      color: text.primary,
      marginBottom: '1.25rem',
      [down('xs')]: {
        ...typography.h5,
      },
    },
    text: {
      ...typography.body1,
      color: text.primary,
      marginTop: '1rem',
      [down('xs')]: {
        ...typography.body2,
      },
    },
    uremont: {
      ...typography.body1,
      color: primary.contrastText,
      marginTop: '1rem',
      [down('xs')]: {
        ...typography.body2,
      },
    },
    link: {
      ...typography.body1,
      color: grey[500],
      marginTop: '1rem',
      [down('xs')]: {
        ...typography.body2,
      },
    },
    containerOptions: {
      display: 'inline-flex',
      flexDirection: 'row',
      padding: '0.375rem 0.5rem',
      marginBottom: '1.5rem',
      background: grey[200],
      borderRadius: '0.5rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [down('xs')]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
  }),
  { name: 'SelectWorkType' },
);

export { useStyles };
