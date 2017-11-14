// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import {
  CARD_CREATOR_SCREEN_RESIZE,
  SELECT_CARD,
  CHANGE_MAP_VIEWPORT
} from './actions_cardCreator';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  console.log('action cardCreator state', state, action);
  switch (action.type) {
    // case SELECT_CARD: {
    //   // const { card, selected } = action.options;
    //   // const newCardCreatorState = {
    //   //   centerLocation: selected ? card.location : { ...state.userLocation },
    //   //   mapZoom: selected ? 15 : state.mapZoom,
    //   //   selectedCard: card,
    //   //   gridHeight: selected ? state.maxHeight : state.defaultHeight,
    //   //   mapHeight: selected ? state.minHeight : state.defaultHeight
    //   // };
    //   // return { ...state, ...newCardCreatorState };
    // }

    case CARD_CREATOR_SCREEN_RESIZE: {
      console.log('state taken', action);
      const height = action.options.height - state.headerPad;
      const width = action.options.width;
      console.log('width', width, 'height', height);
      return { ...state, width, height };
    }

    case CHANGE_MAP_VIEWPORT: {
      console.log('CHANGE_MAP_VIEWPORT', action.options);
      const mapViewport = action.options;

      return {
        ...state,
        mapViewport
      };
    }
    default:
      return state;
  }
}

export default reducer;
