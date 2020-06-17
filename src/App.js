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
import { fetchBuildings } from './components/buildingsSlice';

import { connect, disconnect } from '@giantmachines/redux-websocket';

import './App.scss';
require('dotenv').config();

function App() {
  let isAuthenticated = useSelector(selectLoggedIn);
  const username = useSelector(selectUsername);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  
  useEffect(() => {

    // dispatch(setloggingin());
    console.log('useEffect!')

    async function checkLogin() {
      // let killUser = true;
      let result = await Helper.getRoles({token })
      if(result.status === 200 && result.json && result.json.success){
        // let something = await result.response.json()
        // if(result.json && something){
          console.log('token still good serverside!');
          // killUser = false;
        // }
        
        dispatch(connect('ws://localhost:3001'));

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
