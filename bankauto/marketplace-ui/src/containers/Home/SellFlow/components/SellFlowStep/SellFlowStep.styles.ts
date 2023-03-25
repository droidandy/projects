import { makeStyles, Theme } from '@material-ui/core/styles';

type SellFlowStepProps = {
  dark: boolean;
};

const useStyles = makeStyles<Theme, SellFlowStepProps>(
  ({
    palette: {
      text: { primary },
      primary: { contrastText },
    },
  }) => ({
    icon: {
      textAlign: 'center',
    },
    title: {
      color: ({ dark }) => (dark ? primary : contrastText),
    },
  }),
  {
    name: 'SellFlowStep',
  },
);

export { useStyles };
