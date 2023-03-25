import React from 'react';
import { Typography } from '@material-ui/core';
import { CompanyNew, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { City } from 'types/City';
// import { useCity } from 'store/city';
// import { useStyles } from './PartnerBlock.styles';

type PartnerBlockProps = {
  company: CompanyNew;
  brandName: string;
  className?: string;
  type: VEHICLE_TYPE;
  city: City;
};

export const PartnerBlock = ({
  // company: { logo, name, officeAddress },
  brandName,
  // className,
  city,
  type,
}: PartnerBlockProps) => {
  // const s = useStyles();
  // const { current } = useCity();
  return (
    <>
      {/* <Box display="flex" justifyContent="center" className={`${s.root} ${className}`}>
        <Box mb={2.5} className={s.dealer}>
          {logo ? (
            <Box className={s.dealerLogoWrapper}>
              <Img src={logo} alt={name} />
            </Box>
          ) : (
            <Typography variant="body1" align="center">
              {name}
            </Typography>
          )}
        </Box>
      </Box> */}

      <Typography component="pre" variant="subtitle1" align="center">
        {`Официальный дилер ${type === VEHICLE_TYPE.NEW ? brandName : ''} ${city?.name ? `\n г. ${city?.name}` : ''}`}
      </Typography>

      {/* <Typography variant="caption" component="p" align="center" color="secondary">
        {officeAddress}
      </Typography> */}
    </>
  );
};
