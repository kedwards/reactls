import { createSlice, createAction } from '@reduxjs/toolkit';

const websocketMessage = createAction('REDUX_WEBSOCKET::MESSAGE')

const batchPeriod = 500;
const overRideMovementperiod = 500 || null; // otherwise it uses the batchPeriod
let tagBuffer = {};
let lastUpdate = Date.now();

let tags = {};

// TODO-  add dispatch every batchPeriod, in order to display any last dangling positions in the buffer if the feed cuts off. LAST POSITION IS IMPORTANT!

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: {
        tags: {},
        updatePeriod: batchPeriod,
        update:0
    },
    reducers: {
        // togglemenu: state => {
        //   state.menuOpen = !state.menuOpen
        // }
    },
    extraReducers: {
        [websocketMessage]: (state, action) => {
            
            let rightNow = Date.now();
            let forceFlush = false;   //used to guarentee steps aren't missed


            let payload = JSON.parse(action.payload.message);
            let obj = null;
            if (payload.datastreams) {
                obj = {
                    id: payload.id,
                    x: Number(payload.datastreams[0].current_value),
                    y: Number(payload.datastreams[1].current_value)
                }

            }

            let disabled = true;  // This makes it run FAST!!! - slowdown comes from updating state!!!

            // if we have a piece of data
            if (obj) {
                if(tagBuffer[obj.id]){ // if it's already in the buffer waiting to be drawn! - Doing this allows it to "sync up"
                    forceFlush = true;
                }else{
                    tagBuffer[obj.id] = obj; // we'll do this later, after drawing the current batch
                }

                forceFlush = false;  // Use this to make it possibly skip movements

                if (forceFlush || rightNow > (lastUpdate + batchPeriod) ) {  // createTimeout/update if needed.
                    lastUpdate = rightNow;
                    let updateObject = {};

                    if(!disabled){
                        for(const [key, tag] of Object.entries(state.tags)){
                            if(!tagBuffer[key] && (tag.prevX !== tag.x || tag.prevY!==tag.y)){
                                updateObject[key] = Object.assign({},tag,{ prevX:tag.x, prevY:tag.y })
                            }
                        }
                    }else{
                        for(const [key, tag] of Object.entries(tags)){
                            if(!tagBuffer[key] && (tag.prevX !== tag.x || tag.prevY!==tag.y)){
                                // updateObject[key] = Object.assign({},tag,{ prevX:tag.x, prevY:tag.y })
                                tags[key] = Object.assign({},tag,{ prevX:tag.x, prevY:tag.y })
                            }
                        }
                    }

                    for(const [key, o] of Object.entries(tagBuffer)){
                        if(!disabled){
                            updateObject[key] = Object.assign({},state.tags[key] || { id: key },{ prevX: state.tags[key]?state.tags[key].x : Number(o.x), prevY: state.tags[key] ? state.tags[key].y : Number(o.y), x: Number(o.x), y: Number(o.y), z:Number(0)})
                        }else{
                            tags[key] = Object.assign({},tags[key] || { id: key },{ prevX: tags[key]?tags[key].x : Number(o.x), prevY: tags[key] ? tags[key].y : Number(o.y), x: Number(o.x), y: Number(o.y), z:Number(0)})
                        }
                    }

                    // console.log(`updating Tag Data! with ${Object.keys(tagBuffer).length} records`)
                        
                    tagBuffer = {};
                    if(forceFlush){
                        tagBuffer[obj.id] = obj;
                    }
                    if(Object.keys(updateObject).length !== 0){
                        state.tags = Object.assign({},state.tags,updateObject);
                    }else{
                        state.update++;
                    }
                }
            }
        }
    }
});

// export const {  } = tagsSlice.actions;

export const selectTags = state => state.tags.tags;
export const selectUpdatePeriod = state => overRideMovementperiod ? overRideMovementperiod : state.tags.updatePeriod;
export const getTags = () => tags;
export const getTagsTrigger = state => state.tags.update;

export default tagsSlice.reducer;
