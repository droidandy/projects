import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey, text }, breakpoints: { down, up } }) => {
    return {
      root: {
        display: 'flex',
        alignItems: 'center',
        color: text.primary,
        margin: '1.25rem 0',
        backgroundColor: grey[200],
        [down('xs')]: {
          borderRadius: '0.5rem',
          padding: '1.25rem 1.25rem',
          justifyContent: 'center',
          flexDirection: 'column',
        },
        [up('sm')]: {
          borderRadius: '1rem',
          padding: '1.875rem 1.875rem',
          justifyContent: 'space-between',
          flexDirection: 'row',
        },
      },
      content: {
        marginBottom: '1.25rem',
        [down('xs')]: {
          textAlign: 'center',
        },
      },
    };
  },
  { name: 'ApplicationRejected' },
);

export { useStyles };
