import React, { FC, useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Box, Typography, useBreakpoints, Button } from '@marketplace/ui-kit';
import { ReactComponent as CheckMark } from '../../icons/СheckMark.svg';
import { CardWithAnimation } from '../../../components';
import { useStyles } from './CardBlock.styles';

interface Props {
  percent?: number;
  buttonClickHandler: () => void;
}

const CardBlock: FC<Props> = ({ percent, buttonClickHandler }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const cardEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardEl?.current) {
      const card = cardEl?.current;
      VanillaTilt.init(card, {
        reverse: true,
        glare: true,
        max: 15,
        speed: 3000,
        startX: -20,
        startY: isMobile ? 20 : 5,
      });
    }
  }, [cardEl, isMobile]);

  useEffect(() => {
    if (!window) return;
    const onScroll = () => {
      if (cardEl?.current) {
        const card = cardEl?.current;
        if (card.offsetTop + card.clientHeight / 2 - window.screen.availHeight / 2 < window.scrollY) {
          card.style.transition = 'all 3000ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s';
          card.style.transform = 'perspective(1000px) rotateX(15deg) rotateY(-10deg) scale3d(1, 1, 1)';
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      border="1px solid #E8E8E8"
      padding={isMobile ? '1.25rem' : '1.875rem 2.5rem 2.5rem'}
      borderRadius="0.5rem"
      height="100%"
    >
      <Box mb="0.5rem">
        <Typography variant={isMobile ? 'h5' : 'h3'}>Надбавка к ставке в размере</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box mr="0.6875rem" fontSize={isMobile ? '2rem' : '3rem'} fontWeight="700" color="#990031">
          {String(percent).replace('.', ',')}%
        </Box>
        <Box fontWeight="700" fontSize={isMobile ? '0.75rem' : '1rem'} lineHeight={isMobile ? '1rem' : '1.5rem'}>
          за покупки по карте «АвтоДрайв»
          <br /> на сумму от 10 000,01
        </Box>
      </Box>

      <CardWithAnimation
        imgUrl="/images/savingsAccount/card.png"
        className={s.animationWrapper}
        imgClassName={s.animationImage}
      />

      <Box display="flex" mb="0.625rem" alignItems="center">
        <Box paddingRight="1.25rem">
          <CheckMark />
        </Box>
        <Typography variant={isMobile ? 'body2' : 'inherit'}>
          Карта «АвтоДрайв» оформляется бесплатно к вашему накопительному счету
        </Typography>
      </Box>
      <Box display="flex" mb={isMobile ? '1.25rem' : '1.5625rem'} alignItems="center">
        <Box paddingRight="1.25rem">
          <CheckMark />
        </Box>
        <Typography variant={isMobile ? 'body2' : 'inherit'}>
          Совершайте покупки по карте и получайте надбавку к базовой ставке
        </Typography>
      </Box>
      <Button variant="contained" color="primary" size="large" fullWidth onClick={buttonClickHandler}>
        <Typography variant="h5" component="span">
          Открыть счет
        </Typography>
      </Button>
    </Box>
  );
};

export { CardBlock };
