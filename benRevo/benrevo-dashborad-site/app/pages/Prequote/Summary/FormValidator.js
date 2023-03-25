import validator from 'validator';
import {
    CLIENT_NAME,
    EFFECTIVE_DATE,
    DUE_DATE,
    SIC_CODE,
    ZIP,
    DBA,
} from '@benrevo/benrevo-react-clients';
import {
  checkSetError,
  checkDeleteError,
  validateOptions,
  validateContribution,
  validateCaptureRates,
  validateEnrollment,
  validateClientInfoNumber,
  CHANGE_COMMISSION,
  CARRIERS,
  PLEASE_ENTER_A_NUMBER,
  PLEASE_FILL,
  PLEASE_ENTER_A_DATE,
  PLEASE_FILL_PLAN,
} from '@benrevo/benrevo-react-rfp';
import { MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION, CLIENT_SECTION } from '../constants';

export function validateInfo(props, section) {
  let isValid = true;
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const checkCarrier = (name) => {
    const arr = props[name];
    let valid = true;

    arr.map((item) => {
      if (validator.isEmpty(item.title) || !item.years || (item.years && validator.isEmpty(item.years.toString()))) {
        valid = false;
        return valid;
      }
      return true;
    });

    return valid;
  };

  if (validator.isEmpty(props.commission)) {
    setError(props, section, CHANGE_COMMISSION, PLEASE_ENTER_A_NUMBER);
    isValid = false;
  } else deleteError(props, section, CHANGE_COMMISSION);

  if (!checkCarrier('carriers') && !props.virginCoverage[section]) {
    setError(props, section, CARRIERS, PLEASE_FILL);
    isValid = false;
  } else deleteError(props, section, CARRIERS);

  return isValid;
}

export function validateClientInfo(props, section) {
  let isValid = true;
  const client = props.client;
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const fields = [];
  const fieldsDates = [EFFECTIVE_DATE, DUE_DATE];
  const fieldsEmpty = [CLIENT_NAME, SIC_CODE, ZIP, DBA];

  fieldsDates.map((item) => {
    const value = (client[item]) ? !validator.isEmpty(client[item]) : false;
    if (value === false) {
      setError(props, section, item, PLEASE_ENTER_A_DATE);
      isValid = false;
    } else deleteError(props, section, item);

    return true;
  });

  fieldsEmpty.map((item) => {
    const value = (client[item]) ? !validator.isEmpty(client[item] || '') : false;
    if (value === false) {
      setError(props, section, item, PLEASE_FILL_PLAN);
      isValid = false;
    } else deleteError(props, section, item);

    return true;
  });

  fields.map((item) => {
    const error = validateClientInfoNumber(props, item, client[item], section);
    if (!error) {
      isValid = error;
    }

    return true;
  });

  if (props.setValid) props.setValid(section, isValid);

  return isValid;
}

export function validateSection(data) {
  const sections = [MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION];
  validateClientInfo({ client: data.client, setValid: data.setValid, setError: data.setError, deleteError: data.deleteError }, CLIENT_SECTION);

  sections.map((section) => {
    const props = data[section];

    if (!props) return true;

    const information = validateInfo({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError }, section);
    const options = validateOptions({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError }, section);
    const contribution = validateContribution({ ...props, setError: data.setError, deleteError: data.deleteError }, section);

    data.setPageValid(section, 'information', information);
    if (information) data.setPageValid(section, 'information', options);
    data.setPageValid(section, 'contribution', contribution);

    if (!information || !options || !contribution) data.setValid(section, false);
    else data.setValid(section, true);

    if (!data.products[section] || data.virginCoverage[section]) {
      data.setPageValid(section, 'rates', true);
      data.setPageValid(section, 'enrollment', true);

      return true;
    }

    const ratesCheck = validateCaptureRates({ ...props, setError: data.setError, deleteError: data.deleteError }, section);
    data.setPageValid(section, 'rates', ratesCheck);


    const enrollmentCheck = validateEnrollment({ ...props, setError: data.setError, deleteError: data.deleteError }, section);
    data.setPageValid(section, 'enrollment', enrollmentCheck);

    return true;
  });

  return sections;
}
