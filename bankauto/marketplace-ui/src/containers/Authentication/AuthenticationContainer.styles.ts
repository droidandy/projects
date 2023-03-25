import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      // maxWidth: '40rem',
      // width: '23.75rem',
      maxWidth: '31.25rem',
      [down('xs')]: {
        maxWidth: '100vw',
      },
    },
    colorMain: { color: '#990031' }, // Тема не применилась добавил так
    pre: {
      whiteSpace: 'pre-wrap',
    },
  }),
  { name: 'AuthenticationContainer' },
);

export { useStyles };
