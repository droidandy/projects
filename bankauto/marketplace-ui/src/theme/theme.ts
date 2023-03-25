import { createMuiTheme } from '@material-ui/core/styles';
import { palette } from './palette';
import { overrides } from './overrides';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { spacing } from './spacing';
import { mixins } from './mixins';

const theme = createMuiTheme({
  palette,
  breakpoints,
  mixins,
  overrides: overrides(palette),
  typography,
  spacing,
});

export { theme };
