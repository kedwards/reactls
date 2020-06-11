import { createSlice } from '@reduxjs/toolkit';


export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
      loggingIn: false,
      loggedIn: false,
      username: null
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
          state.username += action.payload;
      }
    },
  });

export const { setloggingin, setloggedin, setUsername } = authenticationSlice.actions;


export const selectLoggingIn = state => state.loggingIn;
export const selectLoggedIn = state => state.loggedIn;

export default authenticationSlice.reducer;
