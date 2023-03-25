import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

interface Props {
  disabled: boolean;
}

export const useStyles = makeStyles<DefaultTheme, Props>(
  ({ palette, breakpoints: { down } }) => ({
    accordionRoot: {
      border: 'none',
      '&:last-child': {
        borderBottom: 'none',
      },
    },

    accordionSummaryRoot: {
      maxHeight: 264,
      backgroundColor: palette.secondary.light,
      borderRadius: 8,
      transition: 'border-radius 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      '&.Mui-expanded': {
        transition: 'border-radius 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      // targeting MuiAccordionSummary-content-x
      // and setting its margin to the same value when not expanded
      '& > div:first-of-type.Mui-expanded': {
        margin: '12px 0',
      },
    },
    accordionSummaryExpandIcon: {
      margin: '.25rem 2.125rem 0 1.5rem',
      [down('xs')]: {
        margin: '.25rem 1.5rem 0 3rem',
      },
      visibility: ({ disabled }) => (disabled ? 'hidden' : 'visible'),
    },

    accordionDetailsRoot: {
      padding: '2.5rem',
      marginTop: 1,
      backgroundColor: palette.secondary.light,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      '&.Mui-expanded': {
        color: 'green',
      },
      [down('xs')]: {
        padding: '1.25rem',
      },
    },
  }),
  { name: 'MuiAccordion' },
);
