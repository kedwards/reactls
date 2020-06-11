import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
// import { AppContext } from "./libs/contextLib";

import { TopNavBar } from './components/TopNavBar';
// import { Counter } from './features/counter/Counter';
import { BottomSheet } from './components/BottomSheet';
import { LayoutFloors } from './components/LayoutFloors'
import { LayoutCounts } from './components/LayoutCounts'
import { Login } from './views/Login'
// import { Button } from 'reactstrap';
// import './App.css';
import './App.scss';
require('dotenv').config();

function App() {

  // const [isAuthenticated, userHasAuthenticated] = useState(false);
  const isAuthenticated = false;

  return (

    <BrowserRouter>
      <TopNavBar></TopNavBar>
      <Switch>
        <UnauthenticatedRoute
            path="/login"
            component={Login}
            appProps={{ isAuthenticated }}
          />
        {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} /> */}
        
        <div id="layoutSidenav">
          <div id="layoutSidenav_nav" style={{background: "red"}}>
            <nav className="sidenav shadow-right sidenav-light" ></nav>
          </div>
          <div id="layoutSidenav_content" style={{background: "blue"}}>
            <main>
              {/* <AuthenticatedRoute
                path="/todos"
                component={Todos}
                appProps={{ isAuthenticated }}
              /> */ }
              {/* <Route component={NotFound} /> */}
              
              {/* <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    Column 1
                  </div>
                  <div className="col-md-6">
                    Column 2
                  </div>
                </div>
                <div className="row">
                  <Counter />
                </div>
                
              </div> */}
              
              
            </main> 

            <footer className="footer mt-auto footer-light"></footer>

          </div>

          <LayoutCounts/>
          {/* <div id="layoutSidenav_counts" style={{background: "orange"}}>
            <nav className="sidenav shadow-left sidenav-light" ></nav>
          </div> */}
          <LayoutFloors/>
            

          <BottomSheet/>

        </div>
      </Switch>
    </BrowserRouter>


  );
}

export default App;
