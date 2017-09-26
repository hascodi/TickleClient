let nextTodoId = 0;
export const addChallenge = text => ({
  type: 'ADD_CHALLENGE',
  id: nextTodoId++,
  text
});

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

export const toggleChallenge = id => ({
  type: 'TOGGLE_CHALLENGE',
  id
});
