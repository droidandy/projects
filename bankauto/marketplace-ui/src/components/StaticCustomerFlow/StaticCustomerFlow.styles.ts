import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down, up } }) => ({
    container: {
      paddingBottom: '6.25rem',

      [down('xs')]: {
        overflow: 'hidden',
        paddingTop: '1.875rem',
        paddingBottom: '1.875rem',
        // same height for all slides
        '& .swiper-wrapper': {
          '& .swiper-slide': {
            height: 'initial',
            '& > div': {
              height: '100%',
              '& > div': {
                height: '100%',
                boxSizing: 'border-box',
              },
            },
          },
        },
      },
    },
    containerWithoutPadding: {
      paddingBottom: 0,
      [down('xs')]: {
        overflow: 'hidden',
        paddingBottom: '1.875rem',
      },
    },
    flowRoot: {
      padding: '2.5rem 1.875rem 2.5rem 1.875rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      justifyContent: 'space-around',
      boxSizing: 'border-box',

      [down('md')]: {
        justifyContent: 'center',
      },
    },
    shadow: {
      boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
    },
    shortList: {
      justifyContent: 'space-around',
    },

    flowItemRoot: {
      margin: '0 1rem',
    },

    withSubTitle: {
      [up('sm')]: {
        '& > div > div > div': {
          maxWidth: '25%',
          flexBasis: '25%',
          '& > div::after': {
            right: '-10%',
            color: 'green',
          },
        },
        '& h5': {
          width: '100%',
          padding: '1.25rem 0',
        },
      },

      [down('xs')]: {
        '& span': {
          minHeight: '2.5rem',
          width: 'initial',
        },
      },
    },
  }),
  {
    name: 'StaticCustomerFlow',
  },
);

export { useStyles };
