import { connect } from 'react-redux';
import { createStore } from 'redux';
// import { toggleChallenge } from '../actions';
import { selectCard } from '../actions';
import MapView from '../components/MapView';

const getVisibleCards = (cards, filter) => {
  switch (filter) {
  case 'SHOW_ALL':
    return cards;
  case 'SHOW_COMPLETED':
    return cards.filter(t => t.completed);
  case 'SHOW_ACTIVE':
    return cards.filter(t => !t.completed);
    // skip default
  }
};

const mapStateToProps = state => ({
  cards: state.cards
});

const mapDispatchToProps = dispatch => ({
  cardClickAction: card => {
    dispatch(selectCard(card));
  }
});

const MapViewCont = connect(mapStateToProps, mapDispatchToProps)(MapView);
export default MapViewCont;
