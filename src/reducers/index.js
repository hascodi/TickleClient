// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import { SELECT_CARD, PLAY_CARD_CHALLENGE } from '../actions';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function mapViewReducer(state = {}, action) {
  switch (action.type) {
    case SELECT_CARD:
      return { state, ...action.options };
    // case PLAY_CARD_CHALLENGE:
    //   return Object.assign({}, state, {
    //   todos: [
    //       ...state.todos,
    //       {
    //         text: action.text,
    //         completed: false
    //       }
    //     ]
    // });
    default:
      return state;
  }
}

export default mapViewReducer;
