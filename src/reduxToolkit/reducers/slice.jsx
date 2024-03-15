import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTask } from '../../services/task'; // Import your service function here


const initialState = {
  status: 'idle',
  error: null,
};

// Define the thunk action for adding a task
export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const response = await addTask(id, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define a slice
const addTaskSlice = createSlice({
  name: 'addTask',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

// Export the slice reducer
export default addTaskSlice.reducer;
