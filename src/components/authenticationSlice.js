import { createSlice } from '@reduxjs/toolkit';


export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
      loggingIn: false,
      loggedIn: false,
      username: null,
      token: null
    },
    reducers: {
      setloggingin: state => {
        state.loggedIn = false;
        state.loggingIn = true;
      },
      setloggedin: state =>{
        state.loggedIn = true;
        state.loggingIn = false;
      },
      setUsername: (state, action) => {
          state.username = action.payload;
      },
      setToken: (state, action) => {
          state.token = action.payload;
      },
      setLoggedOut: state =>{
        state.loggedIn = false;
        state.loggingIn = false;
        state.username = null;
        state.token = null;
      }
    },
  });

export const { setloggingin, setloggedin, setUsername, setToken, setLoggedOut } = authenticationSlice.actions;


export const selectLoggingIn = state => state.authentication.loggingIn;
export const selectLoggedIn = state => state.authentication.loggedIn;
export const selectUsername = state => state.authentication.username;

export default authenticationSlice.reducer;
