import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    root: {
      marginBottom: '3rem',
    },
    aside: {
      top: '8rem',
      position: 'sticky',
    },
  };
});

export { useStyles };
