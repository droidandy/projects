/**
 * Created by developercomputer on 11.12.15.
 */
import { combineReducers } from 'redux'
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './../actions/todo.js'
const { SHOW_ALL } = VisibilityFilters;

const visibilityFilter = (state = SHOW_ALL, action = {}) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state
  }
};

const todos = (state = [], action = {}) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false,
          id: action.id
        }
      ];
    case COMPLETE_TODO:
      return state.map(todo => todo.id === action.id ? {...todo, completed: !todo.completed} : todo);
    default:
      return state
  }
};

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp
