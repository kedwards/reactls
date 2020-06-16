import { createSlice } from '@reduxjs/toolkit';

export const buildingsSlice = createSlice({
  name: 'buildings',
  initialState: {
    buildings: {},
    currentBuilding: null,
    currentPlan: null,
    plans: {}
  },
  reducers: {
    setBuildings: (state, action) => {
      if (action && action.payload && action.payload.results) {
        action.payload.results.forEach(b => {
          Object.entries(b.plans).forEach(([key,p]) => {
            p.image = `http://localhost:3001/plans/${p.url.substring(p.url.lastIndexOf('/')+1)}`;
            state.plans[p.id] = p;
            if (!state.currentPlan) {
              state.currentPlan = p;
              state.currentBuilding = b;
            }
          })
          state.buildings[b.id] = b;
        })
      }
    }
  },
});

export const { setBuildings } = buildingsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectMenuOpen = state => state.topnavbar.menuOpen;
// export const selectFloorOpen = state => state.topnavbar.floorOpen;
// export const selectCountsOpen = state => state.topnavbar.countsOpen;

// export const selectFloorPlanUrl = state => state.
export const selectBuildings = state => state.buildings.buildings;
export const selectPlans = state=> state.buildings.plans;
export const selectCurrentPlan = state => state.buildings.currentPlan;

// export const selectPlanUrl = state => {
//   let curPlan = state.buildings.plans[state.buildings.currentPlan]
//   if(curPlan){
//     return curPlan.image;
//   }else{
//     return null;
//   }
//   // if(){
//   //   let oldUrl = state.buildings.plans[state.buildings.currentPlan].url;
//   //   return `http://localhost:3001/plans/${}`
//   // }else{
//   //   return null;
//   // }
// }
// export const selectPlans = state => state.buildings.plans;
export const selectCurrentBuilding = state => state.buildings.currentBuilding;
// export const selectCurrentFloorplan = state => state.buildings.currentPlan;

export default buildingsSlice.reducer;
