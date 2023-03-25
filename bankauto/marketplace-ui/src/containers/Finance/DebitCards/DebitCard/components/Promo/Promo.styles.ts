import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      text: { primary },
    },
  }) => ({
    banner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1.25rem 2.5rem 2.5rem',
      width: 'calc(50% - 1.25rem)',
      borderRadius: '0.5rem',
      height: '100%',
      position: 'relative',
      flexGrow: 1,
      flexShrink: 0,
      marginRight: '2.5rem',
      color: primary,
      whiteSpace: 'break-spaces',
      [down('xs')]: {
        whiteSpace: 'inherit',
        padding: '1rem 1.25rem 1.25rem 1.25rem',
        width: '100%',
        height: '12.5rem',
        marginRight: '0.625rem',
        marginBottom: 0,
        boxSizing: 'border-box',
        '&:last-child': {
          marginRight: '0',
        },
      },
    },
    miniBanner: {
      padding: '1.25rem 1.25rem 1.875rem 1.875rem',
      width: 'calc(50% - 3.75rem)',
      height: '13.75rem',
      marginRight: '2.5rem',
      marginBottom: '2.5rem',
    },
    mobileRoot: {
      padding: '0px 1.25rem',
      '& > div': {
        width: 'auto',
        margin: '0 -1.25rem',
      },
      '& .swiper-container': {
        padding: '0 1.25rem',
      },
    },
    title: {
      [down('xs')]: {
        fontSize: '0.75rem',
        lineHeight: '1rem',
      },
    },
    subTitle: {
      paddingTop: '1.25rem',
      [down('xs')]: {
        fontSize: '0.75rem',
        paddingTop: '0.3125rem',
        lineHeight: '1rem',
      },
    },
    percent: {
      fontSize: '3rem',
      [down('xs')]: {
        fontSize: '2rem',
      },
    },
  }),
);

export { useStyles };
