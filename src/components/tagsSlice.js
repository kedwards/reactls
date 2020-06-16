import { createSlice, createAction } from '@reduxjs/toolkit';

const websocketMessage = createAction('REDUX_WEBSOCKET::MESSAGE')


const batchPeriod = 300;
let tagBuffer = [];
let lastUpdate = Date.now();



// TODO-  add dispatch every batchPeriod, in order to display any last dangling positions in the buffer if the feed cuts off. LAST POSITION IS IMPORTANT!

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: {
        tags: {}
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


            // if we have a piece of data
            if (obj) {
                if(tagBuffer[obj.id]){ // if it's already in the buffer waiting to be drawn! - Doing this allows it to "sync up"
                    forceFlush = true;
                }else{
                    tagBuffer[obj.id] = obj; // we'll do this later, after drawing the current batch
                }

                // forceFlush = false;  // Use this to make it possibly skip movements

                if (forceFlush || rightNow > (lastUpdate + batchPeriod) ) {  // createTimeout/update if needed.
                    lastUpdate = rightNow;
                    let updateObject = {};

                    Object.entries(state.tags).forEach(([key,tag])=>{
                        if(!tagBuffer[key] && (tag.prevX != tag.x || tag.prevY!=tag.y)){
                            tag.prevX = tag.x;
                            tag.prevY = tag.y;
                        }
                    })

                    Object.entries(tagBuffer).forEach(([key,o]) => {
                        
                        state.tags[o.id] = state.tags[o.id] || {
                            id: o.id
                        }
                        state.tags[o.id].prevX = state.tags[o.id].x || Number(o.x);
                        state.tags[o.id].prevY = state.tags[o.id].y || Number(o.y);
                        state.tags[o.id].x = Number(o.x);
                        state.tags[o.id].y = Number(o.y);
                        state.tags[o.id].z = Number(0);
                    })

                    // console.log(`updating Tag Data! with ${Object.keys(tagBuffer).length} records`)
                        
                    tagBuffer = {};
                    if(forceFlush){
                        tagBuffer[obj.id] = obj;
                    }

                }

            }
        }
    }
});

// export const {  } = tagsSlice.actions;

export const selectTags = state => state.tags.tags;

export default tagsSlice.reducer;
