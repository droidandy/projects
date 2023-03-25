import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { grey } }) => {
  return {
    root: {},
    icon: {
      display: 'flex',
      '& path, & circle, & rect': {
        fill: 'transparent',
      },
      fontSize: '2rem',
    },
    colorCircle: {
      height: '2rem',
      width: '2rem',
      borderRadius: '50%',
      display: 'inline-block',
      border: `.0625rem solid ${grey[200]}`,
    },
    infoItem: {
      '&:last-of-type': {
        paddingBottom: '0rem',
      },
    },
  };
});

export { useStyles };
