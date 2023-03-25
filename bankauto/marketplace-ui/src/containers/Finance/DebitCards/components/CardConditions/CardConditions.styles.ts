import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  container: {
    [down('xs')]: {
      '& .swiper-wrapper': {
        '& .swiper-slide': {
          height: '200px',
          boxSizing: 'border-box',
          '& > div': {
            height: '100%',
          },
        },
      },
    },
  },
}));

export { useStyles };
