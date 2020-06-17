
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withResizeDetector } from 'react-resize-detector';
import styles from './defaultlayout.module.css'; 


import { BottomSheet } from './BottomSheet';
import { LayoutFloors } from './LayoutFloors';
import { LayoutCounts } from './LayoutCounts';
import { RTLS } from './RTLS';

const RTLSwithResize = withResizeDetector(RTLS);

export function DefaultLayout (){



  return (
    <div id="layoutSidenav">
        <div id="layoutSidenav_nav" style={{background: "red"}}>
          <nav className="sidenav shadow-right sidenav-light" ></nav>
        </div>
        <div id="layoutSidenav_content" style={{background: "white"}}>
          <main>
            <Switch>
              <Route
                  exact
                  path="/rtls"
                  component={RTLSwithResize}
                />

            </Switch>
          </main> 

          <footer className="footer mt-auto footer-light"></footer>

        </div>

        <LayoutCounts/>
        <LayoutFloors/>        
        <BottomSheet/>

    </div>
  );
}