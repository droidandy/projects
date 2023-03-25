import validator from 'validator';
import * as constants from './constants';
import * as types from './types';
import { checkCondition, checkDisabled } from './utils';

export function check(item, answers, setError, deleteError) {
  const type = item.type;
  const key = item.keyFull || item.key;
  const limit = item.limit;
  let value = (item.value) ? item.value : null;
  if (!value) value = (answers[key]) ? answers[key].value : null;
  let valid = true;

  if (type === types.INTEGER ||
    type === types.STRING ||
    type === types.TEXTAREA ||
    type === types.EMAIL ||
    type === types.PHONE ||
    type === types.SELECT ||
    type === types.DATE ||
    type === types.FLOAT) {
    if (!value) {
      if (setError) setError(key, constants.PLEASE_FILL_FIELD);

      valid = false;
      return valid;
    } else if (limit && value.length > limit) {
      if (setError) setError(key, `${constants.MAX_CHARACTERS} ${limit}`);

      valid = false;
      return valid;
    } else if (deleteError) deleteError(key);
  } else if (type === types.CHECKBOX && item.unique && item.parent) {
    const values = (answers[key]) ? answers[key].values : [];

    for (let j = 0; j < item.list.length; j += 1) {
      const listItem = item.list[j];
      let found = false;
      for (let i = 0; i < values.length; i += 1) {
        const valuesItem = values[i];

        if (valuesItem === listItem) {
          found = true;
          break;
        }
      }

      if (!found && !checkDisabled(listItem, item, answers, key)) {
        if (setError) setError(`${key}_${j}`, constants.PLEASE_FILL_FIELD);

        valid = false;
      } else if (deleteError) deleteError(`${key}_${j}`);
    }
  }

  if (type === types.INTEGER) {
    valid = checkInt(key, value, setError, deleteError);
  }

  return valid;
}

export function checkInt(key, value, setError, deleteError) {
  let valid = true;
  if (value !== undefined && value !== '' && !validator.isInt(value)) {
    valid = false;

    if (setError) setError(key, constants.PLEASE_ENTER_A_NUMBER);
  } else if (deleteError) deleteError(key);

  return valid;
}

export function checkSection(data, answers, parentIndex, setError, deleteError) {
  let valid = true;
  data.map((item) => {
    let hidden = false;
    let itemKey = item.key;

    if (parentIndex) itemKey += parentIndex;

    if (item.condition && checkCondition(item, answers, parentIndex)) hidden = true;

    if (!hidden) {
      let temp = true;

      if (item.dependency && answers[item.dependency]) {
        for (let j = 0; j < answers[item.dependency].value; j += 1) {
          const checkField = (!item.notRequired) ? check({ ...item, keyFull: itemKey + (j + 1) }, answers, setError, deleteError) : true;
          if (temp) temp = checkField;
        }
      } else if (!item.dependency && !item.notRequired) temp = check({ ...item, keyFull: itemKey }, answers, setError, deleteError);

      if (!temp && valid) valid = false;
    }

    return true;
  });

  return valid;
}

export function checkAll(props, Questions) {
  const pages = [];
  let valid = true;

  Object.keys(Questions).map((page) => {
    let validPage = true;
    const elem = {
      page,
      sections: [],
    };
    Object.keys(Questions[page]).map((section) => {
      let validSection = true;
      Questions[page][section].blocks.map((item) => {
        const data = item.data;
        const disclosure = page === 'disclosure' && section === 'section2';
        let count = 1;
        if (disclosure && (item.title === 'Select persons' || item.title === 'Person') && !props.showDisclosure) return true;

        if (item.condition && checkCondition(item, props.answers)) return true;

        else if (item.dependency && (!props.answers[item.dependency] || !props.answers[item.dependency].value)) return true;

        if (item.dependency) count = props.answers[item.dependency].value;

        for (let j = 0; j < count; j += 1) {
          const temp = checkSection(data, props.answers, (item.dependency) ? j + 1 : null, props.setError, props.deleteError);
          if (validSection) validSection = temp;
        }
        return true;
      });

      if (!validSection) validPage = false;

      elem.sections.push({ name: section, valid: validSection, title: Questions[page][section].title });
      return true;
    });
    if (!validPage && valid) valid = false;

    elem.valid = validPage;
    pages.push(elem);
    return true;
  });

  return { pages, valid };
}
