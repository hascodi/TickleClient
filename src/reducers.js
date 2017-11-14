import { combineReducers } from 'redux';
import MapView from './components/MapView/reducer';
import CardCreator from './components/CardCreator/reducer_cardCreator';

export default combineReducers({ MapView, CardCreator });
// export default MapView;
// export default CardCreator;
