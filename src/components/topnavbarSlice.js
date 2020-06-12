import { createSlice } from '@reduxjs/toolkit';

export const topnavbarSlice = createSlice({
  name: 'topnavbar',
  initialState: {
    menuOpen: true,
    floorOpen: true,
    countsOpen: true,
    infoOpen: false
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
  },
});

export const { togglemenu, togglefloors, togglecounts, toggleinfo } = topnavbarSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMenuOpen = state => state.topnavbar.menuOpen;
export const selectFloorOpen = state => state.topnavbar.floorOpen;
export const selectCountsOpen = state => state.topnavbar.countsOpen;
export const selectInfoOpen = state => state.topnavbar.infoOpen;

export default topnavbarSlice.reducer;
