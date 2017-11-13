// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import { CARD_CREATOR_SCREEN_RESIZE, SELECT_CARD } from './actions_cardCreator';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

function reducer(state = {}, action) {
  console.log('action cardCreator', action);
  const { CardCreator } = state;
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
      console.log('CardCreator taken', action);
      const height = action.options.height - CardCreator.headerPad;
      const width = action.options.width;
      console.log('width', width, 'height', height);
      console.log('newState', {
        ...state,
        CardCreator: { ...CardCreator, width, height }
      });
      return {
        ...state,
        CardCreator: { ...CardCreator, width, height }
      };
    }

    default:
      return state;
  }
}

export default reducer;
