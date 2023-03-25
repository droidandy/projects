import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ breakpoints: { down }, palette }) => ({
  rootModal: {
    width: '34rem',
    [down('xs')]: {
      width: '100vw',
    },
  },
  checkbox: {
    textAlign: 'left',
    '& .MuiButtonBase-root': {
      marginTop: '0.4rem',
      '& *': {
        fontSize: '2rem',
      },
    },
    '&:not(:first-child)': {
      marginTop: '1rem',
    },
    [down('xs')]: {
      alignItems: 'flex-start',
      '& .MuiFormControlLabel-label': {
        textAlign: 'left',
      },
    },
  },
  link: {
    color: palette.primary.main,
    textDecoration: 'underline',
  },
  icon: {
    fill: 'none',
    margin: '0 auto',
    height: '4.75rem',
    width: '4.75rem',
  },
}));
