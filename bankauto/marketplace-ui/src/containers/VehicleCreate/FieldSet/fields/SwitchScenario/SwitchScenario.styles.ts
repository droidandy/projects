import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    switchBlock: {
      '&:not(:first-of-type)': {
        paddingTop: '1rem',
      },
    },
    switchItem: {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      width: '100%',
    },
  };
});

export { useStyles };
