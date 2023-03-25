import React, { useEffect, useState, useMemo } from 'react';
import { Formik } from 'formik';
import { FormProps } from 'types/FormProps';
import { PartnerNewFormData } from '../../types/ParnterNewFormData';
import { PartnerNewFormSchema } from './PartnerNewForm.schema';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import { useStyles } from './PartnerNewForm.styles';
// import { Select as SelectAutoComplete } from 'components/Select'

import { MaskedInput } from '../MaskedInput';
import { PHONE_INPUT_FORMAT } from '../../constants/inputFormats';
import { getPartnerCities } from 'api/partner/getPartnerCities';
import { getCompanyTypes } from 'api/partner/getCompanyTypes';
import { CompanyType } from 'types/CompanyType';
import { PartnerCity } from 'types/PartnerCity';
import { FilterItem } from 'types/FilterItem';

interface Props extends FormProps {
  handleSubmit: (values: PartnerNewFormData) => void;
}

function PartnerNewForm({ validationErrors, handleSubmit }: Props): JSX.Element {
  const { input, inputLabel, customSelectInput } = useStyles();
  const [cities, setCities] = useState<PartnerCity[]>([
    {
      id: 19737,
      name: 'Самара',
      region: 'Самарская область',
    },
  ]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[] | null>(null);
  useEffect(() => {
    getPartnerCities().then(({ data }) => setCities(data));
    getCompanyTypes().then(({ data }) => setCompanyTypes(data));
  }, []);

  const citiesMapped: FilterItem[] = useMemo(
    () => cities.map((elem) => ({ title: `${elem.name}, ${elem.region}`, value: elem.id })),
    [cities],
  );

  const PARTNER_INITIAL_VALUES: PartnerNewFormData = {
    city: citiesMapped[0],
    companyType: [],
    companyName: '',
    name: '',
    email: '',
    phone: '',
    comment: '',
  };

  return (
    <Formik initialValues={PARTNER_INITIAL_VALUES} validationSchema={PartnerNewFormSchema} onSubmit={handleSubmit}>
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        isValid,
        dirty,
        touched,
        errors,
        values: { city, companyType, companyName, name, email, phone, comment },
      }) => {
        errors = { ...errors, ...validationErrors };
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={customSelectInput}>
                  {/* <SelectAutoComplete
                    placeholder="Город"
                    name="cityId"
                    options={citiesMapped}
                    onChange={handleChangeFormValue}
                    value={citiesFormValue}
                  /> */}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={customSelectInput}>
                  <InputLabel className={inputLabel} id="city-filled-label">
                    Сфера деятельности
                  </InputLabel>
                  <Select
                    multiple
                    labelId="company-type-filled-label"
                    id="company-type-filled-label"
                    type="text"
                    placeholder="Выберите сферу деятельности"
                    label="Сфера деятельности"
                    color="secondary"
                    variant="outlined"
                    name="companyType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={companyType}
                  >
                    {companyTypes
                      ? Object.entries(companyTypes).map(([key, value]) => (
                          <MenuItem key={key} value={+key}>
                            {value}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={input}
                  type="text"
                  label="Название компании"
                  placeholder="Название компании"
                  variant="outlined"
                  size="small"
                  name="companyName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={companyName}
                  error={!!errors.companyName && !!touched.companyName}
                  helperText={!!touched.companyName && errors.companyName}
                  color="secondary"
                  InputLabelProps={{
                    className: inputLabel,
                    color: 'secondary',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={input}
                  type="text"
                  label="Ваше имя"
                  placeholder="Ваше имя"
                  variant="outlined"
                  size="small"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={name}
                  error={!!errors.name && !!touched.name}
                  helperText={!!touched.name && errors.name}
                  color="secondary"
                  InputLabelProps={{
                    className: inputLabel,
                    color: 'secondary',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={input}
                  type="email"
                  label="email"
                  placeholder="email"
                  variant="outlined"
                  size="small"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={email}
                  error={!!errors.email && !!touched.email}
                  helperText={!!touched.email && errors.email}
                  color="secondary"
                  InputLabelProps={{
                    className: inputLabel,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={input}
                  type="text"
                  label="Телефон"
                  placeholder="Телефон"
                  variant="outlined"
                  size="small"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={phone}
                  color="secondary"
                  InputProps={{
                    inputComponent: MaskedInput as any,
                    inputProps: { format: PHONE_INPUT_FORMAT },
                  }}
                  error={!!errors.phone && !!touched.phone}
                  helperText={!!touched.phone && errors.phone}
                  InputLabelProps={{
                    className: inputLabel,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={input}
                  multiline
                  type="text"
                  label="Комментарий"
                  placeholder="Комментарий"
                  variant="outlined"
                  size="small"
                  name="comment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={comment}
                  color="secondary"
                  InputLabelProps={{
                    className: inputLabel,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" disabled={!dirty || !isValid}>
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}

export { PartnerNewForm };
