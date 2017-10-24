// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import {
  SELECT_CARD,
  RESIZE_CARD_WINDOW,
  USER_MOVE,
  CHANGE_MAP_VIEWPORT,
  SCREEN_RESIZE,
  PLAY_CARD_CHALLENGE,
  TOGGLE_CARD_CHALLENGE
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
    case RESIZE_CARD_WINDOW: {
      return { ...state, ...action };
    }
    case USER_MOVE: {
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
    }
    case CHANGE_MAP_VIEWPORT: {
      const viewport = action.options;
      const mapHeight = viewport.height;
      const width = viewport.width;
      const mapZoom = viewport.zoom;

      return { ...state, mapHeight, width, mapZoom };
    }
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
    case SELECT_CARD: {
      const { card, selected } = action.options;
      const newState = {
        centerLocation: selected ? card.location : { ...state.userLocation },
        mapZoom: selected ? 15 : state.mapZoom,
        selectedCard: card,
        gridHeight: selected ? state.maxHeight : state.defaultHeight,
        mapHeight: selected ? state.minHeight : state.defaultHeight
      };
      return { ...state, ...newState };
    }

    case SCREEN_RESIZE: {
      const height = action.options.height - state.headerPad;
      const width = action.options.width;
      const defaultHeight = height / 2;
      const gridWidth = width * 2;
      const maxHeight = 3 / 4 * height;
      const minHeight = 1 / 4 * height;
      const mapHeight = height / 2;
      const gridHeight = height / 2;
      const newState = {
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
    }

    case TOGGLE_CARD_CHALLENGE: {
      console.log('action options', action.options);
      return { ...state, cardChallengeOpen: action.options.cardChallengeOpen };
    }

    case PLAY_CARD_CHALLENGE: {
      return { ...state, modalOpen: !state.modalOpen };
    }
    default:
      return state;
  }
}

export default reducer;
