const card = (state = {}, action) => {
  switch (action.type) {
  case 'ADD_Card':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
  case 'TOGGLE_CARD':
    if (state.id !== action.id) {
      return state;
    }
    return Object.assign({}, state, {
      completed: !state.completed
    });

  default:
    return state;
  }
};

const cards = (state = [], action) => {
  switch (action.type) {
  case 'ADD_Card':
    return [
      ...state,
      card(undefined, action)
    ];
  case 'TOGGLE_CARD':
    return state.map(t =>
        card(t, action)
      );
  default:
    return state;
  }
};

export default cards;
