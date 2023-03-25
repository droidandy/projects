import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => {
    return {
      root: {
        margin: '0.625rem',
        height: '100%',
        background: grey['200'],
        borderRadius: '0.5rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        [down('xs')]: {
          flexDirection: 'column-reverse',
          alignItems: 'flex-end',
        },
      },
      infoRoot: {
        padding: '1.875rem 2.5rem 2.5rem 2.5rem',
        [down('xs')]: {
          padding: '0 1.25rem 1.875rem 1.25rem',
        },
      },
      image: {
        position: 'relative',
        width: '100%',
        '&.horizontal': {
          minWidth: '28.75rem',
          maxWidth: '28.75rem',
          height: '16.25rem',
          overflow: 'hidden',
        },
        [down('xs')]: {
          height: '12.5rem',
          maxWidth: '18.4375rem',
        },
      },
      title: {
        [down('xs')]: {
          margin: '.625rem 0',
        },
      },
      buttonItemContained: {
        width: '22.8125rem',
        marginTop: '2.25rem',
        [down('xs')]: {
          marginTop: '1.875rem',
          marginBottom: '0rem',
          width: '100%',
        },
      },
      mainButton: {
        padding: '1.125rem 0',
      },
      infoText: {
        marginTop: '0.625rem',
        [down('xs')]: {
          marginTop: '0',
        },
      },
    };
  },
  {
    name: 'AdsCardC2C',
  },
);

export { useStyles };
