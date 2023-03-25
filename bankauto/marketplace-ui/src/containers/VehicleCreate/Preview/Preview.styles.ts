import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => ({
    previewFallback: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImage: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
    },
    previewWrapper: {
      borderRadius: '0.5rem',
      height: '15.375rem',
      position: 'relative',
      background: grey[300],
      overflow: 'hidden',
      [down('xs')]: {
        height: '14.125rem',
      },
    },
    contentBlock: {
      paddingTop: '0.625rem',
    },
    infoBlock: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    stickersContainer: {
      background: 'transparent',
      padding: '1.25rem 1.25rem 1.25rem',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 5,
      width: '100%',
      [down('xs')]: {
        position: 'initial',
        padding: 0,
        margin: '0.625rem 0',
        overflow: 'hidden',
      },
    },
  }),
  { name: 'VehiclePreview' },
);

export { useStyles };
