/*
 * action types
 */

export const SELECT_CARD = 'SELECT_CARD';
export const PLAY_CARD_CHALLENGE = 'PLAY_CARD_CHALLENGE ';
export const RESIZE_CARD_WINDOW = 'RESIZE_CARD_WINDOW';
export const USER_MOVE = 'USER_MOVE';
export const CHANGE_VIEWPORT = 'CHANGE_VIEWPORT';
export const CLICK_CARD = 'CLICK_CARD';
export const SCREEN_RESIZE = 'SCREEN_RESIZE';
// export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */

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

export function resizeCardWindow(options) {
  return { type: SELECT_CARD, options };
}

export function userMove(options) {
  return { type: USER_MOVE, options };
}

export function changeViewport(options) {
  return { type: CHANGE_VIEWPORT, options };
}

export function clickCard(options) {
  return { type: CLICK_CARD, options };
}

export function screenResize(options) {
  return { type: SCREEN_RESIZE, options };
}
// export function toggleTodo(index) {
//   return { type: TOGGLE_TODO, index };
// }
//
// export function setVisibilityFilter(filter) {
//   return { type: SET_VISIBILITY_FILTER, filter };
// }
