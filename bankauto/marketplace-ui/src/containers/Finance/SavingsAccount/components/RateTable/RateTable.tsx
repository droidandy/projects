import React, { FC, FormEvent, useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { SwitchPanel } from 'components';
import { CARD_SPENDING } from '../../types';

type Rate = {
  amount: string;
  basicRate: number;
  higherRate: number;
  order: number;
};

interface Props {
  rates: Rate[];
  cardSpending: CARD_SPENDING;
  setCardSpending: React.Dispatch<React.SetStateAction<CARD_SPENDING>>;
}

const useStyles = makeStyles(({ breakpoints: { up, down } }) => ({
  switchPanel: {
    margin: 0,
    [down('xs')]: {
      '& label': {
        margin: '0 0.375rem',
      },
    },
    [up('sm')]: {
      '& label': {
        fontSize: '1.25rem',
        padding: '0.875rem',
      },
    },
  },
}));

const RateTable: FC<Props> = ({ rates, cardSpending, setCardSpending }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  const renderRates = useMemo(
    () =>
      rates
        .sort((a, b) => a.order - b.order)
        .map((rateItem, index) => (
          <Box
            borderTop="1px solid #E8E9EB"
            pt={isMobile ? '1.062rem' : '1.5rem'}
            mb={isMobile ? '1.1875rem' : '1.75rem'}
            display="flex"
            alignItems="center"
          >
            <Box
              width={isMobile ? '70%' : '56%'}
              pr="1rem"
              fontSize={isMobile ? '0.75rem' : '1.25rem'}
              fontWeight={isMobile && 600}
            >
              {rateItem.amount} ₽
            </Box>
            <Box>
              <Typography variant={isMobile ? 'h3' : 'h2'} color={index === 0 ? 'primary' : 'inherit'}>
                {String(cardSpending === CARD_SPENDING.NONE ? rateItem.basicRate : rateItem.higherRate).replace(
                  '.',
                  ',',
                )}
                %
              </Typography>
            </Box>
          </Box>
        )),
    [cardSpending, isMobile, rates],
  );

  const renderSwitchPanel = useMemo(() => {
    const handleSetCardSpending = (event: FormEvent<HTMLFieldSetElement>) => {
      const input = event.target as HTMLInputElement;
      setCardSpending(+input.value);
    };
    return (
      <Box p={isMobile ? '1.1875rem 0 0.25rem' : '3.85rem 0 1.25rem'}>
        <SwitchPanel
          items={['Покупки от 10 000 ₽', 'Не трачу']}
          activeItem={cardSpending}
          onChange={handleSetCardSpending}
          className={s.switchPanel}
        />
      </Box>
    );
  }, [cardSpending, isMobile, s.switchPanel, setCardSpending]);

  return (
    <Box
      border={!isMobile && '1px solid #E8E8E8'}
      padding={!isMobile && '4rem 3.75rem'}
      borderRadius="0.5rem"
      height="100%"
    >
      <Box>
        <Box
          mb={isMobile ? '0.875rem' : '2.5rem'}
          display="flex"
          alignItems="center"
          justifyContent={isMobile && 'space-between'}
        >
          <Box width={isMobile ? '70%' : '56%'} pr="1rem">
            <Typography variant={isMobile ? 'h6' : 'h4'}>Сумма на{isMobile && <br />} накопительном счете</Typography>
          </Box>
          <Box width={isMobile ? '30%' : 'auto'}>
            <Typography variant={isMobile ? 'h6' : 'h4'}>Процентная ставка</Typography>
          </Box>
        </Box>
        {renderRates}
      </Box>
      {renderSwitchPanel}
    </Box>
  );
};

export { RateTable };
