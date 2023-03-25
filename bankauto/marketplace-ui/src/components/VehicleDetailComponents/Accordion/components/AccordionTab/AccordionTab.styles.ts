import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    typography,
    palette: {
      primary: { main },
    },
  }) => ({
    tabItem: {
      paddingBottom: '0.875rem',
      cursor: 'pointer',
      position: 'relative',
      // whiteSpace: 'nowrap',
      '&:not(:first-of-type)': {
        marginLeft: '2.5rem',
      },
      '&.active': {
        fontWeight: typography.fontWeightBold,
        '&::after': {
          display: 'inline-block',
          position: 'absolute',
          content: '""',
          width: '100%',
          height: '3px',
          backgroundColor: main,
          bottom: '-1px',
          left: 0,
          zIndex: 1,
        },
      },
      '&.disabled': {
        cursor: 'not-allowed',
      },
    },
  }),
  { name: 'AccordionTab' },
);
