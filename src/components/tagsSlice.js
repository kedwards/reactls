import { createSlice, createAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { primeUpdateTrigger } from './RTLS';

const websocketMessage = createAction('REDUX_WEBSOCKET::MESSAGE')

const batchPeriod = 1000;
const overRideMovementperiod = 100 || null; // otherwise it uses the batchPeriod
let tagBuffer = {};
let lastUpdate = Date.now();
let tags = {};
let dispatch = null;
let panning = false;
let lastTimestamps = {};// used to block out of order socket messages!

let focusedTags = {};

// let busyDrawingFlag = true;

let globalUpdate = 0;  // true update count
let rtlsUpdateState = 0; // globalUpdate state as seen by RTLS. State that has actually taken effect!


// TODO-  add dispatch every batchPeriod, in order to display any last dangling positions in the buffer if the feed cuts off. LAST POSITION IS IMPORTANT!

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: {
        tags: {},
        updatePeriod: batchPeriod,
        update:0
    },
    reducers: {
        pushTagsUpdate: state => {
            // console.log('pushTagsUpdate')
            state.update++; //used for trigger
            globalUpdate++; // Truth to compare state.update against, used to slow tag renders
        }
    },
    extraReducers: {
        [websocketMessage]: (state, action) => {
            
            
        }
    }
});

export const {  pushTagsUpdate } = tagsSlice.actions;
// export const getDrawingFlag = () => busyDrawingFlag;
// export const setDrawingFalse = () => busyDrawingFlag = false;
// export const setDrawingTrue = () => busyDrawingFlag = true;
export const selectTags = state => state.tags.tags;
export const selectUpdatePeriod = state => overRideMovementperiod ? overRideMovementperiod : state.tags.updatePeriod;

// export const setFocusedTags = (fts) =>{
//     focusedTags = fts
// }
export const reflectUpdateTrigger = (updateTrigger)=>{
    rtlsUpdateState = updateTrigger;
}
export const getTags = ({ currentBuilding,currentPlan, feeds, oldData}) => { 
    
    // return tags;
    return Object.keys(tags)
      .filter(key => {
          return true || feeds[key] && feeds[key].location && feeds[key].location.ele == currentPlan.name;// && tagsInSocket[key].location.name == currentBuilding.title;
        })
      .reduce((obj, key) => {
        obj[key] = tags[key]; // do we want to clone this? - not needed (yet)
        if(oldData[key]){
            obj[key].prevX = oldData[key].x;
            obj[key].prevY = oldData[key].y;
        }else{
            obj[key].prevX = obj[key].x;
            obj[key].prevY = obj[key].y;
        }
        // obj[key].focused = !!focusedTags[key]; /// pack in focused information
        return obj;
      }, {});
};
export const getTagsTrigger = state => state.tags.update;

export const passDispatchReference = (dref) =>{
    dispatch = dref
}

export const setPanning = (state)=>{
    // console.log('setPanning',state);
    panning = state;
}

export const handleWebsocketMessage = (m) =>{
    // this can be moved down. TODO- dont update tag origin while panning,
    // if(panning) //avoids dispatching re-renders while panning
    //     return


    let rightNow = Date.now();
    let forceFlush = false;   //used to guarentee steps aren't missed

    let payload = JSON.parse(m.data);
    let obj = null;
    
    // everything is handling only tags at this point.
    // debugger;

    // break out if missing stuff, {currentBuilding, currentPlan}
    // if(!currentBuilding || !currentPlan || !payload.location || payload.location.ele !== currentPlan.name){ 
    //     return
    // }
    


    if (payload.datastreams) {
        obj = {
            id: payload.id,
            x: Number(payload.datastreams[0].current_value),
            y: Number(payload.datastreams[1].current_value),
            time: moment(payload.updated_time,'YYYY-MM-DD HH:mm:ss.SSS')  //  Javascript can only store 3 decimal places in a date object
        }
    }

    // let disabled = true;  // This makes it run FAST!!! - slowdown comes from updating state!!!

    // if we have a piece of data
    if (obj) {
        // console.log(lastTimestamps[obj.id] && obj.time.diff(lastTimestamps[obj.id]))
        if(lastTimestamps[obj.id] && obj.time.diff(lastTimestamps[obj.id]) < 0){  // out of order date arrived!
            // console.log('Blocked an out of order/old message!', lastTimestamps[obj.id] && obj.time.diff(lastTimestamps[obj.id]))
            return;
        }
        lastTimestamps[obj.id]  = obj.time;

        if(tagBuffer[obj.id]){ // if it's already in the buffer waiting to be drawn! - Doing this allows it to "sync up"
            forceFlush = true;
        }else{
            tagBuffer[obj.id] = obj; // we'll do this later, after drawing the current batch
        }

        forceFlush = false;  // Use this to make it possibly skip movements

        if ( true || (forceFlush || rightNow > (lastUpdate + batchPeriod)) ) {  // createTimeout/update if needed.
            // busyDrawingFlag = true;
            // console.log('busyDrawing', true);
            lastUpdate = rightNow;

            //update existing tags to not repeat moving
            // for(const [key, tag] of Object.entries(tags)){ 
            //     if(!tagBuffer[key] && (tag.prevX !== tag.x || tag.prevY!==tag.y)){
            //         tags[key] = Object.assign({},tag,{ prevX:tag.x, prevY:tag.y })
            //     }
            // }
            // add or update new ones
            tags = Object.assign(tags,tagBuffer)
            // for(const [key, o] of Object.entries(tagBuffer)){
            //     tags[key] = Object.assign({},tags[key] || { id: key },{  x: Number(o.x), y: Number(o.y), z:Number(0)})
            //     // prevX calculated later when fetched via getTags
            //     //prevX: tags[key]?tags[key].x : Number(o.x), prevY: tags[key] ? tags[key].y : Number(o.y),
            // }
            // console.log(`updating Tag Data! with ${Object.keys(tagBuffer).length} records`)
                
            tagBuffer = {};
            if(forceFlush){
                tagBuffer[obj.id] = obj;
            }

            if(!panning){
                if(rtlsUpdateState==globalUpdate){
                    // console.log('calling pushTagsUpdate',rtlsUpdateState, globalUpdate)
                    // dispatch(tagsSlice.actions.pushTagsUpdate());
                }else{
                    // console.log('blocking update')
                }
            }

            primeUpdateTrigger(500, true);
        }
    }
}

export default tagsSlice.reducer;
