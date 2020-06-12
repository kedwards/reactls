import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topnavbarReducer from '../components/topnavbarSlice';
import authenticationReducer from '../components/authenticationSlice'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import thunk from 'redux-thunk'


const persistConfig = {
  key: 'username',
  storage,
  whitelist: ['authentication'] 
}

const rootReducer = combineReducers({
  counter: counterReducer,
  topnavbar: topnavbarReducer,
  authentication: authenticationReducer
});

let storeObj = configureStore({
  reducer: persistReducer(persistConfig, rootReducer), //reducers//rootReducer//  rootReducerOld//
  middleware: [thunk, logger] // this is in order to remove console error    https://github.com/rt2zz/redux-persist/issues/988
});
let persistorObj = persistStore(storeObj);

export const { store, persistor } = { store:storeObj, persistor:persistorObj };
