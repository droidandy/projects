import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      icon: {
        margin: '1.5rem .5rem .5rem',
        '& path': {
          fill: 'currentColor',
        },
      },
    };
  },
  { name: 'BodyItem' },
);

export { useStyles };
