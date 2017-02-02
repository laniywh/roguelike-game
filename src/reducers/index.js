import { combineReducers } from 'redux';
import TilesReducer from './tiles_reducer';
import _ from 'lodash';




export const INITIAL_STATE = {
  map: {
    tiles: [],
  }
};


const rootReducer = combineReducers({
  map: TilesReducer,
});

export default rootReducer;
