import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

import { Color } from 'constants/Color';

interface Props {
  circleColor: Color;
}

export const useStyles = makeStyles<DefaultTheme, Props>(
  ({ palette: { success, warning, error, text, primary }, breakpoints: { down } }) => ({
    circle: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      color: primary.contrastText,
      backgroundColor: ({ circleColor }) => {
        switch (circleColor) {
          case Color.GREEN:
            return success.main;
          case Color.YELLOW:
            return warning.main;
          case Color.RED:
            return error.main;
          default:
            return text.secondary;
        }
      },
      [down('xs')]: {
        width: '2rem',
        height: '2rem',
        marginTop: '.25rem',
      },
    },
    large: {
      [down('xs')]: {
        width: '3rem',
        height: '3rem',
      },
    },
  }),
);
