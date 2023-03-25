import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey, primary }, typography: { h5 } }) => {
    return {
      contentWrapper: {
        background: grey['200'],
        borderRadius: '0.5rem',
        padding: '1rem 1.25rem 1.25rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 12,
        [down('xs')]: {
          padding: '1.25rem',
          overflow: 'hidden',
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
        zIndex: -12,
        [down('xs')]: {
          position: 'absolute',
          minHeight: '11.875rem',
        },
      },
      subText: {
        fontSize: h5.fontSize,
        lineHeight: h5.lineHeight,
        fontWeight: 400,
      },
      alternativeButton: {
        marginTop: '2.25rem',
        fontSize: h5.fontSize,
        lineHeight: h5.lineHeight,
        fontWeight: h5.fontWeight,
        padding: '1rem 0',
      },
      button: {
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '0.5rem',
        backdropFilter: 'blur(0.25rem)',
        boxShadow: 'inset 0px 0.0625rem 0.0625rem rgba(255, 255, 255, 0.8);',
        marginTop: '0.75rem',
        fontSize: h5.fontSize,
        fontWeight: h5.fontWeight,
        lineHeight: h5.lineHeight,
        color: primary.main,
        padding: '0.8125rem 0',
        [down('xs')]: {
          marginTop: '4.375rem',
          padding: '1.125rem 0',
        },
      },
    };
  },
  {
    name: 'TestDriveBlock',
  },
);

export { useStyles };
