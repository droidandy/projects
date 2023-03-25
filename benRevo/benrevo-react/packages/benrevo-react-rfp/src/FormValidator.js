import validator from 'validator';
import {
    CLIENT_NAME,
    EMPLOYEE_COUNT,
    EMPLOYEE_TOTAL,
    PARTICIPATING_EMPLOYEES,
    MEMBERS_COUNT,
    RETIREES_COUNT,
    MINIMUM_HOURS,
    COBRA_COUNT,
    EFFECTIVE_DATE,
    DUE_DATE,
    STATE,
    PREDOMINANT_COUNTY,
    AVERAGE_AGE,
    SIC_CODE,
    ADDRESS,
    CITY,
    ZIP,
    DOMESTIC_PARTNER,
    OUT_TO_BID_REASON,
} from '@benrevo/benrevo-react-clients';
import {
  PLEASE_ENTER_A_NUMBER,
  PLEASE_ENTER_A_DATE,
  PLEASE_FILL,
  PLEASE_FILL_PLAN,
  PLEASE_FILL_PLAN_NUMBER,
  PLEASE_FILL_POSITIVE_PLAN,
  PLEASE_UPLOAD_SUMMARIES,
  CLIENT_STATE_ERROR,
} from './formConstants';
import {
  CARRIERS,
  CHANGE_WAITING_PERIOD,
  CHANGE_DIAGNOSIS_AND_STATUS,
  CHANGE_COMMISSION,
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
  RFP_LIFE_SECTION,
  RFP_STD_SECTION,
  RFP_LTD_SECTION,
  RFP_CLIENT_SECTION,
  PLANS,
  VOLUNTARY,
  NET,
  PERCENTAGE,
  PLAN_TIERS,
  PLAN_CURRENT_TIERS,
  PLAN_RENEWAL_TIERS,
  PLAN_ENROLLMENT_TIERS,
  CHANGE_PLAN_FILES,
  CHANGE_SUMMARY_FILES,
  RATE_TYPE_BANDED,
} from './constants';
import * as lifeStdLtdTypes from './LifeStdLtdOptions/constants';

export const checkSetError = (props, section, error, type, meta) => {
  if (props.setError) props.setError(section, error, type, meta);
};

export const checkDeleteError = (props, section, type) => {
  if (props.deleteError) props.deleteError(section, type);
};

