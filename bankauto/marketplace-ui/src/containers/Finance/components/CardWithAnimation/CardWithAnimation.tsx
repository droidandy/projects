import React, { FC, useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { useBreakpoints, Box } from '@marketplace/ui-kit';

interface Props {
  imgUrl: string;
  imgName?: string;
  className?: string;
  imgClassName?: string;
}

const CardWithAnimation: FC<Props> = ({ imgUrl, imgName, className, imgClassName }) => {
  const { isMobile } = useBreakpoints();
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
    <Box margin="-1.25rem" padding="1.25rem" overflow="hidden">
      <div ref={cardEl} className={className}>
        {/* Компонент Img работает не правильно с анимацией */}
        <img className={imgClassName} src={imgUrl} alt={imgName || ''} style={{ maxWidth: '100%' }} />
      </div>
    </Box>
  );
};

export { CardWithAnimation };
