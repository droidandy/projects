
/*
 * Description of Question item
 *
 * @key - The key in the database. Used to save on the server and in the reducer.
 * @title - Name of the question
 * @type - Type of the question
 * @list - List of elements. Used for Checkbox and Radio types.
 * @dependency - Indicates the question from which he is dependent. Can be dependent only on a question of type COUNT. This field will be repeated the number of times indicated in the main question.
 * @condition - It will be shown, if these questions have a definite answer.
 *
 */

export const checkCondition = (question, answers, count) => {
  let hidden = true;

  for (let k = 0; k < Object.keys(question.condition).length; k += 1) {
    const key = Object.keys(question.condition)[k];
    const answer = answers[`${key}${count || ''}`];
    if (key === 'OR') {
      for (let i = 0; i < question.condition[key].length; i += 1) {
        const orItem = question.condition[key][i];
        const orKey = Object.keys(orItem)[0];

        if (answers[orKey] && answers[orKey].value && answers[orKey].value === orItem[orKey]) {
          return false;
        }
      }
    } else if (answer) {
      if (answer.value && answer.value === question.condition[key]) {
        hidden = false;
      } else if (answer.values) {
        let found = false;
        for (let i = 0; i < answer.values.length; i += 1) {
          const value = answer.values[i];

          if (value === question.condition[key]) {
            hidden = false;
            found = true;
            break;
          }
        }

        if (!found) return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  return hidden;
};

export const checkDisabled = (listItem, item, answers, itemKey) => {
  if (item.parent) {
    const count = answers[item.parent];

    if (count) {
      for (let i = 0; i < count.value; i += 1) {
        const key = `${item.key}${i + 1}`;
        const answer = answers[key];

        if (answer && answer.values && key !== itemKey) {
          for (let j = 0; j < answer.values.length; j += 1) {
            if (answer.values[j] === listItem) return true;
          }
        }
      }
    }

    return false;
  }

  return true;
};
