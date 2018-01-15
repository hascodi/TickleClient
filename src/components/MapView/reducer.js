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
  TOGGLE_CARD_CHALLENGE,
  EXTEND_SELECTED_CARD
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
    case CHANGE_MAP_VIEWPORT: {
      if (state.extCardId !== null) return state;
      const viewport = action.options;
      const mapHeight = viewport.height;
      const width = viewport.width;
      const mapZoom = viewport.zoom;

      return {
        ...state,
        mapHeight,
        width,
        mapZoom
      };
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
      const selectedCardId = action.options;
      const selectedCard = state.cards.find(d => d.id === selectedCardId);
      const newMapViewState = {
        centerLocation: selectedCardId
          ? selectedCard.loc
          : { ...state.userLocation },
        mapZoom: selectedCardId ? 15 : state.mapZoom,
        selectedCardId
      };
      return { ...state, ...newMapViewState };
    }

    case EXTEND_SELECTED_CARD: {
      const extCardId = action.options;
      console.log('extCardId', extCardId);
      return { ...state, extCardId };
    }

    case SCREEN_RESIZE: {
      const height = action.options.height - state.headerPad;
      const width = action.options.width;
      const mapHeight = height;
      const defaultHeight = mapHeight;
      const newState = {
        defaultHeight,
        height,
        width,
        mapHeight
      };
      return { ...state, ...newState };
    }

    case TOGGLE_CARD_CHALLENGE: {
      const { cardChallengeOpen } = action.options;
      return {
        ...state,
        cardChallengeOpen
      };
    }

    case PLAY_CARD_CHALLENGE: {
      return {
        ...state,
        modalOpen: !state.modalOpen
      };
    }

    case USER_MOVE: {
      const options = action.options;
      // if (state.extCardId !== null) return state;
      console.log('action options user move', action.options, state);
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
      return {
        ...state,
        centerLocation,
        userLocation
      };
    }
    default:
      return state;
  }
}

export default reducer;
