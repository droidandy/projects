import { makeStyles } from '@material-ui/core/styles';

const useSearchInputStyles = makeStyles(({ palette: { grey } }) => ({
  root: {
    padding: '1rem 0 1.1875rem 0',
    borderBottom: `1px solid ${grey[200]}`,
    borderRadius: 0,
  },
  input: {
    padding: 0,
    marginLeft: '1.25rem',
  },
}));

const useEndAdornmentStyles = makeStyles(() => ({
  root: {
    padding: 0,
    transition: '0.25s ease-out',
  },
  opened: {
    transform: 'rotate(180deg)',
  },
}));

const useStyles = makeStyles(({ palette: { text }, breakpoints: { down } }) => ({
  root: {
    '& input.MuiInputBase-input': {
      padding: '1rem 0 1.25rem',
    },
    '& .MuiInputLabel-shrink + .MuiOutlinedInput-root > .MuiInputBase-input': {
      padding: '1.5rem 1.25rem 0.725rem',
    },
  },
  icon: {
    top: '2.5rem',
    right: '1.875rem',
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    pointerEvents: 'none',
    [down('xs')]: {
      top: '1.4rem',
      right: '1.25rem',
    },
  },
  listbox: {
    margin: 0,
    padding: '.5rem 0',
    overflow: 'auto',
    listStyle: 'none',
    maxHeight: '40vh',
    borderRadius: 0,
  },
  paper: {
    margin: '0',
    overflow: 'hidden',
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: '1.5',
    letterSpacing: '0.00938em',
    marginLeft: '1px',
    zIndex: 1300,
    borderRadius: '.5rem',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  },
  loadingText: {
    textAlign: 'center',
    color: text.hint,
  },
  applyButton: {
    width: '100%',
  },
  searchInput: {
    padding: '0 1.25rem',
  },
  optionItemModal: {
    margin: '0 1.25rem',
  },
  optionItemPlain: {
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
  },
}));

export { useStyles, useSearchInputStyles, useEndAdornmentStyles };
