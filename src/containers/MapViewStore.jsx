// import * as d3 from 'd3';
import { createStore } from 'redux';

// import imgSrc from './components/example_challenge.jpg';

import mapViewReducer from '../reducers';
// import MapView from '../components/MapView';

// TODO: change later
import { dummyCards } from '../dummyData';

dummyCards.forEach((d, i) => {
  d.id = i;
});

const defaultState = {
  cards: dummyCards
};

const store = createStore(mapViewReducer, defaultState);

export default store;
