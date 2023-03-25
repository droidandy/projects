import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { secondary } }) => ({
    root: {},
    title: {
      paddingBottom: '1.25rem',
    },
    paper: {
      padding: '2.5rem',
      borderRadius: '0.5rem',
      background: secondary.light,
      [down('xs')]: {
        padding: '1.25rem',
      },
    },
    paperTransparent: {
      background: 'transparent',
    },
  }),
  { name: 'FieldsContainer' },
);

export { useStyles };
