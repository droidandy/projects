import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      card: {
        display: 'flex',
        flexDirection: 'row',
        [down('xs')]: {
          flexDirection: 'column',
          marginLeft: '1.25rem',
          marginRight: '1.25rem',
        },
      },
      cardLeft: {
        display: 'flex',
        flexDirection: 'column',
      },
      cardRight: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: '10rem',
        flexShrink: 0,
        marginLeft: '1.25rem',
        marginRight: '1.25rem',
        [down('xs')]: {
          marginLeft: 0,
          marginRight: 0,
          minWidth: 'auto',
        },
      },
      block: {
        marginBottom: '1rem',
        [down('xs')]: {
          marginBottom: '0.75rem',
        },
      },
      features: {
        display: 'flex',
        flexDirection: 'column',
        [down('xs')]: {
          flexDirection: 'row',
          marginBottom: '0.875rem',
        },
      },
      feature: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.35rem',
        [down('xs')]: {
          marginBottom: 0,

          '&:not(:first-child)': {
            marginLeft: '1.25rem',
            marginBottom: 0,
          },
        },
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.35rem',
      },
      icon: {
        lineHeight: 0,
        marginRight: '0.75rem',
      },
      workSchedule: {
        [down('xs')]: {
          marginBottom: '1.25rem',
        },
      },
      userReview: {
        [down('xs')]: {
          marginBottom: '1.25rem',
        },
      },
    };
  },
  { name: 'AutoRepairShop' },
);

export { useStyles };
