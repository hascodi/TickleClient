// import React from 'react';
import { connect } from 'react-redux';
// import { toggleChallenge } from '../actions';
import {
  selectCard,
  resizeCardWindow,
  userMove,
  changeMapViewport,
  screenResize,
  playCardChallenge,
  toggleCardChallenge
} from './actions';

import MapView from './MapView';

// import mapViewReducer from './reducer';

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
  changeMapViewport: viewport => {
    console.log('dispatch vp', viewport);
    dispatch(changeMapViewport(viewport));
  },
  selectCard: options => {
    // console.log('dispatch', viewport);
    dispatch(selectCard(options));
  },
  screenResize: options => {
    dispatch(screenResize(options));
  },
  playCardChallenge: options => {
    dispatch(playCardChallenge(options));
  },
  toggleCardChallenge: options => {
    console.log('dispatch options', options);
    dispatch(toggleCardChallenge(options));
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);

export default MapViewCont;
