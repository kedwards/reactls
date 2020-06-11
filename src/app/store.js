import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topnavbarReducer from '../components/topnavbarSlice';
import authenticationReducer from '../components/authenticationSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    topnavbar: topnavbarReducer,
    authentication: authenticationReducer
  },
});
