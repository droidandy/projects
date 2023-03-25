import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary,
      common: { white },
      grey: { '500': g500 },
    },
  }) => ({
    info: {
      position: 'relative',
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'center',
      marginLeft: '.625rem',
      fontSize: '.7rem',
      zIndex: 1,
      outline: 0,
      '&:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        zIndex: -1,
        background: g500,
      },
      '&:hover': {
        '&:after': {
          background: primary.main,
        },
      },
      color: white,
      fontWeight: 600,
      lineHeight: 1.6,
      width: '1rem',
      height: '1rem',
    },
    toolTipMobile: {
      outline: 'none',
      '& *': {
        whiteSpace: 'normal',
      },
      '& .MuiTooltip-popper': {
        maxWidth: '97%',
        zIndex: '1000',
      },
    },
    withPreWrap: {
      '& *': {
        whiteSpace: 'pre-wrap',
      },
    },
  }),
);

export { useStyles };
