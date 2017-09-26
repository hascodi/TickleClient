import { connect } from 'react-redux';
import { toggleChallenge } from '../actions';
import CardTimeLine from '../components/cards/CardTimeLine';

const getVisibleChallenges = (cards, filter) => {
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
  cards: getVisibleChallenges(state.cards, state.visibilityFilter)
});

const mapDispatchToProps = dispatch => ({
  onTodoClick: (id) => {
    dispatch(toggleChallenge(id));
  }
});

const VisibleCardList = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTimeLine);
export default VisibleCardList;
