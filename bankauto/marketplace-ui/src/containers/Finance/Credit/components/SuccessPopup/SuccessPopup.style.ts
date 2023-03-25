import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  animationBlock: {
    fontSize: '0.625rem',
    width: '62.4em',
    height: '17.4em',
    margin: '1em -21em 0px 0',
    [down('xs')]: {
      margin: '2.4em -10.5em 0px 0',
      width: '57.4em',
      height: '16em',
      maxWidth: '182%',
      fontSize: '0.6rem',
    },
  },
  animationCar: {
    position: 'relative',
    width: '63.4em',
    height: '17.4em',
    background: 'url("/images/finance/animationCar/car.png") no-repeat',
    backgroundSize: 'contain',
  },
  animationWheel: {
    position: 'absolute',
    width: '7.2em',
    height: '7.2em',
    top: '6.3em',
    left: '13em',
    background: 'url("/images/finance/animationCar/wheel-left.png") no-repeat',
    backgroundSize: 'contain',
  },
  animationWheelRight: {
    backgroundImage: 'url("/images/finance/animationCar/wheel-right.png")',
    left: '40.7em',
    top: '5.9em',
    width: '7.6em',
    height: '7.6em',
  },
  addAnimationForBg: {
    animation: '$bgAnimation 2s ease-in',
    animationFillMode: 'forwards',
  },
  addAnimationForCar: {
    animation: '$motion 2s ease-in',
    animationFillMode: 'forwards',
  },
  addAnimationForWheel: {
    animation: '$wheelMotion 2s ease-in',
    animationFillMode: 'forwards',
  },
  '@keyframes motion': {
    '0%': {
      transform: 'translateX(0)',
    },
    '40%': {
      transform: 'translateX(15em)',
    },
    '100%': {
      transform: 'translateX(-154.5em)',
    },
  },
  '@keyframes wheelMotion': {
    '0%': {
      transform: 'rotate(0)',
    },
    '35%': {
      transform: 'rotate(200deg)',
    },
    '100%': {
      transform: 'rotate(-1200deg)',
    },
  },
  '@keyframes bgAnimation': {
    '0%': {
      overflow: 'visible',
    },
    '75%': {
      overflow: 'hidden',
    },
    '100%': {
      overflow: 'hidden',
    },
  },
}));

export { useStyles };
