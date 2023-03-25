import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      button: {
        padding: '1rem',
        minHeight: '3.75rem',
        width: '21.5rem',
        [down('xs')]: {
          width: '100%',
        },
      },
    };
  },
  { name: 'StepsBlock' },
);
