import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down }, typography }) => ({
    tabsContainer: {
      overflow: 'hidden',
      maxWidth: '100%',
    },
    tabsWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      [down('xs')]: {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none' /* Firefox */,
        position: 'relative',
        display: 'inline-block',
        overflowX: 'auto',
        width: '100%',
        whiteSpace: 'nowrap',
      },
    },
    tabContentTitle: {
      margin: '2.5rem 0',
      ...typography.h3,
      [down('xs')]: {
        margin: '1.25rem 0',
        ...typography.h4,
      },
    },
  }),

  { name: 'QuestionBlock' },
);
