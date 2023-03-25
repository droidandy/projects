import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme, { active: boolean }>(
  ({ breakpoints: { down }, typography, palette: { common, grey, primary } }) => ({
    container: {
      margin: '0 0.25rem',
      overflow: 'hidden',
      cursor: 'pointer',
      background: ({ active }) => (active ? primary.main : 'none'),
      borderRadius: '0.25rem',
      padding: '0.5rem  1.125rem 0.625rem 1.125rem',
      [down('xs')]: {
        padding: '0.188rem  0.938rem 0.313rem 0.938rem',
      },
    },
    label: {
      ...typography.body1,
      fontWeight: 'bold',
      textAlign: 'center',
      color: ({ active }) => (active ? common.white : common.black),
    },
  }),
  { name: 'Button' },
);

export { useStyles };
