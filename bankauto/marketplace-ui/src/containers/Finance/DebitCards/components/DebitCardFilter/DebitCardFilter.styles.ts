import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down }, palette: { grey, primary } }) => ({
  checkboxImg: {
    width: 'auto',
    height: 'auto',
    '&:not(:last-of-type)': {
      marginRight: '1.25rem',
    },
    '& .MuiButtonBase-root': {
      width: '100%',
      height: '100%',
    },
  },
  paper: {
    backgroundColor: grey[100],
    margin: '3.75rem 0',
    [down('xs')]: {
      margin: '0',
    },
  },
  line: {
    borderRight: `0.0625rem solid ${grey[300]}`,
    [down('xs')]: {
      borderRight: 'none',
      borderBottom: `0.0625rem solid ${grey[300]}`,
    },
  },
  fitToYou: {
    fontSize: '1.25rem',
    [down('xs')]: {
      fontSize: '0.875rem',
    },
  },
  showAll: {
    position: 'relative',
    '&:after': {
      content: '""',
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      borderBottom: `0.125rem dashed ${primary.main}`,
      width: '100%',
    },
  },
}));

export { useStyles };
