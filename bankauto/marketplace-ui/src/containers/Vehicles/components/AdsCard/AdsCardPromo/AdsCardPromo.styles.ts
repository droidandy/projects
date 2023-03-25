import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => {
    return {
      root: {
        padding: '0.625rem',
      },
      contentWrapper: {
        minHeight: '16.25rem',
        background: grey['200'],
        borderRadius: '0.5rem',
        padding: '1.875rem',
        position: 'relative',
        overflow: 'hidden',
        [down('xs')]: {
          padding: '1.25rem',
          overflow: 'hidden',
          minHeight: '23.125rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      },
      imageWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        [down('xs')]: {
          position: 'absolute',
          minHeight: '11.875rem',
        },
      },
      titleWrapper: {
        paddingBottom: '2.5rem',
        position: 'relative',
        zIndex: 1,
        [down('xs')]: {
          paddingBottom: '1.875rem',
        },
      },
      title: {
        [down('xs')]: {
          paddingBottom: '0.625rem',
        },
      },
      buttonWrapper: {
        width: '22.75rem',
        [down('xs')]: {
          width: '100%',
          paddingTop: '1.875rem',
        },
      },
    };
  },
  {
    name: 'AdsPromoCard',
  },
);

export { useStyles };
