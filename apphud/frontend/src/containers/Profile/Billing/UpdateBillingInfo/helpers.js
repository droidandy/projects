import countryList from 'country-list-js'

const countryesList = countryList.ls('name')

const getName = ({ name, company_name }) => {
  if (name) return name
  if (company_name) return company_name
  return ''
}

const getPhone = ({ phone, placeholder }) => phone || placeholder

const getValue = (billing_address, name, placeholder) => {
  if (billing_address) {
    return billing_address[name] || placeholder
  }
  return ''
}

export const prepareTaxIdList = ({ list, value }) => {
  const code = (str) => str.split('_').join(' ').toUpperCase()
  if (list && list.length) {
    list = list.map((i) => {
      return {
        format: i.format,
        value: `${code(i.code)} ${i.country}`,
        code: i.code,
        country: i.country,
        country_iso: i.country_iso
      }
    })
    const find = list.find((i) => {
      const val = `${code(i.code)} ${i.country}`
      return val === value
    })
    if (value) {
      list = list.filter((i) => {
        const val = `${code(i.code)} ${i.country}`
        return val !== value
      })
      list = list.sort((a, b) => (a.country < b.country ? -1 : 1))
      list.unshift(find)
    }
    return list
  }
  return []
}

export const findFormat = ({ list, value }) => {
  const code = (str) => str.split('_').join(' ').toUpperCase()
  if (list && value) {
    const find = list.find((i) => {
      if (i) {
        const val = `${code(i.code)} ${i.country}`
        return val === value
      }
    })
    if (find) {
      return find.format
    }
  }
  return value
}

export const getTaxIdPlaceholder = (list, currentTaxIDType, taxIdTypeCountry) => {
  return (list && (list.find(item => item && `${item.country_iso}.${item.code}` === `${taxIdTypeCountry}.${currentTaxIDType}`) || {}).format) || ''
}

export const getTaxIdCountry = (list, currentTaxIDType) => {
  return (list && (list.find(item => item && item.code === currentTaxIDType) || {}).country_iso) || ''
}

export const initialParamsFormData = ({ user }) => {
  const taxIdTypesList = user.billing_address
    ? user.billing_address.tax_id_types
    : []
  const { billing_address } = user
  let county, postalCode, taxIdType, taxId, country, taxIdTypeCountry
  if (billing_address) {
    county = billing_address.state
    country = billing_address.country
    postalCode = billing_address.postal_code
    taxIdType = billing_address.tax_id_type
    taxId = billing_address.tax_id
    taxIdTypeCountry = billing_address.tax_id_country
  }

  let countyList = []
  if (county) {
    countyList = countryList.findByName(county)
    if (countyList) {
      countyList = countyList.provinces
    }
  }

  const taxIdPlaceholder = getTaxIdPlaceholder(taxIdTypesList, taxIdType, taxIdTypeCountry);
  const taxIdCountry = taxIdTypeCountry ? taxIdTypeCountry : (getTaxIdCountry(taxIdTypesList, taxIdType) || '');

  const taxIdTypeValue = `${getValue(billing_address, 'tax_id_country', '')}.${getValue(billing_address, 'tax_id_type', '')}`;

  return {
    name: {
      id: 'name',
      label: 'Name or company',
      placeholder: 'Name or company',
      value: getValue(billing_address, 'name', ''),
      required: true,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    region: {
      id: 'region',
      label: 'Country / Region',
      placeholder: 'Country / Region',
      value: getValue(billing_address, 'country', '') || countryesList.sort()[0],
      required: true,
      type: 'select',
      elementType: 'select',
      list: countryesList.sort(),
      disabled: false,
      defaultValue: country || countryesList.sort()[0],
    },
    streetAddress: {
      id: 'streetAddress',
      label: 'Street address',
      placeholder: 'Street address',
      value: getValue(billing_address, 'line1', ''),
      required: true,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    streetAddress_2: {
      id: 'streetAddress_2',
      label: 'Street address 2',
      placeholder: 'Street address 2',
      value: getValue(billing_address, 'line2', ''),
      required: false,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    city: {
      id: 'city',
      label: 'Town / City',
      placeholder: 'Town / City',
      value: getValue(billing_address, 'city', ''),
      required: true,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    county: {
      id: 'county',
      label: 'State / County',
      placeholder: 'State / County',
      value: getValue(billing_address, 'state', ''),
      required: true,
      type: (countyList && countyList.length) ? 'select' : 'input',
      elementType: (countyList && countyList.length) ? 'select' : 'input',
      list: countyList ? countyList.sort() : [],
      disabled: false,
      defaultValue: county || countyList[0],
    },
    postalCode: {
      id: 'postalCode',
      label: 'Postal code / ZIP',
      placeholder: 'Postal code / ZIP',
      value: getValue(billing_address, 'postal_code', ''),
      required: true,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    phone: {
      id: 'phone',
      label: 'Phone',
      placeholder: 'Phone',
      value: getValue(billing_address, 'phone', ''),
      required: false,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
    taxIdType: {
      id: 'taxIdType',
      label: 'Tax ID type',
      value: taxIdTypeValue,
      required: false,
      type: 'select',
      elementType: 'select',
      taxIdCountry: taxIdCountry,
      list: prepareTaxIdList({
        value: taxIdType,
        list: taxIdTypesList,
      }),
      disabled: false,
      defaultValue: taxIdTypesList ? (taxIdTypesList.length ? taxIdTypesList[0].value : '') : '',
    },
    taxId: {
      id: 'taxId',
      label: 'Tax ID',
      placeholder: taxIdPlaceholder,
      value: getValue(billing_address, 'tax_id', ''),
      required: false,
      type: 'text',
      elementType: 'input',
      disabled: false,
    },
  }
}
