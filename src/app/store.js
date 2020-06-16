import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topnavbarReducer from '../components/topnavbarSlice';
import authenticationReducer from '../components/authenticationSlice';
import tagsReducer from '../components/tagsSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
// import reduxWebsocketReducer from '../components/ReduxWebsocketReducer';
import reduxWebsocket from '@giantmachines/redux-websocket';
// import throttle from "redux-throttle";
 

// Redux Throttle
// const defaultWait = 300
// const defaultThrottleOption = { // https://lodash.com/docs#throttle
//   leading: true,
//   trailing: true
// }
// const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);


// Redux Websocket
const reduxWebsocketMiddleware = reduxWebsocket();
const persistConfig = {
  key: 'username',
  storage,
  whitelist: ['authentication'] 
}


console.log('creating root reducer');
const rootReducer = combineReducers({
  counter: counterReducer,
  topnavbar: topnavbarReducer,
  authentication: authenticationReducer,
  // socket:reduxWebsocketReducer,
  tags:tagsReducer
});





let storeObj = configureStore({
  reducer: persistReducer(persistConfig, rootReducer), //reducers//rootReducer//  rootReducerOld//
  middleware:[reduxWebsocketMiddleware, ...getDefaultMiddleware({serializableCheck: false})],  // throttleMiddleware,
});
let persistorObj = persistStore(storeObj);

export const { store, persistor } = { store:storeObj, persistor:persistorObj };
