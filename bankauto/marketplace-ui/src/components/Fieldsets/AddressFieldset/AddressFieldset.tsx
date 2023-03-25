import React, { FC, useEffect } from 'react';
import { Field } from 'react-final-form';
import { Box, Grid, InfoTooltip, Switch, Typography, useBreakpoints } from '@marketplace/ui-kit';

import { AsyncAutocompleteNew as AsyncAutocomplete, SelectNew as Select } from 'components/Fields';
import { AutocompleteOption } from 'components/Autocomplete';
import { WithOnBlur } from 'types/WithOnBlur';
import { ADDRESS_TYPE_OPTIONS } from './data';

interface Props extends WithOnBlur<any> {
  addressMatches: boolean;
  loadAddressOptions: (query: string) => Promise<AutocompleteOption[]>;
  isSimpleCredit?: boolean;
}

const REG_ADDRESS_HINT_TEXT =
  'Если улица была переименована, необходимо указывать новое название, даже если в паспорте пока указано старое';

const AddressFieldset: FC<Props> = ({ addressMatches, loadAddressOptions, onBlur, isSimpleCredit = false }) => {
  const { isMobile } = useBreakpoints();
  const renderAddressMatches = () => (
    <Grid item>
      <Field name="addressMatches">
        {({ input }) => (
          <Switch
            label={
              <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'}>Совпадает с адресом регистрации</Typography>
            }
            checked={input.value}
            onBlur={input.onBlur}
            onChange={() => {
              input.onChange(!input.value);
            }}
          />
        )}
      </Field>
    </Grid>
  );

  useEffect(() => {
    onBlur?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressMatches]);

  return (
    <Grid container direction="column">
      <Grid item>
        <Box padding={isMobile ? '0 0 1.25rem 0' : '0 0 1.875rem 0'}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">
                Адрес регистрации{' '}
                <InfoTooltip
                  title={
                    <Box color="primary.contrastText">
                      <Typography variant="body2" color="inherit">
                        {REG_ADDRESS_HINT_TEXT}
                      </Typography>
                    </Box>
                  }
                />
              </Typography>
            </Grid>
            {isSimpleCredit && renderAddressMatches()}
          </Grid>
        </Box>
        <Grid container spacing={isMobile || isSimpleCredit ? 1 : 4}>
          {!isSimpleCredit && (
            <Grid item xs={12} sm={4}>
              <Select
                name="regAddressType"
                placeholder="Тип жилья"
                variant="outlined"
                options={ADDRESS_TYPE_OPTIONS}
                onBlur={onBlur}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={isSimpleCredit ? 12 : 8}>
            <AsyncAutocomplete
              name="regAddress"
              placeholder="Адрес"
              variant="outlined"
              loadOptions={loadAddressOptions}
              filterOptions={(options: any) => options}
              onBlur={onBlur}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Box padding={isMobile ? '1.25rem 0' : '1.625rem 0 1.875rem 0'}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">Адрес проживания</Typography>
            </Grid>
            {!isSimpleCredit && renderAddressMatches()}
          </Grid>
        </Box>
        <Grid container spacing={isMobile ? 1 : 4}>
          <Grid item xs={12}>
            <AsyncAutocomplete
              name="factAddress"
              placeholder="Адрес"
              variant="outlined"
              disabled={addressMatches}
              loadOptions={loadAddressOptions}
              filterOptions={(options: any) => options}
              onBlur={onBlur}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { AddressFieldset };