export const checkTiers = (tiers, error, section, props, index, oos, contributionType) => {
  let valid = true;
  tiers.map((tier, i) => {
    const value = (tier.value !== null && tier.value !== undefined) ? tier.value.toString() : '';
    if (validator.isEmpty(value)) {
      if (error !== PLAN_RENEWAL_TIERS) {
        checkSetError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`, PLEASE_FILL_PLAN);
        valid = false;
      }
      return valid;
    }
    checkDeleteError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`);
    if (error === PLAN_TIERS) {
      if (contributionType === '%' && parseFloat(value) > 100) {
        checkSetError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`, PLEASE_FILL_PLAN_NUMBER);
        valid = false;
        return valid;
      }

      checkDeleteError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`);
    }
    if ((!validator.isInt(value) && !validator.isFloat(value))) {
      if (error !== PLAN_CURRENT_TIERS) {
        checkSetError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`, PLEASE_FILL_PLAN_NUMBER);
      } else checkDeleteError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`);

      valid = false;
      return valid;
    } else if (parseFloat(value) < 0 || value === '-') {
      checkSetError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`, PLEASE_FILL_POSITIVE_PLAN);
      valid = false;
    } else checkDeleteError(props, section, `${error}${(oos) ? '-oos' : ''}-${index}-${i}`);

    return true;
  });

  return valid;
};

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

  if (section === RFP_MEDICAL_SECTION) {
    if (!props.daysAfterHire) {
      setError(props, section, CHANGE_WAITING_PERIOD, PLEASE_FILL_PLAN);
      isValid = false;
    } else deleteError(props, section, CHANGE_WAITING_PERIOD);
  }
  if (props.payType !== NET && ((props.payType === PERCENTAGE && parseFloat(props.commission) > 100) || validator.isEmpty(props.commission))) {
    setError(props, section, CHANGE_COMMISSION, PLEASE_ENTER_A_NUMBER);
    isValid = false;
  } else deleteError(props, section, CHANGE_COMMISSION);

  if (!checkCarrier('carriers') && !props.virginCoverage[section]) {
    setError(props, section, CARRIERS, PLEASE_FILL);
    isValid = false;
  } else deleteError(props, section, CARRIERS);

  return isValid;
}

export function validateOptions(props, section) {
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const virgin = props.virginCoverage[section];
  let isValid = true;
  const checkPlans = (name) => {
    const arr = props[name];
    let valid = true;
    arr.map((item) => {
      if (validator.isEmpty(item.title) || validator.isEmpty(item.name) || (!virgin && !item.selectedCarrier.carrierId) || (!virgin && !item.selectedNetwork.networkId)) {
        valid = false;
        return valid;
      }

      return true;
    });

    return valid;
  };

  if (!checkPlans('plans')) {
    setError(props, section, PLANS, PLEASE_FILL_PLAN);
    isValid = false;
  } else deleteError(props, section, PLANS);

  return isValid;
}

export function validateLifeStdLtdOptions(props, section, ancillaryType) {
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  let isValid = true;

  const checkPlans = (name) => {
    if (!props[name].planName) {
      isValid = false;
      setError(props, section, `${lifeStdLtdTypes.LIFE_STD_LTD_PLAN_NAME}_${name}`, PLEASE_FILL_PLAN);
    } else deleteError(props, section, `${lifeStdLtdTypes.LIFE_STD_LTD_PLAN_NAME}_${name}`);

    if (!props[name].carrierId) {
      isValid = false;
      setError(props, section, `${lifeStdLtdTypes.LIFE_STD_LTD_CARRIER}_${name}`, PLEASE_FILL_PLAN);
    } else deleteError(props, section, `${lifeStdLtdTypes.LIFE_STD_LTD_CARRIER}_${name}`);

    for (let i = 0; i < props[name].classes.length; i += 1) {
      const item = props[name].classes[i];
      for (let j = 0; j < Object.keys(item).length; j += 1) {
        const key = Object.keys(item)[j];
        if (key.indexOf('Other') === -1 && key !== 'percentage') {
          if (key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION ||
            key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_OCCUPATION ||
            key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_ABUSE) {
            if (!item[key]) {
              if ((name !== 'basicPlan' &&
                (key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION ||
                  key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER
                )) ||
                name === 'voluntaryPlan'
              ) {
                isValid = false;
                setError(props, section, `${key}_${name}_${i}`, PLEASE_FILL_PLAN);
              }
            } else if (item[key] === 'Other') {
              if (!item[`${key}Other`]) {
                isValid = false;
                setError(props, section, `${key}Other_${name}_${i}`, PLEASE_FILL_PLAN);
              } else deleteError(props, section, `${key}Other_${name}_${i}`);
            } else {
              deleteError(props, section, `${key}_${name}_${i}`);
              deleteError(props, section, `${key}Other_${name}_${i}`);
            }
          } else if (!item[key] && key === 'name') {
            isValid = false;
            setError(props, section, `${key}_${name}_${i}`, PLEASE_FILL_PLAN);
          } else if (!item[key] && key !== 'ancillaryClassId') {
            if ((name !== 'basicPlan' &&
              (key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CONDITION_EXCLUSION_OTHER ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_SPOUSE_BENEFIT_AMOUNT ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_SPOUSE_MAX_BENEFIT ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_SPOUSE_GUARANTEE_ISSUE ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CHILD_BENEFIT_AMOUNT ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CHILD_MAX_BENEFIT ||
              key === lifeStdLtdTypes.LIFE_STD_LTD_CLASS_CHILD_GUARANTEE_ISSUE)) ||
              name === 'voluntaryPlan'
            ) {
              isValid = false;
              setError(props, section, `${key}_${name}_${i}`, PLEASE_FILL_PLAN);
            }
          } else if (key === 'deathBenefit') {
            if (item[key] === 'yes' && !item.percentage) {
              isValid = false;
              setError(props, section, `percentage_${name}_${i}`, PLEASE_FILL_PLAN);
            } else deleteError(props, section, `percentage_${name}_${i}`);
          } else deleteError(props, section, `${key}_${name}_${i}`);
        }
      }
    }
  };

  if (ancillaryType) checkPlans(ancillaryType);
  else {
    if (props.basicPlan.added) checkPlans('basicPlan');
    if (props.voluntaryPlan.added) checkPlans('voluntaryPlan');
  }

  return isValid;
}

export function validateContribution(props, section) {
  const deleteError = checkDeleteError;
  let isValid = true;
  const arr = props.plans;

  if (props.contributionType !== VOLUNTARY) {
    arr.map((item, i) => {
      if (!checkTiers(item.contributionAmount, PLAN_TIERS, section, props, i, false, props.contributionType)) isValid = false;

      if (item.outOfStateAmount) {
        if (!checkTiers(item.outOfStateAmountTiers, PLAN_TIERS, section, props, i, true, props.contributionType)) isValid = false;
      }

      return true;
    });
  }

  if (isValid) deleteError(props, section, PLAN_TIERS);


  return isValid;
}

export function validateQuote(props, section) {
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const meta = {
    indexes: {},
  };
  let isValid = true;

  if (section === RFP_MEDICAL_SECTION && !props.virginCoverage[section]) {
    if (!props.diagnosisAndStatus) {
      isValid = false;
      setError(props, section, CHANGE_DIAGNOSIS_AND_STATUS, PLEASE_FILL_PLAN);
    } else deleteError(props, section, CHANGE_DIAGNOSIS_AND_STATUS);
  }

  if (section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION) {
    const planFiles = props.planFiles;

    props.plans.map((item, i) => {
      if ((!planFiles[i] || !planFiles[i].length) && !props.virginCoverage[section]) {
        isValid = false;
        meta.indexes[i] = true;
      }

      return true;
    });

    if (isValid) deleteError(props, section, CHANGE_PLAN_FILES);
    else setError(props, section, CHANGE_PLAN_FILES, PLEASE_UPLOAD_SUMMARIES, meta);
  } else {
    const files = props.filesSummary;

    if (files && !files.length && !props.virginCoverage[section]) {
      isValid = false;
      setError(props, section, CHANGE_SUMMARY_FILES, PLEASE_UPLOAD_SUMMARIES);
    } else deleteError(props, section, CHANGE_SUMMARY_FILES);
  }

  return isValid;
}

export function validateCaptureRates(props, section) {
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  let isValid = true;
  const arr = props.plans;
  let currentError = false;
  let renewalError = false;

  arr.map((item, i) => {
    if (props.rateType === RATE_TYPE_BANDED) {
      if (!item.monthlyBandedPremium.value && !item.monthlyBandedPremium.value === 0) {
        currentError = true;
        isValid = false;
        setError(props, section, PLAN_CURRENT_TIERS, PLEASE_FILL_PLAN);
      } else deleteError(props, section, PLAN_CURRENT_TIERS);

      if (item.outOfStateCurrent && !item.oufOfStateMonthlyBandedPremium.value && !item.oufOfStateMonthlyBandedPremium.value === 0) {
        currentError = true;
        isValid = false;
        setError(props, section, `${PLAN_CURRENT_TIERS}-oos`, PLEASE_FILL_PLAN);
      } else deleteError(props, section, `${PLAN_CURRENT_TIERS}-oos`);
    } else {
      if (!checkTiers(item.currentRates, PLAN_CURRENT_TIERS, section, props, i)) {
        currentError = true;
        isValid = false;
      }
      if (item.outOfStateCurrent && !checkTiers(item.outOfStateCurrentTiers, PLAN_CURRENT_TIERS, section, props, i, true)) {
        currentError = true;
        isValid = false;
      }

      if (!checkTiers(item.renewalRates, PLAN_RENEWAL_TIERS, section, props, i)) {
        renewalError = true;
        isValid = false;
      }
      if (item.outOfStateRenewal && !checkTiers(item.outOfStateRenewalTiers, PLAN_RENEWAL_TIERS, section, props, i, true)) {
        renewalError = true;
        isValid = false;
      }
    }
    return true;
  });

  if (!currentError) deleteError(props, section, PLAN_CURRENT_TIERS);
  if (!renewalError) deleteError(props, section, PLAN_RENEWAL_TIERS);

  return isValid;
}

export function validateLifeStdLtdRates(props, section) {
  const deleteError = checkDeleteError;
  const setError = checkSetError;
  const basicRates = props.basicPlan.rates;
  const voluntaryRates = props.voluntaryPlan.rates;
  const stdLtdBasic = {
    volume: true,
    currentSL: true,
    renewalSL: true,
  };
  const lifeBasic = {
    volume: true,
    currentLife: true,
    renewalLife: true,
    currentADD: true,
    renewalADD: true,
  };
  let isValid = true;
  if (props.basicPlan.added) {
    for (let j = 0; j < Object.keys(basicRates).length; j += 1) {
      const key = Object.keys(basicRates)[j];

      if (key !== 'ages' && (!basicRates[key] || !parseFloat(basicRates[key]))) {
        if ((section === RFP_LIFE_SECTION && lifeBasic[key]) ||
          ((section === RFP_STD_SECTION || section === RFP_LTD_SECTION) && stdLtdBasic[key])) {
          setError(props, section, key, PLEASE_FILL_PLAN);
          isValid = false;
        }
      } else deleteError(props, section, key);
    }
  }

  if (props.voluntaryPlan.added) {
    for (let i = 0; i < voluntaryRates.ages.length; i += 1) {
      const age = voluntaryRates.ages[i];

      for (let j = 0; j < Object.keys(age).length; j += 1) {
        const key = Object.keys(age)[j];

        if (key !== 'from' && key !== 'to') {
          if ((!age[key] || !parseFloat(age[key])) &&
            (((key === 'currentEmp' || key === 'renewalEmp') && (voluntaryRates.employee || section !== RFP_LIFE_SECTION)) || (key.indexOf('EmpT') > -1 && voluntaryRates.employeeTobacco) || (key.indexOf('Spouse') > -1 && voluntaryRates.spouse) || key === 'current' || key === 'renewal')
          ) {
            setError(props, section, `${key}_${i}`, PLEASE_FILL_PLAN);
            isValid = false;
          } else deleteError(props, section, `${key}_${i}`);
        }
      }

      if (!age.from && age.from !== 0) {
        setError(props, section, `ageFrom_${i}`, PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, `ageFrom_${i}`);

      if (!age.to && i !== voluntaryRates.ages.length - 1) {
        setError(props, section, `ageTo_${i}`, PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, `ageTo_${i}`);
    }

    if (section === RFP_LIFE_SECTION) {
      if (!voluntaryRates.rateEmpADD || !parseFloat(voluntaryRates.rateEmpADD)) {
        setError(props, section, 'rateEmpADD', PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, 'rateEmpADD');

      if (voluntaryRates.spouse && (!voluntaryRates.rateSpouseADD || !parseFloat(voluntaryRates.rateSpouseADD))) {
        setError(props, section, 'rateSpouseADD', PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, 'rateSpouseADD');

      if (voluntaryRates.spouse && (!voluntaryRates.rateChildADD || !parseFloat(voluntaryRates.rateChildADD))) {
        setError(props, section, 'rateChildADD', PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, 'rateChildADD');

      if (voluntaryRates.spouse && (!voluntaryRates.rateChildLife || !parseFloat(voluntaryRates.rateChildLife))) {
        setError(props, section, 'rateChildLife', PLEASE_FILL_PLAN);
        isValid = false;
      } else deleteError(props, section, 'rateChildLife');
    }

    if (!voluntaryRates.monthlyCost || !parseFloat(voluntaryRates.monthlyCost)) {
      setError(props, section, 'monthlyCost', PLEASE_FILL_PLAN);
      isValid = false;
    } else deleteError(props, section, 'monthlyCost');

    if (!voluntaryRates.volume || !parseFloat(voluntaryRates.volume)) {
      setError(props, section, 'volume_voluntaryPlan', PLEASE_FILL_PLAN);
      isValid = false;
    } else deleteError(props, section, 'volume_voluntaryPlan');
  }

  return isValid;
}

export function validateEnrollment(props, section) {
  const deleteError = checkDeleteError;
  let isValid = true;
  const arr = props.plans;
  let error = false;

  arr.map((item, i) => {
    if (!checkTiers(item.contributionEnrollment, PLAN_ENROLLMENT_TIERS, section, props, i)) {
      error = true;
      isValid = false;
    }

    if (item.outOfStateEnrollment && !checkTiers(item.outOfStateContributionEnrollment, PLAN_ENROLLMENT_TIERS, section, props, i, true)) {
      error = true;
      isValid = false;
    }
    return true;
  });

  if (!error) deleteError(props, section, PLAN_ENROLLMENT_TIERS);

  return isValid;
}

export function validateClientInfo(props, section, clearValue) {
  let isValid = true;
  const client = props.client;
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const fields = [EMPLOYEE_COUNT, EMPLOYEE_TOTAL, PARTICIPATING_EMPLOYEES, RETIREES_COUNT, MINIMUM_HOURS, COBRA_COUNT, SIC_CODE];
  const fieldsDates = [EFFECTIVE_DATE, DUE_DATE];
  const fieldsEmpty = [CLIENT_NAME, ADDRESS, CITY, ZIP, DOMESTIC_PARTNER, OUT_TO_BID_REASON];

  if (clearValue) {
    fields.push(AVERAGE_AGE);
    fieldsEmpty.push(PREDOMINANT_COUNTY);
  } else fields.push(MEMBERS_COUNT);

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

  if (client[STATE] && !validateClientState(props, STATE, client[STATE], section)) {
    isValid = false;
  } else if (!client[STATE]) {
    setError(props, section, STATE, CLIENT_STATE_ERROR);
  } else deleteError(props, section, STATE);

  if (props.setValid) props.setValid(section, isValid);

  return isValid;
}

export function validateClientState(props, field, value, section) {
  if (value) {
    const setError = checkSetError;
    const deleteError = checkDeleteError;
    const valid = value === 'California';
    if (!valid) {
      setError(props, section, field, CLIENT_STATE_ERROR);
    } else deleteError(props, section, field);

    return valid;
  }

  return true;
}

export function validateClientInfoNumber(props, field, value, section) {
  const setError = checkSetError;
  const deleteError = checkDeleteError;
  const valid = (value || value === 0) ? validator.isInt(value.toString()) : false;
  if (!valid) {
    setError(props, section, field, PLEASE_ENTER_A_NUMBER);
  } else deleteError(props, section, field);

  return valid;
}

export function validateSection(data) {
  const sections = [RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION];
  let rates = true;
  let enrollment = true;
  validateClientInfo({ client: data.client, setValid: data.setValid, setError: data.setError, deleteError: data.deleteError }, RFP_CLIENT_SECTION, data.clearValue);
  const lifeStdLtdValid = validateLifeSTDLTDSection(data);

  rates = lifeStdLtdValid.rates;

  sections.map((section) => {
    const props = data[section];

    if (!props) return true;

    const planFilesName = `${section}Files`;
    const information = (data.selected[section]) ? validateInfo({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError }, section) : true;
    const options = (data.selected[section]) ? validateOptions({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError }, section) : true;
    const contribution = (data.selected[section]) ? validateContribution({ ...props, setError: data.setError, deleteError: data.deleteError }, section) : true;
    const quote = (data.selected[section]) ? validateQuote({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError, planFiles: data[planFilesName], filesSummary: data.filesSummary[section] }, section) : true;

    data.setPageValid(section, 'information', information);
    data.setPageValid(section, 'options', options);
    data.setPageValid(section, 'contribution', contribution);
    data.setPageValid(section, 'quote', quote);

    if (!information || !options || !contribution || !quote) data.setValid(section, false);
    else data.setValid(section, true);

    if (!data.selected || !data.selected[section] || !data.products[section] || data.virginCoverage[section]) {
      data.setPageValid('rates', section, true);
      data.setPageValid('enrollment', section, true);

      return true;
    }

    const ratesCheck = validateCaptureRates({ ...props, setError: data.setError, deleteError: data.deleteError }, section);
    data.setPageValid('rates', section, ratesCheck);

    if (rates) rates = ratesCheck;

    const enrollmentCheck = validateEnrollment({ ...props, setError: data.setError, deleteError: data.deleteError }, section);
    data.setPageValid('enrollment', section, enrollmentCheck);

    if (enrollment) enrollment = enrollmentCheck;

    return true;
  });

  data.setValid('rates', rates);
  data.setValid('enrollment', enrollment);

  return sections;
}

export function validateLifeSTDLTDSection(data) {
  const sections = [RFP_LIFE_SECTION, RFP_STD_SECTION, RFP_LTD_SECTION];
  let rates = true;

  sections.map((section) => {
    const props = data[section];

    if (!props) return true;

    if (!data.selected || !data.selected[section] || !data.products[section]) {
      data.setPageValid('rates', section, true);
      return true;
    }

    const information = (data.selected[section]) ? validateInfo({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError }, section) : true;
    const options = (data.selected[section]) ? validateLifeStdLtdOptions({ ...props, setError: data.setError, deleteError: data.deleteError }, section) : true;
    const quote = (data.selected[section]) ? validateQuote({ ...props, virginCoverage: data.virginCoverage, setError: data.setError, deleteError: data.deleteError, filesSummary: data.filesSummary[section] }, section) : true;

    data.setPageValid(section, 'information', information);
    data.setPageValid(section, 'options', options);
    data.setPageValid(section, 'quote', quote);

    if (!information || !options || !quote) data.setValid(section, false);
    else data.setValid(section, true);

    if (data.virginCoverage[section]) {
      data.setPageValid('rates', section, true);
      return true;
    }

    const ratesCheck = validateLifeStdLtdRates({ ...props, setError: data.setError, deleteError: data.deleteError }, section);
    data.setPageValid('rates', section, ratesCheck);

    if (rates) rates = ratesCheck;

    return true;
  });

  data.setValid('rates', rates);

  return { rates };
}
