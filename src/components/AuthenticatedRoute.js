import React from "react";
import { useSelector } from 'react-redux';
import { Route, Redirect, useLocation } from "react-router-dom";

import {
  selectLoggedIn
} from './authenticationSlice';



export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const isAuthenticated = useSelector(selectLoggedIn);
  // const isAuthenticated = false; // TODO - get this from redux store!
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={
          `/login`//?redirect=${pathname}${search}`
        } />
      )}
    </Route>
  );
}
