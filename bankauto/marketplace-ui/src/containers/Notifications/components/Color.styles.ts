import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(({ palette }) => {
  return {
    checkboxIcon: {
      position: 'relative',
      width: '1em',
      height: '1em',
      boxSizing: 'border-box',
      background: 'currentColor',
      borderRadius: '50%',
    },
    checkMark: {
      position: 'absolute',
      fontSize: 'inherit',
      top: '0em',
      left: '0em',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      borderWidth: '0',
      fill: palette.secondary.light,
    },
  };
});
