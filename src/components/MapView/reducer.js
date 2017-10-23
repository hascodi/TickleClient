// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import {
  SELECT_CARD,
  PLAY_CARD_CHALLENGE,
  RESIZE_CARD_WINDOW,
  USER_MOVE,
  CHANGE_VIEWPORT,
  CLICK_CARD,
  SCREEN_RESIZE
} from './actions';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  console.log('action', action);
  switch (action.type) {
    case SELECT_CARD:
      return { ...state, ...action };
    case RESIZE_CARD_WINDOW:
      return { ...state, ...action };
    case USER_MOVE:
      const options = action.options;
      console.log('action options', action.options);
      const centerLocation = {
      longitude: options.lngLat[0],
      latitude: options.lngLat[1]
    };
      const userLocation = { ...centerLocation };
      console.log(
        'userLocation',
        userLocation,
        'centerLocation',
        centerLocation
      );
      return { ...state, centerLocation, userLocation };
    case CHANGE_VIEWPORT:
      const viewport = action.options;
      let mapHeight = viewport.height;
      let width = viewport.width;
      const mapZoom = viewport.zoom;

      return { ...state, mapHeight, width, mapZoom };
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
    case CLICK_CARD:
      const { card, selected } = action;
      let newState = {
      centerLocation: selected ? card.location : { ...state.userLocation },
      mapZoom: selected ? 15 : state.mapZoom,
      selectedCard: card,
      gridHeight: selected ? state.maxHeight : state.defaultHeight,
      mapHeight: selected ? state.minHeight : state.defaultHeight
    };
      return { ...state, ...newState };

    case SCREEN_RESIZE:
    const height = action.options.height - state.headerPad;
    width = action.options.width;
    const defaultHeight = height / 2;
    const gridWidth = width * 2;
    const maxHeight = 3 / 4 * height;
    const minHeight = 1 / 4 * height;
    mapHeight = height / 2;
    const gridHeight = height / 2;
    newState = {
        height,
        width,
        defaultHeight,
        gridWidth,
        maxHeight,
        minHeight,
        mapHeight,
        gridHeight
      };
      console.log('action', action, 'oldstate', state, 'newState', newState);
    return { ...state, ...newState };

    default:
      return state;
  }
}

export default reducer;
