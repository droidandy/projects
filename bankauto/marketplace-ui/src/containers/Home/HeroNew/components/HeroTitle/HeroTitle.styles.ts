import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, primary }, breakpoints: { down } }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'top',
      textAlign: 'center',
      color: common.white,
    },
    title: {
      [down('xs')]: {
        marginBottom: '0.625rem',
      },
    },
    stockRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'top',
      textAlign: 'left',
      color: common.white,
      [down('xs')]: {
        textAlign: 'center',
      },
    },
    buttonWrapper: {
      display: 'flex',
      paddingTop: '3.75rem',
      [down('xs')]: {
        paddingTop: '3.375rem',
        justifyContent: 'center',
      },
    },
    button: {
      [down('xs')]: {
        borderColor: common.white,
        backgroundColor: `${common.white} !important`,
        color: common.black,
      },
      '&:hover, &:click, &:focus': {
        [down('xs')]: {
          borderColor: primary.main,
          color: primary.main,
        },
      },
    },
    link: {
      display: 'block',
      width: '22.75rem',
      [down('xs')]: {
        width: '17.5rem',
        maxWidth: '17.5rem',
      },
    },
  }),
  { name: 'Landing-Hero-Title' },
);
