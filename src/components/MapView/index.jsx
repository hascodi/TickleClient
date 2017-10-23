import React from 'react';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
// import { toggleChallenge } from '../actions';
import {
  selectCard,
  resizeCardWindow,
  userMove,
  changeViewport,
  clickCard,
  screenResize
} from './actions';

import MapView from './MapView';

import mapViewReducer from './reducer';

import { dummyCards } from '../../dummyData';

dummyCards.forEach((d, i) => {
  d.id = i;
});

const defaultState = {
  headerPad: 60, // TODO: remove
  cards: dummyCards,
  mapZoom: 20,
  centerLocation: {
    latitude: 50.85146,
    longitude: 4.315483
  },
  userLocation: {
    latitude: 50.85146,
    longitude: 4.315483
  },
  selectedCard: null,
  height: 100,
  width: 100,
  defaultHeight: 100,
  gridWidth: 100,
  maxHeight: 100,
  minHeight: 100,
  mapHeight: 100,
  gridHeight: 100
};

// Container
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  cardClick: card => {
    dispatch(selectCard(card));
  },
  resizeCardWindow: options => {
    dispatch(resizeCardWindow(options));
  },
  userMove: pos => {
    // console.log('dispatch', pos);
    dispatch(userMove(pos));
  },
  changeViewport: viewport => {
    // console.log('dispatch', viewport);
    dispatch(changeViewport(viewport));
  },
  clickCard: options => {
    // console.log('dispatch', viewport);
    dispatch(clickCard(options));
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);

// STORE

const store = createStore(mapViewReducer, defaultState);

window.addEventListener('load', () => {
  console.log('onload');
  store.dispatch(
    screenResize({ width: window.innerWidth, height: window.innerHeight })
  );
});

export default () =>
  <Provider store={store}>
    <MapViewCont />
  </Provider>;
