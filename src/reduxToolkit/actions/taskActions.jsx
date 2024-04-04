// actions/taskActions.js
import { FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE, 
  ADD_TASK_REQUEST, ADD_TASK_SUCCESS, ADD_TASK_FAILURE,
  FETCH_BACKLOG_REQUEST,FETCH_BACKLOG_SUCCESS,FETCH_BACKLOG_FAILURE } from './typeTask';
import { getTasks,getBacklog,addTask } from '../../services/task.jsx';

/////////////////////////////FETCH_TASK////////////////////////////
export const fetchTasks = () => async (dispatch) => {
  dispatch({ type: FETCH_TASKS_REQUEST });

  try {
    const response = await getTasks();
    dispatch({ type: FETCH_TASKS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TASKS_FAILURE, payload: error.message });
  }
};

/////////////////////////////FETCH_BACKLOG////////////////////////////
export const fetchBacklog = () => async (dispatch) => {
  dispatch({ type: FETCH_BACKLOG_REQUEST });

  try {
    const response = await getBacklog();
    dispatch({ type: FETCH_BACKLOG_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_BACKLOG_FAILURE, payload: error.message });
  }
};

/////////////////////////////ADD_TASK////////////////////////////
export const addTaskAction = (taskData) => async (dispatch) => {
  dispatch({ type: ADD_TASK_REQUEST });

  try {
    const response = await addTask(taskData);
    dispatch({ type: ADD_TASK_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_TASK_FAILURE, payload: error.message });
  }
};

