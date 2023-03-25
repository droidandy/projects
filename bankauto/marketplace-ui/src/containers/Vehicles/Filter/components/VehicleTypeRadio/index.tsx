import React, { FC } from 'react';
import { Field } from 'react-final-form';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useFieldValue } from 'components/Fields/helpers';

interface Option {
  label: JSX.Element | string;
  key: string;
  value: number | null;
}

interface Props {
  name: string;
  options: Option[];
}

export const VehicleTypeRadio: FC<Props> = ({ name: fieldName, options }) => {
  const { isMobile } = useBreakpoints();
  const activeType = useFieldValue(fieldName);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor={isMobile ? 'common.white' : 'secondary.light'}
      borderRadius="0.5rem"
      alignItems="center"
      padding={0.75}
    >
      {options.map(({ key, label, value }) => {
        const isActive = (activeType !== '' && value === +activeType) || (activeType === '' && value === null);

        return (
          <label key={key} htmlFor={key} style={{ cursor: 'pointer', flexBasis: '100%' }}>
            <Field name={fieldName} type="radio" id={key} value={value} component="input" style={{ display: 'none' }} />

            <Box
              bgcolor={isActive && 'primary.main'}
              color={isActive && 'common.white'}
              display="flex"
              borderRadius="0.25rem"
              flexWrap="noWrap"
              justifyContent="center"
              pt={0.375}
              pb={0.625}
            >
              <Typography variant={isActive ? 'h6' : 'subtitle2'}>{label}</Typography>
            </Box>
          </label>
        );
      })}
    </Box>
  );
};
