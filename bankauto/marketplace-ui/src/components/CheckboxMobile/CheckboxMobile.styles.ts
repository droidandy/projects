import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

interface Props {
  checked?: boolean;
}

export const useStyles = makeStyles<DefaultTheme, Props>(
  ({ palette }) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1.25rem 0',
      borderBottom: `1px solid ${palette.grey[200]}`,
      userSelect: 'none',
      '&:hover': {
        color: palette.primary.main,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },

      '& span.MuiTypography-root': {
        margin: 0,
      },
    },
    checkmarkWrapper: {
      '&#wrapper': {
        opacity: 1,
      },
    },
    label: {
      color: ({ checked }) => (checked ? palette.primary.main : 'inherit'),
      fontWeight: ({ checked }) => (checked ? 600 : 400),
    },
  }),
  { name: 'CheckboxMobile' },
);
