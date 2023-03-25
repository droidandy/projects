import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, OmniLink, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { CatalogBrandsShort } from '@marketplace/ui-kit/types';
import { useStyles } from './BrandsList.styles';

type Props = {
  brands: CatalogBrandsShort[] | null;
  pathGeneration?: (brand: CatalogBrandsShort) => string;
  className?: string;
  blocksCount?: number;
};

const DESCTOP_SHORT_COUNT = 19;
const MOBILE_SHORT_COUNT = 10;

const getSortedBrandsByCount = (brands: CatalogBrandsShort[]) =>
  brands.sort(({ vehiclesCount: a }, { vehiclesCount: b }) => (a === b ? 0 : a > b ? -1 : 1));
const getSortedBrandsByName = (brands: CatalogBrandsShort[]) => brands.sort((a, b) => a.name.localeCompare(b.name));

const ToggleButton: FC<{ handleClick: () => void; isShort: boolean; isMobile: boolean }> = ({
  isShort,
  handleClick,
  isMobile,
}) => {
  const s = useStyles();
  const buttonText = isShort ? 'Показать все' : 'Свернуть';
  return isMobile ? (
    <Box pt={2.5} width="100%">
      <Button variant="contained" size="large" color="primary" onClick={handleClick} fullWidth>
        <Typography component="div" variant="h5">
          {buttonText}
        </Typography>
      </Button>
    </Box>
  ) : (
    <Typography component="div" variant="h5" color="primary" onClick={handleClick} className={s.showAll}>
      {buttonText}
    </Typography>
  );
};

export const BrandsList: FC<Props> = ({ brands, pathGeneration, className, blocksCount = 4 }) => {
  const s = useStyles();
  const [isShort, setIsShort] = useState<boolean>(true);
  const [currentBrands, setCurrentBrands] = useState<CatalogBrandsShort[] | null>(null);
  const { isMobile } = useBreakpoints();

  // Уберает проблемы мелькания при переключении табов
  useEffect(() => {
    setCurrentBrands(brands);
    return () => {
      setCurrentBrands(null);
    };
  }, [brands]);

  const handleClick = useCallback(() => {
    setIsShort(!isShort);
  }, [isShort]);

  const [brandsList, brandsBlocks, showToggleButton] = useMemo(() => {
    if (!currentBrands) {
      return [null, null, false];
    }

    const actualBrands = currentBrands.filter((item) => item.vehiclesCount);
    const brandsLength = actualBrands.length;

    if (!brandsLength) {
      return [null, null, false];
    }

    if (!isShort && isMobile && brandsLength <= MOBILE_SHORT_COUNT) {
      return [getSortedBrandsByName(actualBrands), null, false];
    }

    const showMoreDesctop = !isMobile && brandsLength > DESCTOP_SHORT_COUNT;
    const showMoreMobile = isMobile && brandsLength > MOBILE_SHORT_COUNT;

    const showBrandsCount = isMobile ? MOBILE_SHORT_COUNT : DESCTOP_SHORT_COUNT;
    const brandsData = showMoreDesctop || showMoreMobile ? getSortedBrandsByCount(actualBrands) : actualBrands;
    const cutBrands = !isShort ? brandsData : brandsData.slice(0, showBrandsCount);
    const sortedBrandsByName = getSortedBrandsByName(cutBrands);

    if (isMobile) {
      return [sortedBrandsByName, null, true];
    }

    const baseSize = Math.floor(cutBrands.length / blocksCount);
    const p = cutBrands.length % blocksCount;

    return [
      null,
      Array(blocksCount)
        .fill(baseSize)
        .map((_, i) => baseSize + +(i < p))
        .map((item, i, arr) => (arr[i] = item + (arr[i - 1] || 0)))
        .map((item, i, arr) => sortedBrandsByName.slice(arr[i - 1] || 0, item)),
      showMoreDesctop,
    ];
  }, [isMobile, currentBrands, isShort]);

  if (!brandsList && !brandsBlocks) {
    return null;
  }

  const getBrandsList = (brands: CatalogBrandsShort[]) =>
    brands.map((brand) => (
      <OmniLink key={brand.id} href={pathGeneration ? pathGeneration(brand) : `/car/new/${brand.alias}/`}>
        <Box display="flex" justifyContent="space-between" pb={isMobile ? 0 : 1.25}>
          <Typography className={s.text} variant={isMobile ? 'subtitle1' : 'body2'} color="textPrimary">
            {brand.name}
          </Typography>
          <Typography
            className={`${s.vehicleCount} ${s.text}`}
            variant={isMobile ? 'subtitle1' : 'body2'}
            color="textSecondary"
          >
            {brand.vehiclesCount}
          </Typography>
        </Box>
      </OmniLink>
    ));

  return (
    <Grid container justify="flex-start">
      {brandsList && (
        <Grid item xs={12} className={className}>
          {getBrandsList(brandsList)}
          {showToggleButton && <ToggleButton handleClick={handleClick} isShort={isShort} isMobile={isMobile} />}
        </Grid>
      )}
      {brandsBlocks &&
        brandsBlocks.map((block, index) => (
          <Grid item key={index} sm className={className}>
            {!!block.length && getBrandsList(block)}
            {index === brandsBlocks.length - 1 && showToggleButton && (
              <ToggleButton handleClick={handleClick} isShort={isShort} isMobile={isMobile} />
            )}
          </Grid>
        ))}
    </Grid>
  );
};
