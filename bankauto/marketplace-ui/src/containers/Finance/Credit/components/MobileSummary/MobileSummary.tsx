import React, { FC, useState, useEffect } from 'react';
import { Box, PriceFormat, Typography } from '@marketplace/ui-kit';

interface Props {
  amount: number;
  monthlyPayment: number;
  rate: number;
  creditFormRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MobileSummary: FC<Props> = ({ amount, monthlyPayment, rate, creditFormRef }) => {
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    if (!window) return;
    const onScroll = () => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener('scroll', onScroll);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);
  const formTop = creditFormRef?.current?.offsetTop;

  return (
    <Box
      p="0.375rem"
      mt="-1.625rem"
      position="sticky"
      top="69px"
      display="flex"
      bgcolor="#fff"
      justifyContent="space-around"
      zIndex={90}
      visibility={formTop && scrollTop + 70 > formTop ? 'visible' : 'hidden'}
    >
      <Box textAlign="center">
        <Typography variant="subtitle2" component="div">
          Ставка
        </Typography>
        <Typography variant="subtitle1" color="primary" component="div">
          от {(rate * 100).toFixed(1)} %
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" component="div">
          Сумма
        </Typography>
        <Typography variant="subtitle1" component="div">
          <PriceFormat value={amount} />
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" component="div">
          Платёж
        </Typography>
        <Typography variant="subtitle1" component="div">
          от <PriceFormat value={monthlyPayment} />
        </Typography>
      </Box>
    </Box>
  );
};

export { MobileSummary };
