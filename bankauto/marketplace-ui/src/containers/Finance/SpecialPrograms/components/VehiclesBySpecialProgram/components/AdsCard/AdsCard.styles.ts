import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      primary: { contrastText, main },
      grey,
    },
  }) => {
    return {
      root: {
        margin: '0.625rem',
        height: '100%',
        background: grey['200'],
        borderRadius: '0.5rem',
        overflow: 'hidden',
        [down('xs')]: {
          marginBottom: 0,
        },
      },
      video: {
        position: 'relative',
        width: '100%',
        height: '15.375rem',
        '&.gorisontal': {
          minWidth: '19.45rem',
          maxWidth: '19.45rem',
          height: '12.5rem',
          overflow: 'hidden',
        },
        '&.gorisontal>div': {
          borderRadius: '0.5rem',
          overflow: 'hidden',
        },
        [down('xs')]: {
          height: '14.25rem',
        },
      },
      content: {},
      listItemPointer: {
        display: 'inline-block',
        height: '1.25rem',
        width: '1.25rem',
        borderRadius: '50%',
        color: contrastText,
        background: main,
        textAlign: 'center',
        position: 'relative',
      },
      number: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };
  },
  {
    name: 'AdsCard',
  },
);

export { useStyles };
