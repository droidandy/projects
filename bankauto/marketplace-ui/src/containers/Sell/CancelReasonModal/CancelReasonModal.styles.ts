import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  modalRoot: {
    maxWidth: '50rem',
  },
  modalContent: {
    marginLeft: 0,
    marginRight: 0,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    paddingBottom: '2.5rem',
  },
  pl: {
    paddingLeft: '1.5rem',
    [down('xs')]: {
      paddingLeft: '0.5rem',
    },
  },
  phoneLink: {
    color: 'inherit',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  select: {
    marginTop: '4.25rem',
    marginBottom: '2.5rem',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingLeft: '3.75rem',
    paddingRight: '3.75rem',
    [down('xs')]: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
  map: {
    width: '100%',
    marginTop: '2.5rem',
    [down('xs')]: {
      marginTop: '1.5rem',
    },
  },
  btn: {
    width: '23rem',
    [down('xs')]: {
      width: '100%',
      marginTop: '1.5rem',
    },
  },
}));
