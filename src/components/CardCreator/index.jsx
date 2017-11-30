// import React from 'react';
import { connect } from 'react-redux';
// import { toggleChallenge } from '../actions';
import {
  screenResize,
  changeMapViewport,
  selectCard,
  createCard,
  dragCard,
  openCardDetails
} from './actions_cardCreator';

import CardCreator from './CardCreator';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => ({
  ...state.CardCreator
});

const mapDispatchToProps = dispatch => ({
  screenResize: options => {
    dispatch(screenResize(options));
  },
  changeMapViewport: options => {
    dispatch(changeMapViewport(options));
  },
  selectCard: options => {
    dispatch(selectCard(options));
  },
  openCardDetails: options => {
    dispatch(openCardDetails(options));
  },
  createCard: options => {
    dispatch(createCard(options));
  },
  dragCard: options => {
    dispatch(dragCard(options));
  }
});

const CardCreatorCont = connect(mapStateToProps, mapDispatchToProps)(
  CardCreator
);

export default CardCreatorCont;
