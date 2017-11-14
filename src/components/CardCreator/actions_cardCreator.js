export const SELECT_CARD = 'SELECT_CARD';
export const CARD_CREATOR_SCREEN_RESIZE = 'CARD_CREATOR_SCREEN_RESIZE';
export const CHANGE_MAP_VIEWPORT = 'CHANGE_MAP_VIEWPORT';

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

// export function clickCard(options) {
//   return { type: CLICK_CARD, options };
// }

export function screenResize(options) {
  return { type: CARD_CREATOR_SCREEN_RESIZE, options };
}

export function changeMapViewport(options) {
  return { type: CHANGE_MAP_VIEWPORT, options };
}

// export function toggleTodo(index) {
//   return { type: TOGGLE_TODO, index };
// }
//
// export function setVisibilityFilter(filter) {
//   return { type: SET_VISIBILITY_FILTER, filter };
// }
