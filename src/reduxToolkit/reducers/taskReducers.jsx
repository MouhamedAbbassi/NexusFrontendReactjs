// reducers/taskReducer.js
import { FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE,
   ADD_TASK_REQUEST, ADD_TASK_SUCCESS, ADD_TASK_FAILURE ,} from '../actions/typeTask';

const initialState = {
  backlogs: [],
  tasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload,
      };
    case FETCH_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case ADD_TASK_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ADD_TASK_SUCCESS:
        return {
          ...state,
          loading: false,
          tasks: [...state.tasks, action.payload],
        };
      case ADD_TASK_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };   
    default:
      return state;
  }
};

export default taskReducer;
