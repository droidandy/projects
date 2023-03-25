import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey, common } }) => ({
    root: {
      padding: '2.5rem 1.5rem 2.5rem 2.5rem',
      border: `.0625rem solid ${grey[200]}`,
      borderRadius: '0.5rem',
      backgroundColor: common.white,
      height: '100%',
      [down('xs')]: {
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    title: {
      padding: '1.25rem 0',
      whiteSpace: 'pre-wrap',
      [down('xs')]: {
        padding: '.625rem 0',
        textAlign: 'center',
        whiteSpace: 'normal',
      },
    },
    text: {
      fontWeight: 400,
      [down('xs')]: {
        textAlign: 'center',
      },
    },
  }),
  { name: 'InfoItem' },
);

export { useStyles };
