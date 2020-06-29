import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { DefaultLayout } from './components/DefaultLayout';
import { TopNavBar } from './components/TopNavBar';
import { Login } from './views/Login'
import Helper from './constants/helper';

import {  selectLoggedIn,selectUsername, selectToken, setloggingin, setloggedin, setLoggedOut} from './components/authenticationSlice';
import {  passDispatchReference, handleWebsocketMessage } from './components/tagsSlice';
import { fetchBuildings, selectCurrentBuilding, selectCurrentPlan } from './components/buildingsSlice';

import ReconnectingWebSocket from 'reconnecting-websocket';



import './App.scss';
require('dotenv').config();

// let currentBuildingRef = null,currentPlanRef = null;
let rws = null; // websocket reference
export const initWebsocket = () =>{
  rws = new ReconnectingWebSocket(process.env.REACT_APP_API_WEBSOCKET_URL);
  rws.addEventListener('message', (m) => {
    handleWebsocketMessage(m); //, {currentBuilding: currentBuildingRef, currentBuilding: currentBuildingRef}
  });
}

export const killWebsocket = () =>{
  rws.close();
  rws = null;
  // let rws = new ReconnectingWebSocket(process.env.REACT_APP_API_WEBSOCKET_URL);
  // rws.addEventListener('message', (m) => {
  //   handleWebsocketMessage(m);
  // });
}




function App() {
  let isAuthenticated = useSelector(selectLoggedIn);
  const token = useSelector(selectToken);
  const currentBuilding = useSelector(selectCurrentBuilding);
  // currentBuildingRef = currentBuilding;
  const currentPlan = useSelector(selectCurrentPlan);
  // currentPlanRef = currentPlan;
  const dispatch = useDispatch();
  
  useEffect(() => {

    passDispatchReference(dispatch) // gives tagsSlice ability to dispatch changes to "update" state variable

    // dispatch(setloggingin());
    console.log('useEffect!')

    async function checkLogin() {
      // let killUser = true;
      let result = await Helper.getRoles({token })
      if(result.status === 200 && result.json && result.json.success){
          console.log('token still good serverside!');
        
        // dispatch(connect(process.env.REACT_APP_API_WEBSOCKET_URL)); // slow way
        initWebsocket();

        dispatch(fetchBuildings({token}));

        
        // Helper.init({authToken, dispatch });

        // setTimeout(function(){
        //   // dispatch(disconnect());

        // },1000)

      }else{
        console.log('killing auth data, token was invalid on serverside!');
        dispatch(setLoggedOut());
      }
      
    }
    checkLogin();

    // dispatch(setloggingin());
    if(isAuthenticated){

    }
  },[])

  return (
    <BrowserRouter>
      <TopNavBar></TopNavBar>
      <> { /* Fragment used to prevent warning */ }
        <Switch>
            <UnauthenticatedRoute
                exact
                path="/login"
                component={Login}
                appProps={{ isAuthenticated }}
              />
            <AuthenticatedRoute
              
              path="/"
              component={DefaultLayout}
              appProps={{ isAuthenticated }}
              /> 
        </Switch>
      </>
    </BrowserRouter>
  );
}

export default App;
