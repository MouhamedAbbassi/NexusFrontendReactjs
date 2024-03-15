// reducers/taskReducer.js
import {FETCH_BACKLOG_FAILURE,FETCH_BACKLOG_SUCCESS,FETCH_BACKLOG_REQUEST} from '../actions/typeTask';

const initialState = {
  backlogs: [],
  tasks: [],
  loading: false,
  error: null,
};

const backlogReducer = (state = initialState, action) => {
  switch (action.type) {
      case FETCH_BACKLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        
      };
    case FETCH_BACKLOG_SUCCESS:
      return {
        ...state,
        loading: false,
        backlogs:action.payload,
            };
    case FETCH_BACKLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
     
    default:
      return state;
  }
};

export default backlogReducer;
