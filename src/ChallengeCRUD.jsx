import React from 'react';
// import * as d3 from 'd3';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// import imgSrc from './components/example_challenge.jpg';

import todoApp from './reducers';
import Journal from './components/Journal';

// TODO: change later
import dummyData from './dummyData';

const defaultState = {
  cards: dummyData
};

const store = createStore(todoApp, defaultState);

export default () =>
  (<Provider store={store}>
    <Journal />
  </Provider>);
