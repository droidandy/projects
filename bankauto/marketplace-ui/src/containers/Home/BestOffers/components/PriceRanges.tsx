import React, { FC, useMemo } from 'react';
import { Box, Typography, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/core/styles';
import { BoxProps } from '@material-ui/core/Box/';
import { BEST_OFFERS_PRISE_RANGES } from 'constants/bestOffersPriceRanges';

type Props = {
  onChange: (priceMin: number, priceMax: number, index: number) => void;
  currentIndex: number;
};

interface PriceRangesButtonProps extends BoxProps {
  onClick: () => void;
  priceMin: number;
  priceMax: number;
  isActive?: boolean;
}

const useStyles = makeStyles(() => ({
  buttonsWrapper: {
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&::scrollbar': {
      display: 'none',
    },
  },
}));

const PriceRangesButton: FC<PriceRangesButtonProps> = ({ priceMin, priceMax, isActive, onClick, ...rest }) => {
  return (
    <Box
      {...rest}
      py={1}
      px={1.25}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="0.5rem"
      onClick={onClick}
      border="1px solid"
      borderColor="secondary.light"
      bgcolor={isActive ? 'secondary.light' : 'common.white'}
      style={{ cursor: 'pointer' }}
    >
      {priceMax ? (
        <Typography variant={isActive ? 'h5' : 'subtitle1'} component="span" noWrap>
          {priceMin ? <>{priceMin.toLocaleString('fr')} &mdash;</> : 'До'} <PriceFormat value={priceMax} />
        </Typography>
      ) : (
        <Typography variant={isActive ? 'h5' : 'subtitle1'} component="span" noWrap>
          Более <PriceFormat value={priceMin} />
        </Typography>
      )}
    </Box>
  );
};

export const PriceRanges: FC<Props> = ({ onChange, currentIndex }) => {
  const { isMobile } = useBreakpoints();
  const { buttonsWrapper } = useStyles();
  const handleChange = ({ priceMin, priceMax }: { priceMin: number; priceMax: number }, index: number) => {
    return () => {
      onChange(priceMin, priceMax, index);
    };
  };

  const buttonList = useMemo(
    () =>
      BEST_OFFERS_PRISE_RANGES.map((item, index) => (
        <PriceRangesButton
          onClick={handleChange(item, index)}
          isActive={currentIndex === index}
          ml={index && 1.25}
          {...item}
        />
      )),
    [currentIndex, onChange],
  );

  return (
    <Box display="flex" justifyContent={isMobile ? 'flex-start' : 'center'} pt={2.5} className={buttonsWrapper}>
      {buttonList}
    </Box>
  );
};
