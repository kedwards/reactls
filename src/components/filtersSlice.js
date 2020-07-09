import { createSlice } from '@reduxjs/toolkit';



export const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    focusedFeeds: {}
  },
  reducers: {
    setFocusedFeeds: (state, action) =>{

      state.focusedFeeds = action.payload

      // state.focusedFeeds = action.payload.reduce((m,r)=>{
      //   m[r.id] = true;
      //   return m;
      // },{});
    }
   
  }
});

export const { setFocusedFeeds } = filtersSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectFocusedFeeds = state => state.filters.focusedFeeds;

export default filtersSlice.reducer;
