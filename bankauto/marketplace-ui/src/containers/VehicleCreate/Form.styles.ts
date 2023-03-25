import { makeStyles } from '@material-ui/core/styles';

const useWrapperClasses = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      paddingTop: '2.5rem',
      [down('xs')]: {
        paddingTop: '1.25rem',
      },
    },
    title: {
      marginTop: '-2.5rem',
      [down('xs')]: {
        marginTop: '0 !important',
      },
    },
    paperNopt: {
      paddingTop: 0,
      [down('xs')]: {
        paddingTop: 0,
      },
    },
    paperNop: {
      padding: '0 !important',
      [down('xs')]: {
        padding: '0 !important',
      },
    },
  }),
  { name: 'SellFieldsContainer' },
);

export { useWrapperClasses };
