import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      buttonWrapper: {
        width: '21.5rem',
        margin: '0 auto',
        paddingTop: '1.25rem',
        [down('xs')]: {
          width: '100%',
        },
      },
    };
  },
  { name: 'StepsBlock' },
);
