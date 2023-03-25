import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { text } }) => ({
  input: {
    width: '100%',
    color: 'inherit',
  },
  inputLabel: {
    color: text.hint,
  },
  customSelectInput: {
    width: '100%',
    '& .MuiSelect-root': {
      color: 'inherit',
      padding: '.7rem 3rem .7rem .8rem',
    },
  },
}));

export { useStyles };
