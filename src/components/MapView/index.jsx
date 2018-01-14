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
  toggleCardChallenge,
  extendSelectedCard
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
  userMoveAction: pos => {
    console.log('before dispatch usermove');
    dispatch(userMove(pos));
  },
  changeMapViewportAction: viewport => {
    console.log('dispatch vp', viewport);
    dispatch(changeMapViewport(viewport));
  },
  selectCardAction: options => {
    // console.log('dispatch', viewport);
    console.log('before dispatch selectCard');
    dispatch(selectCard(options));
  },
  screenResizeAction: options => {
    console.log('before dispatch screenResize');
    dispatch(screenResize(options));
  },
  playCardChallengeAction: options => {
    dispatch(playCardChallenge(options));
  },
  toggleCardChallengeAction: options => {
    console.log('dispatch options', options);
    dispatch(toggleCardChallenge(options));
  },
  extCardAction: options => {
    console.log('dispatch options', options);
    dispatch(extendSelectedCard(options));
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);

export default MapViewCont;
