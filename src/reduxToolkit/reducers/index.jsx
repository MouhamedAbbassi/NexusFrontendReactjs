import { combineReducers } from 'redux';
import taskReducer from './taskReducers';
import backlogReducer from './backlogReducers ';

const rootReducer = combineReducers({
  tasks: taskReducer,
  backlog:backlogReducer
});

export default rootReducer;
