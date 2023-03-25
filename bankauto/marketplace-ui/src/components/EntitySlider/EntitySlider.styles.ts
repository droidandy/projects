import { makeStyles } from '@material-ui/core';

const useSliderStyles = makeStyles(({ palette: { background } }) => ({
  rail: {
    backgroundColor: background.paper,
  },
}));
const useInputStyles = makeStyles(({ breakpoints: { down } }) => ({
  input: {
    padding: 0,
    textAlign: 'right',
    fontWeight: 700,
    fontSize: '1.25rem',
    [down('xs')]: {
      fontSize: '0.875rem',
    },
  },
}));

const useStyles = makeStyles(() => ({
  formControl: {
    '& > div': {
      backgroundColor: 'transparent',
    },
  },
}));

export { useSliderStyles, useInputStyles, useStyles };
