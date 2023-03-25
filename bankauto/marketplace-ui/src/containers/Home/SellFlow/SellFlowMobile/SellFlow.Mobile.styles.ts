import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    root: {
      paddingRight: 0,
      paddingLeft: 0,
    },
    slide: {
      height: '200px',
      background: '#E8E8E8',
      borderRadius: '8px',
      padding: '20px',
      boxSizing: 'border-box',
    },
  },
  {
    name: 'SellFlowMobile',
  },
);

export { useStyles };
