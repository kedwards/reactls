import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import { DefaultLayout } from './components/DefaultLayout';
import { TopNavBar } from './components/TopNavBar';
import { Login } from './views/Login'

import { useSelector } from 'react-redux';
import {  selectLoggedIn,selectUsername} from './components/authenticationSlice';

import './App.scss';
require('dotenv').config();

function App() {
  let isAuthenticated = useSelector(selectLoggedIn);
  const username = useSelector(selectUsername);

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
