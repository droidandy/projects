import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { primary, text, grey } }) => ({
    control: {
      border: `0.063rem solid ${grey[200]}`,
      borderRadius: '0.5rem',
      height: '3.75rem',
    },
    container: {
      margin: '2.5rem 10.625rem 4.125rem 10.625rem',
      [down('xs')]: {
        margin: '0 0 0 0',
      },
    },
    label: {
      ...typography.h4,
      color: text.primary,
      marginTop: '1.875rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        marginTop: '1.25rem',
        ...typography.h5,
      },
    },
    clear: {
      cursor: 'pointer',
      textAlign: 'right',
      ...typography.h4,
      color: primary.main,
      marginTop: '1.875rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        marginTop: '1.25rem',
        ...typography.h5,
      },
    },
    content: {
      marginTop: '2.5rem',
      [down('xs')]: {
        marginTop: '0.75rem',
      },
    },
    map: {
      position: 'relative',
      zIndex: 3,
      padding: 0,
      maxHeight: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      height: '51.75rem',
      [down('xs')]: {
        height: '31.25rem',
      },
    },
    list: {
      minWidth: '30.25rem',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&::scrollbar': {
        display: 'none',
      },
      scrollbarWidth: 'none' /* Firefox */,
    },
  }),
  { name: 'SelectCarService' },
);

export { useStyles };
