import React from 'react';
import { Redirect, Route } from 'react-router-dom';



export default ({ component: C, appProps, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      !appProps.isAuthenticated
        ? <C {...props} {...appProps} />
        : <Redirect to="/" />}
  />;