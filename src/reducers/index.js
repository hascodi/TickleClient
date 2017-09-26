import { combineReducers } from 'redux';
import cards from './cards';
import visibilityFilter from './visibilityFilter';

const todoApp = combineReducers({
  cards,
  visibilityFilter
});

export default todoApp;
