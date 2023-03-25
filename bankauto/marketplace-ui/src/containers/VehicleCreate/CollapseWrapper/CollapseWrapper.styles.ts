import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    accordionRoot: {
      border: 'none',
      '&.Mui-expanded $accordionSummary': {
        display: 'none',
      },
    },
    accordionSummary: {
      padding: 0,
      maxHeight: 'none',
      '& .MuiAccordionSummary-content': {
        cursor: 'default',
      },
      [down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    accordionExpandIcon: {
      cursor: 'pointer',
      [down('xs')]: {
        margin: 0,
        marginLeft: '-0.5rem',
      },
    },
    accordionDetailsRoot: {
      padding: 0,
      flexDirection: 'column',
    },
  }),
  { name: 'CollapseWrapper' },
);
