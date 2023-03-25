import _ from 'lodash';

const TYPE = {
  ADD_REGISTER_DATA: 'ADD_REGISTER_DATA',
  ADD_REGISTER_DATA_CONTINUE: 'ADD_REGISTER_DATA_CONTINUE'
};

export let addRegisterData = (data) => ({
  type: TYPE.ADD_REGISTER_DATA,
  data
});
export let addRegisterDataContinue = (data) => ({
  type: TYPE.ADD_REGISTER_DATA_CONTINUE,
  data
});

const initialState = {
  data: null
};

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    case TYPE.ADD_REGISTER_DATA:
      return {
        ...state,
        data: action.data
      };
    case TYPE.ADD_REGISTER_DATA_CONTINUE:
      return {
        data: _.merge(state.data, action.data)
      };
    default:
      return state;
  }
};
