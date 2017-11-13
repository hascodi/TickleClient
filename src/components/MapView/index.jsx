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
  ...state.MapView
});

const mapDispatchToProps = dispatch => ({
  cardClick: card => {
    console.log('before dispatch cardClick');
    dispatch(selectCard(card));
  },
  resizeCardWindow: options => {
    console.log('before dispatch resizeCardWindow');
    dispatch(resizeCardWindow(options));
  },
  userMove: pos => {
    console.log('before dispatch usermove');
    dispatch(userMove(pos));
  },
  changeMapViewport: viewport => {
    console.log('dispatch vp', viewport);
    dispatch(changeMapViewport(viewport));
  },
  selectCard: options => {
    // console.log('dispatch', viewport);
    console.log('before dispatch selectCard');
    dispatch(selectCard(options));
  },
  screenResize: options => {
    console.log('before dispatch screenResize');
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
