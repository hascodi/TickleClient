// import { combineReducers } from 'redux';
// import cards from './cards';
// import visibilityFilter from './visibilityFilter';
import ViewportMercator from 'viewport-mercator-project';
import {
  CARD_CREATOR_SCREEN_RESIZE,
  CHANGE_MAP_VIEWPORT,
  SELECT_CARD,
  UPDATE_CARD,
  CREATE_CARD,
  DRAG_CARD,
  OPEN_CARD_DETAILS
} from './actions_cardCreator';

// const mapViewApp = combineReducers({
//   cards,
//   visibilityFilter
// });
//
// export default mapViewApp;

const dummyCard = ({ latitude, longitude }) => ({
  title: '-',
  type: '-',
  // TODO: change
  key: Math.random() * 1000,
  date: '04/04/2012 10:00',
  tags: ['', ''],
  img: '',
  caption: '',
  xpPoints: 0,
  // TODO: remove in future to component
  description: '',
  location: { latitude, longitude },
  place: '',
  creator: 'Jan',
  media: [],
  friends: [],
  rating: [],
  cardSets: [],
  linkedCards: []
});

function reducer(state = {}, action) {
  console.log(action.type, action.options);
  switch (action.type) {
    case CARD_CREATOR_SCREEN_RESIZE: {
      console.log('state taken', action);
      const height = action.options.height - state.headerPad;
      const width = action.options.width;
      console.log('width', width, 'height', height);
      return { ...state, width, height };
    }

    case CHANGE_MAP_VIEWPORT: {
      const mapViewport = action.options;

      return {
        ...state,
        mapViewport
      };
    }
    case SELECT_CARD: {
      const { width, height } = state;
      if (action.options) {
        const { latitude, longitude } = action.options.location;
        const selected = { ...action.options, extended: false };
        const mapViewport = {
          ...state.mapViewport,
          latitude,
          longitude,
          height: height * 1.5
        };
        return {
          ...state,
          mapViewport,
          oldViewport: { ...state.mapViewport },
          selected
        };
      }
      return {
        ...state,
        mapViewport: state.oldViewport,
        selected: null
      };
    }
    case OPEN_CARD_DETAILS: {
      const selectedCardId = action.options;
      console.log('open', action);

      return {
        ...state,
        highlighted: true
      };
    }
    case UPDATE_CARD: {
      const { selectedCardId } = action.options;

      return {
        ...state,
        selectedCardId
      };
    }
    case CREATE_CARD: {
      const { width, height, mapViewport } = state;

      const mercator = ViewportMercator({ width, height, ...mapViewport });
      const { unproject } = mercator;
      const { x, y } = action.options;
      const pos = unproject([x, y]);
      const newCard = dummyCard({
        id: 'tempCard',
        longitude: pos[0],
        latitude: pos[1]
      });
      newCard.temp = true;
      return {
        ...state,
        tempCards: [...state.tempCards, newCard],
        isDragging: false
      };
    }

    case DRAG_CARD: {
      return {
        ...state,
        isDragging: true
      };
    }
    default:
      return state;
  }
}

export default reducer;
