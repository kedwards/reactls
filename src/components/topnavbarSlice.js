import { createSlice } from '@reduxjs/toolkit';

export const topnavbarSlice = createSlice({
  name: 'topnavbar',
  initialState: {
    menuOpen: true,
    floorOpen: true,
    countsOpen: true,
    infoOpen: false
     // (THESE DEPEND ON $localstorage, then SIZE OF SCREEN INITIALLY!  TODO!! )
  },
  reducers: {
    togglemenu: state => {
      state.menuOpen = !state.menuOpen
    },
    togglefloors: state =>{
      state.floorOpen = !state.floorOpen
    },
    togglecounts: state =>{
      state.countsOpen = !state.countsOpen
    },
    toggleinfo: state =>{
      state.infoOpen = !state.infoOpen
    }
    // increment: state => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const { togglemenu, togglefloors, togglecounts, toggleinfo } = topnavbarSlice.actions;
// {increment, decrement, incrementByAmount}


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMenuOpen = state => state.topnavbar.menuOpen;
export const selectFloorOpen = state => state.topnavbar.floorOpen;
export const selectCountsOpen = state => state.topnavbar.countsOpen;
export const selectInfoOpen = state => state.topnavbar.infoOpen;

export default topnavbarSlice.reducer;
