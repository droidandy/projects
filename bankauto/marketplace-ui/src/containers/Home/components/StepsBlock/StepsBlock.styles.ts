import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { secondary, text }, breakpoints: { down } }) => {
    return {
      stepsBlockWrapper: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflowX: 'scroll',
        paddingTop: '2.5rem',
        margin: '0 -0.625rem',
        '&.info': {
          justifyContent: 'center',
          [down('xs')]: {
            justifyContent: 'flex-start',
          },
        },
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::scrollbar': {
          display: 'none',
        },
        [down('xs')]: {
          justifyContent: 'flex-start',
          paddingTop: '1.25rem',
        },
      },
      stepsItemWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        padding: '2.125rem 1.25rem 2.25rem 1.25rem',
        width: '20.25rem',
        [down('xs')]: {
          backgroundColor: secondary.light,
          alignSelf: 'stretch',
          width: 'calc(97% - 1.25rem)',
          minWidth: 'calc(97% - 1.25rem)',
          marginRight: '0.625rem',
          '&:first-of-type': {
            marginLeft: '0.625rem',
          },
        },
      },
      stepsItemTextWrapper: {
        marginTop: '2.5rem',
        [down('xs')]: {
          marginTop: '1.375rem',
        },
      },
      stepsItemText: {
        whiteSpace: 'pre-wrap',
        textAlign: 'center',
      },
      stepsItemSubText: {
        color: text.primary,
        fontWeight: 400,
        marginTop: '1.25rem',
        whiteSpace: 'pre-wrap',
        textAlign: 'center',
      },
    };
  },
  { name: 'StepsBlock' },
);
