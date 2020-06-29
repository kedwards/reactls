import { createSlice } from '@reduxjs/toolkit';
import Helper from '../constants/helper';
import apiPath from "../constants/apiPath";

// const sizeOf = require('image-size');



export const buildingsSlice = createSlice({
  name: 'buildings',
  initialState: {
    buildings: {},
    plans: {},
    currentBuilding: null,
    currentPlan: null
  },
  reducers: {
    setPlans: (state, action) =>{

      state.plans = action.payload;
    },
    setBuildings: (state,action) => {
      state.buildings = action.payload;
    },
    setInitBuildingPlan: (state,action) =>{
      if(!state.currentBuilding){  // might already be persisted via redux-persist
        state.currentBuilding = state.buildings[action.payload.firstBuilding];
        state.currentPlan = state.plans[action.payload.firstPlan];

      }
    },
    setCurrentBuildingPlan:  (state,action) => { 
      state.currentBuilding = state.buildings[action.payload.buildingId];
      state.currentPlan = state.plans[action.payload.planId];
    },
    // setCurrentBuildingById: (state,action) => { 
    //   state.currentBuilding = state.buildings[action.payload];
    // },
    // setCurrentPlanById: (state,action) => { 
    //   state.currentPlan = state.plans[action.payload];
    // }
  },
});

export const { setBuildings, setPlans, setInitBuildingPlan, setCurrentBuildingPlan} = buildingsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBuildings = state => state.buildings.buildings;
export const selectPlans = state=> state.buildings.plans;
export const selectCurrentPlan = state => state.buildings.currentPlan;

export const selectCurrentBuilding = state => state.buildings.currentBuilding;


export const fetchBuildings = ({token}) => async dispatch => {
    let buildingsRequest = await Helper.get({}, apiPath.buildings, {token});
    let response = await buildingsRequest.response;
    let json = await response.json();

    let buildings = {}

    let plans = {}
    let firstPlan = null
    let firstBuilding = null;


    for( let b of json.results){
      for (let [key, p] of Object.entries(b.plans)) {

        p.image = `${process.env.REACT_APP_API_BASE_URL}/plans/${p.url.substring(p.url.lastIndexOf('/')+1)}`;
        let dimensions = await (new Promise((res,rej)=>{
          var img = new Image();
          img.addEventListener("load", function(){
              res({ width_pixels: this.naturalWidth, height_pixels: this.naturalHeight })
          });
          img.src = p.image;
        }));

        Object.assign(p,dimensions);
        p.width_meters = p.width_pixels / p.scale;
        p.height_meters = p.height_pixels / p.scale;
        p.buildingId = b.id;

        plans[p.id] = p;
        if (!firstPlan) {
          firstPlan = p.id;
          firstBuilding = b.id;
        }
      }

      buildings[b.id] = b;
    }

    dispatch(setBuildings(buildings));
    dispatch(setPlans(plans));
    dispatch(setInitBuildingPlan({firstBuilding, firstPlan}))
};


// export const selectCurrentFloorplan = state => state.buildings.currentPlan;

export default buildingsSlice.reducer;
