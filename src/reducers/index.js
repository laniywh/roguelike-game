import { combineReducers } from 'redux';
import TilesReducer from './tiles_reducer';
import _ from 'lodash';




export const INITIAL_STATE = {
  tiles: [],
};


const rootReducer = combineReducers({
  tiles: TilesReducer,
});

export default rootReducer;
