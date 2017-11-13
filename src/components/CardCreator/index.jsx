// import React from 'react';
import { connect } from 'react-redux';
// import { toggleChallenge } from '../actions';
import { screenResize } from './actions_cardCreator';

import CardCreator from './CardCreator';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => ({
  ...state.CardCreator
});

const mapDispatchToProps = dispatch => ({
  screenResize: options => {
    dispatch(screenResize(options));
  }
});

const CardCreatorCont = connect(mapStateToProps, mapDispatchToProps)(
  CardCreator
);

export default CardCreatorCont;
