// TODO: do something better
export const SELECT_CARD = 'SELECT_CARD_1';
export const OPEN_CARD_DETAILS = 'OPEN_CARD_DETAILS';
export const CARD_CREATOR_SCREEN_RESIZE = 'CARD_CREATOR_SCREEN_RESIZE';
export const CHANGE_MAP_VIEWPORT = 'CHANGE_MAP_VIEWPORT';
export const CREATE_CARD = 'CREATE_CARD';
export const UPDATE_CARD = 'UPDATE_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
export const DRAG_CARD = 'DRAG_CARD';

// export const VisibilityFilters = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_COMPLETED: 'SHOW_COMPLETED',
//   SHOW_ACTIVE: 'SHOW_ACTIVE'
// }

/*
 * action creators
 */

export function selectCard(options) {
  return { type: SELECT_CARD, options };
}
export function openCardDetails(options) {
  return { type: OPEN_CARD_DETAILS, options };
}

// export function clickCard(options) {
//   return { type: CLICK_CARD, options };
// }

export function screenResize(options) {
  return { type: CARD_CREATOR_SCREEN_RESIZE, options };
}

export function changeMapViewport(options) {
  return { type: CHANGE_MAP_VIEWPORT, options };
}

export function removeCard(options) {
  return { type: REMOVE_CARD, options };
}
export function updateCard(options) {
  return { type: UPDATE_CARD, options };
}

export function createCard(options) {
  return { type: CREATE_CARD, options };
}

export function dragCard(options) {
  return { type: DRAG_CARD, options };
}
// export function toggleTodo(index) {
//   return { type: TOGGLE_TODO, index };
// }
//
// export function setVisibilityFilter(filter) {
//   return { type: SET_VISIBILITY_FILTER, filter };
// }
