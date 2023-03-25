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
  pl: {
    paddingLeft: '1.5rem',
    [down('xs')]: {
      paddingLeft: '0.5rem',
    },
  },
  phoneLink: {
    color: 'inherit',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '3rem',
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
    marginTop: '1.875rem',
    width: '23rem',
    [down('xs')]: {
      width: '100%',
      marginTop: '1.5rem',
    },
  },
}));
