import { createSelector } from 'reselect';
import { checkCondition } from './utils';
import * as types from './types';

const selectCurrentClient = () => (state) => state.get('clients').get('current');
const selectOnBoarding = () => (state) => state.get('onBoarding');

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }

    return substate.toJS();
  }
);

const selectAnswers = (Questions) => createSelector(
  selectOnBoarding(),
  (substate) => {
    const answers = substate.get('answers').toJS();
    const showDisclosure = substate.get('showDisclosure');
    const finalAnswers = {};
    const multiAnswers = {};
    const addAnswer = (question, key) => {
      if (question.type === types.CHECKBOX && answers[key].values) multiAnswers[key] = answers[key].values;
      else if (answers[key].value || answers[key].value === '') finalAnswers[key] = answers[key].value;
    };

    Object.keys(Questions).map((page) => {
      Object.keys(Questions[page]).map((section) => {
        Questions[page][section].blocks.map((item) => {
          let count = 1;
          const dependency = item.dependency && answers[item.dependency] && answers[item.dependency].value;

          if (item.condition && checkCondition(item, answers)) return true;

          if (dependency) count = answers[item.dependency].value;

          for (let l = 0; l < count; l += 1) {
            const disclosure = page === 'disclosure' && section === 'section2';
            const data = item.data;

            if (disclosure && (item.title === 'Select persons' || item.title === 'Person') && !showDisclosure) break;

            for (let i = 0; i < data.length; i += 1) {
              const question = data[i];
              let key = question.key;
              let parentIndex = null;

              if (dependency) parentIndex = l + 1;
              if (parentIndex) key += parentIndex;

              if (question.type === types.TABLE) {
                for (let k = 1; k < question.rows.length; k += 1) {
                  const row = question.rows[k];
                  for (let j = 0; j < row.columns.length; j += 1) {
                    const column = row.columns[j];

                    if (column.type === types.TABLE_RADIO) addAnswer(question, column.key);
                  }
                }
              } else if (question.type === types.RADIO_MASSIVE || answers[key] || question.dependency) {
                if (question.children) {
                  for (let j = 0; j < question.children.length; j += 1) {
                    const radioItem = question.children[j];
                    if (answers[radioItem.key]) finalAnswers[radioItem.key] = answers[radioItem.key].value;
                  }
                } else if ((question.condition && !checkCondition(question, answers, parentIndex)) || !question.condition) {
                  if (question.dependency && answers[question.dependency]) {
                    for (let j = 0; j < answers[question.dependency].value; j += 1) {
                      addAnswer(question, key + (j + 1));
                    }
                  } else if (!question.dependency) {
                    addAnswer(question, key);
                  }
                }
              }
            }
          }
          return true;
        });

        return true;
      });
      return true;
    });

    return { answers: finalAnswers, multiAnswers };
  }
);

const selectDefaultAnswers = (response, Questions) => createSelector(
  selectOnBoarding(),
  (substate) => {
    const answers = substate.get('answers').toJS();
    const showDisclosure = substate.get('showDisclosure');
    const finalAnswers = answers;

    Object.keys(response.answers).map((key) => {
      finalAnswers[key] = {};

      finalAnswers[key].value = response.answers[key];

      return true;
    });

    Object.keys(response.multiAnswers).map((key) => {
      finalAnswers[key] = {};

      finalAnswers[key].values = response.multiAnswers[key];

      return true;
    });

    Object.keys(Questions).map((page) => {
      Object.keys(Questions[page]).map((section) => {
        Questions[page][section].blocks.map((item) => {
          let count = 1;
          const dependency = item.dependency && finalAnswers[item.dependency] && finalAnswers[item.dependency].value;

          if (dependency) count = finalAnswers[item.dependency].value;

          if (item.dependency && !dependency) return true;

          for (let l = 0; l < count; l += 1) {
            const disclosure = page === 'disclosure' && section === 'section2';
            const data = item.data;

            if (disclosure && (item.title === 'Select persons' || item.title === 'Person') && !showDisclosure) break;

            for (let i = 0; i < data.length; i += 1) {
              const question = data[i];
              let key = question.key;

              if (dependency) key += l + 1;
              const answer = (finalAnswers[key]) ? finalAnswers[key].value : null;

              if (question.type === types.RADIO) {
                if (!answer) {
                  finalAnswers[key] = {};
                  finalAnswers[key].value = question.defaultItem || 'No';
                }
              } else if (question.type === types.SELECT) {
                if (!answer && question.defaultItem) {
                  finalAnswers[key] = {};
                  finalAnswers[key].value = question.defaultItem;
                }
              } else if (question.type === types.COUNT) {
                if (!answer && question.defaultItem) {
                  finalAnswers[key] = {};
                  finalAnswers[key].value = question.defaultItem;
                }
              } else if (question.type === types.TABLE) {
                for (let o = 1; o < question.rows.length; o += 1) {
                  const row = question.rows[o];
                  for (let j = 0; j < row.columns.length; j += 1) {
                    const column = row.columns[j];

                    if (column.type === types.TABLE_RADIO && column.selected && !finalAnswers[column.key]) {
                      finalAnswers[column.key] = {};
                      finalAnswers[column.key].value = column.value;
                    }
                  }
                }
              } else if (question.type === types.RADIO_MASSIVE) {
                question.children.map((listItem) => {
                  const radioAnswer = (finalAnswers[listItem.key] && finalAnswers[listItem.key].value) ? finalAnswers[listItem.key].value : '';
                  if (!radioAnswer) {
                    finalAnswers[listItem.key] = {};
                    finalAnswers[listItem.key].value = 'No';
                  }

                  return true;
                });
              }
            }
          }
          return true;
        });

        return true;
      });
      return true;
    });

    return finalAnswers;
  }
);

export {
  selectClient,
  selectAnswers,
  selectDefaultAnswers,
};
