import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topnavbarReducer from '../components/topnavbarSlice';
import authenticationReducer from '../components/authenticationSlice'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'


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
  middleware:getDefaultMiddleware({  // fixes console error  :  https://github.com/rt2zz/redux-persist/issues/988
    serializableCheck: false,
  })
});
let persistorObj = persistStore(storeObj);

export const { store, persistor } = { store:storeObj, persistor:persistorObj };
