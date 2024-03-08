// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  // Add middleware or enhancers here if needed
});

export default store;
