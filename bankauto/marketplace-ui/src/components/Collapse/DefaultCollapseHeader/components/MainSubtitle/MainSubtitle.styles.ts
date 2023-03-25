import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

import { Color } from 'constants/Color';
import { MainHelperTextColor, MainSubtitleColor } from 'components/Collapse/DefaultCollapseHeader/components';

interface Props {
  color: MainSubtitleColor | undefined;
  helperTextColor: MainHelperTextColor;
}

export const useStyles = makeStyles<DefaultTheme, Props>(({ palette }) => ({
  value: {
    color: (props) => {
      switch (props.color) {
        case Color.RED:
          return palette.primary.main;
        case Color.GREEN:
          return palette.success.main;
        case Color.BLACK:
          return palette.text.primary;
        default:
          return palette.text.secondary;
      }
    },
  },
  helperText: {
    color: (props) => {
      switch (props.helperTextColor) {
        case Color.RED:
          return palette.primary.main;
        case Color.GREEN:
          return palette.success.main;
        default:
          return palette.text.secondary;
      }
    },
  },
}));
