import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import styles from './rtls.module.css';
import Helper from '../constants/helper';
import appConfig from '../constants/config';
import pinPerson from '../assets/img/pin_person.svg';


import {
    selectTags, selectUpdatePeriod, getTags, getTagsTrigger, setPanning//, setDrawingFalse, setDrawingTrue
} from './tagsSlice';

import {
    selectBuildings, selectCurrentBuilding, selectCurrentPlan, selectTagsInSocket, selectPlanUrl, selectFeeds
} from './buildingsSlice';
import { isBuffer } from 'lodash';



// pre-scale svgs
// const calcSvg = (entry,x,y)=>{
for (let [key, entry] of Object.entries(appConfig)) {
    if (entry.w && entry.path_x && entry.path) {
        entry.path = entry.path.toString().replace(/\d*\.?\d*/g, (s, a, b, c, d) => {
            return s && parseFloat(s) * entry.w / entry.path_x
        })
    }
}

// }
console.log(JSON.stringify(appConfig));


const { Raphael, Paper, Set, Circle, Ellipse, Image, Rect, Text, Path, Line } = require('react-raphael');


// Testing React's behaviour
// var node = document.createElement("LI");                 // Create a <li> node
// var textnode = document.createTextNode("Water");         // Create a text node
// node.appendChild(textnode);
// setTimeout(function(){ document.getElementById('addhere').appendChild(node)},2000)

let resizingLatch = false;// use to build : const isResizing,  latch timeout used to stop flickering of the variable
let resizingTimoutHandle = null

let planLatch = null;
let widthLatch = 0;
let heightLatch = 0;

let mousePosition = { x: 0, y: 0, domoffsetx: 0, domoffsety: 0, mousedown: false };
let oldData = null;

export function RTLS({ width, height }) {
    const dispatch = useDispatch();
    const updateTrigger = useSelector(getTagsTrigger); /// Just this line alone, triggers the components to update
    const buildings = useSelector(selectBuildings);
    const currentBuilding = useSelector(selectCurrentBuilding);
    const currentPlan = useSelector(selectCurrentPlan);
    const tagsInSocket = useSelector(selectTagsInSocket);
    const feeds = useSelector(selectFeeds);

    const tags = mousePosition.mousedown ? oldData : getTags({ currentPlan, currentBuilding, feeds });
    oldData = tags;
    const animationPeriod = useSelector(selectUpdatePeriod);
    const domRef = useRef();
    const pathRef = useRef();
    const screenWidth = width;
    const screenHeight = height;
    const zoomWindowSize = appConfig.ZOOM_WINDOW_SIZE;
    const zoomPanLimit = appConfig.ZOOM_PAN_LIMIT;
    const zoomOutLimit = appConfig.ZOOM_OUT_LIMIT;
    const zoomInLimit = appConfig.ZOOM_IN_LIMIT;


    // stores viewbox variable information.
    const viewBoxInit = {
        zoom: appConfig.ZOOM_INIT,
        offsetX: 0,
        offsetY: 0,
        width: null,
        height: null,
        string: false
    }
    const [viewbox, setViewbox] = useState({ ...viewBoxInit });

    const scrollHandler = (event) => {

        const wheelUnitSize = 30;
        let zoomChange = Math.pow(event.deltaY > 0 ? 0.9 : 1.1, Math.abs(event.deltaY) / wheelUnitSize);
        let newZoom = zoomChange * viewbox.zoom
        if (newZoom < zoomOutLimit) { // limit zoom out!
            newZoom = zoomOutLimit;
            zoomChange = newZoom / viewbox.zoom;
        }
        // newWidth  
        else if ((viewbox.width || floorPlan.width) / (pixelsPerMeter * zoomChange) < zoomInLimit) { // limit zoom out!
            // newZoom = zoomOutLimit;
            // zoomChange = newZoom / viewbox.zoom;
            zoomChange = (viewbox.width || floorPlan.width) / (pixelsPerMeter * zoomInLimit);
            newZoom = zoomChange * viewbox.zoom;
        }


        let percentMouseX = mousePosition.x / screenWidth;
        let percentMouseY = mousePosition.y / screenHeight;
        // console.log('mousePercent',percentMouseX,percentMouseY)
        // debugger;

        let prevWidth = (viewbox.width || floorPlan.width)
        let newWidth = prevWidth / zoomChange;
        let prevHeight = (viewbox.height) || floorPlan.height;
        let newHeight = prevHeight / zoomChange;

        let addedOffsetX = 0;
        let addedOffsetY = 0;
        if (zoomChange > 1) { // zooming in
            addedOffsetX = (prevWidth - newWidth) * percentMouseX;
            addedOffsetY = (prevHeight - newHeight) * percentMouseY;
        } else {
            addedOffsetX = -(newWidth - prevWidth) * percentMouseX;
            addedOffsetY = -(newHeight - prevHeight) * percentMouseY;
        }
        let tempNewOffsetX = viewbox.offsetX + addedOffsetX;
        let tempNewOffsetY = viewbox.offsetY + addedOffsetY;

        let { newOffsetX, newOffsetY } = offsetNormalizer(tempNewOffsetX, tempNewOffsetY, newWidth, newHeight);

        let string = `${newOffsetX} ${newOffsetY} ${newWidth} ${newHeight}`;

        let newObj = { ...viewbox, zoom: newZoom, string, width: newWidth, height: newHeight, offsetX: newOffsetX, offsetY: newOffsetY }
        setViewbox(newObj)
    }

    const mouseDownHandler = (event) => {
        setPanning(true);
        mousePosition = { ...mousePosition, mousedown: true }
    }

    const mouseUpHandler = (event) => { // this handler is also used for the mouseLeave event
        setPanning(false);
        mousePosition = { ...mousePosition, mousedown: false }
    }



    // Checks new offset values, and newHeight, and returns adjusted offsets to force centering when zoomed outside of pan limit.
    const offsetNormalizer = (newOffsetX, newOffsetY, newWidth, newHeight) => {
        let pastX = 0;
        let pastY = 0;

        if (-newOffsetX > zoomPanLimit * pixelsPerMeter) {
            if (newOffsetX < viewbox.offsetX) {
                newOffsetX = viewbox.offsetX;
            }
            pastX++;
        }
        if (-newOffsetY > zoomPanLimit * pixelsPerMeter) {
            if (newOffsetY < viewbox.offsetY) {
                newOffsetY = viewbox.offsetY;
            }
            pastY++;
        }
        if (newOffsetX + (newWidth || viewbox.width || floorPlan.width) - zoomPanLimit * pixelsPerMeter > floorPlan.width) {
            if (newOffsetX > viewbox.offsetX) {
                newOffsetX = viewbox.offsetX;
            }
            pastX++;
        }
        if (newOffsetY + (newHeight || viewbox.height || floorPlan.height) - zoomPanLimit * pixelsPerMeter > floorPlan.height) {
            if (newOffsetY > viewbox.offsetY) {
                newOffsetY = viewbox.offsetY;
            }
            pastY++;
        }
        if (-newOffsetX > zoomPanLimit * pixelsPerMeter) {  // have to repeat these, because it may shift twice if done in the other order and we could miss it
            pastX++;
        }
        if (-newOffsetY > zoomPanLimit * pixelsPerMeter) {  // have to repeat these, because it may shift twice if done in the other order and we could miss it
            pastY++;
        }
        if ((newWidth || viewbox.width || floorPlan.width) - floorPlan.width > 2 * zoomPanLimit * pixelsPerMeter) { // zoom out causes lopsidedness past pan limit
            pastX++;
        }
        if ((newHeight || viewbox.height || floorPlan.height) - floorPlan.height > 2 * zoomPanLimit * pixelsPerMeter) { // zoom out causes lopsidedness past pan limit
            pastY++;
        }
        if (pastX > 1) { // moved it twice - so its zoomed out past the PAN limit, center it!
            newOffsetX = (floorPlan.width - (newWidth || viewbox.width || floorPlan.width)) / 2;
        }
        if (pastY > 1) { // moved it twice - so its zoomed out past the PAN limit, center it!
            newOffsetY = (floorPlan.height - (newHeight || viewbox.height || floorPlan.height)) / 2;
        }
        return { newOffsetX, newOffsetY }
    }


    const moveHandler = (event) => {
        let prevWidth = (viewbox.width || floorPlan.width);
        let prevHeight = (viewbox.height) || floorPlan.height;

        let newX = event.clientX - mousePosition.domoffsetx;
        let newY = event.clientY - mousePosition.domoffsety;
        if (mousePosition.mousedown) {

            let diffX = (newX - mousePosition.x) / viewbox.zoom;
            let diffY = (newY - mousePosition.y) / viewbox.zoom;

            let tempNewOffsetX = viewbox.offsetX - diffX;
            let tempNewOffsetY = viewbox.offsetY - diffY;

            let { newOffsetX, newOffsetY } = offsetNormalizer(tempNewOffsetX, tempNewOffsetY);

            let string = `${newOffsetX} ${newOffsetY} ${prevWidth} ${prevHeight}`;


            let newObj = { ...viewbox, string, offsetX: newOffsetX, offsetY: newOffsetY }
            setViewbox(newObj)
        }
        mousePosition = { ...mousePosition, x: newX, y: newY };
    }
    // console.log('screenSizes',screenWidth,screenHeight);



    // TODO- move this to buildingSlice somehow? but it needs this components height
    // calculates the pixels/meter of the screen! - changes when screen size changes!
    const floorPlan = currentPlan ? ((currentPlan.height_pixels / currentPlan.width_pixels > screenHeight / screenWidth) ? { //floorplan too tall
        width: screenHeight * currentPlan.width_pixels / currentPlan.height_pixels,
        height: screenHeight
    } : {  // if we have Y overflow
            width: screenWidth,
            height: screenWidth * currentPlan.height_pixels / currentPlan.width_pixels
        }) : { width: screenWidth, height: screenHeight }


    const isReSizing = false || (widthLatch != floorPlan.width) || (heightLatch != screenHeight);  // flickery variable!!! - happens once per render

    if(isReSizing){
        resizingLatch = true
        if(resizingTimoutHandle){
            clearTimeout(resizingTimoutHandle);
            resizingTimoutHandle = null;
        }
        resizingTimoutHandle = setTimeout(()=>{
            resizingLatch = false
        },50)
    }
    const isReSizingDebounced = resizingLatch

    if (isReSizing && widthLatch != 0) {
        let newWidth = (viewbox.width || floorPlan.width) * floorPlan.width / widthLatch
        let newHeight = currentPlan ? newWidth * currentPlan.height_pixels / currentPlan.width_pixels : screenHeight
        let newOffsetX = (viewbox.offsetX || 0) * newWidth / viewbox.width;
        let newOffsetY = (viewbox.offsetY || 0) * newHeight / viewbox.height;
        let string = `${newOffsetX} ${newOffsetY} ${newWidth} ${newHeight}`;
        let newObj = { ...viewbox, string, offsetX: newOffsetX, offsetY: newOffsetY, width: newWidth, height: newHeight }
        setViewbox(newObj)
    }
    widthLatch = floorPlan.width;
    heightLatch = screenHeight;


    useEffect(() => {
        console.log('ref Actually Updating')
        let boundingRect = document.getElementsByTagName("main")[0].getBoundingClientRect()
        mousePosition.domoffsetx = boundingRect.x;
        mousePosition.domoffsety = boundingRect.y;
    }, [isReSizing])

    if (!currentPlan || screenHeight === undefined || screenWidth === undefined) {
        return (<div ref={domRef} className={styles.layout}>No Current Plan</div>)
    }


    // if switching plans!!  -  
    //  probably will move the viewbox to a redux state. So that it can be modified from external components!
    // still better doing it here though, than at every possible trigger
    // this block resets the viewbox to the initial zoom!
    if (planLatch != currentPlan) {
        let calcWidth = floorPlan.width / viewBoxInit.zoom;
        let calcHeight = floorPlan.height / viewBoxInit.zoom;
        let calcOffsetX = (floorPlan.width - calcWidth) / 2;
        let calcOffsetY = (floorPlan.height - calcHeight) / 2;

        let string = `${calcOffsetX} ${calcOffsetY} ${calcWidth} ${calcHeight}`
        setViewbox({ ...viewBoxInit, string, width: calcWidth, height: calcHeight, offsetX: calcOffsetX, offsetY: calcOffsetY })
        planLatch = currentPlan;
    }


    // want to convert meters to pixels, so, figure out the conversion rate
    const pixelsPerMeter = floorPlan.width / currentPlan.width_meters;

    // want to go from floorplan image width to screen pixels

    const scaledFromOriginal = floorPlan.width / currentPlan.width_pixels  // originX/originY is specified in pixels relative to the orignal image size!

    const labelOffsetY = 10;

    return (<div id="rtls-div" className={styles.layout} onWheel={scrollHandler} onMouseMove={moveHandler} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler} onMouseLeave={mouseUpHandler}>
        <div className={styles.mapwrapper}>
            {/* {JSON.stringify(tags)} */}
            <Paper key={0} ref={domRef} width={screenWidth} height={screenHeight} viewbox={viewbox.string ? viewbox.string : undefined}>
                <Set>
                    <Image src={currentPlan.image} x={0} y={0} width={floorPlan.width} height={floorPlan.height} />
                    {/* {
                        // disabling resizing during pagesize transition seems to introduce jumping, not worth it
                        // isReSizing ? 
                        // Object.entries(tags).map(([key, ele]) => {
                        //     return (<Circle key={ele.id} x={(currentPlan.originX*scaledFromOriginal) + (ele.prevX * pixelsPerMeter)} y={(currentPlan.originY*scaledFromOriginal) + (ele.prevY * pixelsPerMeter)} r={10}  attr={{ "stroke": "#e11032", "stroke-width": 5 }} />)
                        // }) :
                        Object.entries(tags).map(([key, ele]) => {

                            return (
                                <Circle key={ele.id} x={(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter)} y={(currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter)} r={10} animate={Raphael.animation({ cx: (currentPlan.originX * scaledFromOriginal) + (ele.x * pixelsPerMeter), cy: (currentPlan.originY * scaledFromOriginal) + (ele.y * pixelsPerMeter) }, animationPeriod, '<>')} attr={{ "stroke": "#e11032", "stroke-width": 5 }} />
                                )
                        })
                    } */}
                    {/* {
                        Object.entries(tags).map(([key, ele]) => {
                            return (
                                <Image key={ele.id+2000000} src={pinPerson} x={(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter)-appConfig.PIN_PERSON.x_padd} y={(currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter)-appConfig.PIN_PERSON.y_padd} width={appConfig.PIN_PERSON.w} height={appConfig.PIN_PERSON.h} 
                                    animate={Raphael.animation({ x: (currentPlan.originX * scaledFromOriginal) + (ele.x * pixelsPerMeter) - appConfig.PIN_PERSON.x_padd, y: (currentPlan.originY * scaledFromOriginal) + (ele.y * pixelsPerMeter) - appConfig.PIN_PERSON.y_padd }, animationPeriod, '<>')}/>
                            )
                        })
                    }  */}
                    {
                        
                        Object.entries(tags).map(([key, ele]) => {
                            if(isReSizingDebounced){
                                return;
                            }
                            return  !mousePosition.mousedown ? (
                                <Path key={ele.id + 300000} ref={pathRef} d={(appConfig.PIN_PERSON.path)}
                                    attr={{
                                        "stroke": "#e11032",
                                        "fill": "#000"
                                    }}
                                    animate={
                                        Raphael.animation({
                                            0: { transform: `t${(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter) - appConfig.PIN_PERSON.x_padd},${(currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter) - appConfig.PIN_PERSON.y_padd}` },//s${appConfig.PIN_PERSON.w/appConfig.PIN_PERSON.path_x},${appConfig.PIN_PERSON.h/appConfig.PIN_PERSON.path_y},0,0` },
                                            100: { transform: `t${(currentPlan.originX * scaledFromOriginal) + (ele.x * pixelsPerMeter) - appConfig.PIN_PERSON.x_padd},${(currentPlan.originY * scaledFromOriginal) + (ele.y * pixelsPerMeter) - appConfig.PIN_PERSON.y_padd}` }//s${appConfig.PIN_PERSON.w/appConfig.PIN_PERSON.path_x},${appConfig.PIN_PERSON.h/appConfig.PIN_PERSON.path_y},0,0` }

                                        }, animationPeriod, '<>')
                                    }
                                />
                            ) : (
                                <Path key={ele.id + 300000} ref={pathRef} d={(appConfig.PIN_PERSON.path)}
                                    attr={{
                                        "stroke": "#e11032",
                                        "fill": "#000"
                                    }}
                                    animate={
                                        Raphael.animation({
                                           transform: `t${(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter) - appConfig.PIN_PERSON.x_padd},${(currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter) - appConfig.PIN_PERSON.y_padd}` },//s${appConfig.PIN_PERSON.w/appConfig.PIN_PERSON.path_x},${appConfig.PIN_PERSON.h/appConfig.PIN_PERSON.path_y},0,0` },
                                            )
                                    }
                                />
                            )

                        })
                    }
                    {/* {
                        Object.entries(tags).map(([key, ele]) => {
                            return (
                                <Text key={ele.id+1000000} 
                                x={(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter)} y={labelOffsetY + (currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter)} 
                                animate={
                                    // Raphael.animation({
                                    //     0:{ transform: `t${(currentPlan.originX * scaledFromOriginal) + (ele.prevX * pixelsPerMeter)},${labelOffsetY + (currentPlan.originY * scaledFromOriginal) + (ele.prevY * pixelsPerMeter)}` },
                                    //     100:{ transform: `t${(currentPlan.originX * scaledFromOriginal) + (ele.x * pixelsPerMeter)},${labelOffsetY + (currentPlan.originY * scaledFromOriginal) + (ele.y * pixelsPerMeter)}` }
                                    
                                    // }, animationPeriod, '<>')       
                                    Raphael.animation({ x: (currentPlan.originX * scaledFromOriginal) + (ele.x * pixelsPerMeter), y: labelOffsetY + (currentPlan.originY * scaledFromOriginal) + (ele.y * pixelsPerMeter) }, animationPeriod, '<>')
                                }
                                text={(feeds[ele.id] && (feeds[ele.id].alias || feeds[ele.id].title)) || 'TESTING' } attr={{"fill":"#000"}}/>

                                //"filter":"url(#solid)", 
                            )
                        })
                    } */}
                </Set>

            </Paper>
            {zoomWindowSize &&
                <div key={1} className={styles.zoomindicator}>
                    <div className={styles.zoomouter} style={{
                        width: zoomWindowSize,
                        height: zoomWindowSize * floorPlan.height / floorPlan.width,
                        backgroundImage: `url(${currentPlan.image})`,
                        backgroundSize: `cover`
                    }}>
                        <div className={styles.zoominner} style={{
                            width: zoomWindowSize / viewbox.zoom,
                            height: zoomWindowSize * floorPlan.height / floorPlan.width / viewbox.zoom,
                            left: zoomWindowSize * viewbox.offsetX / (viewbox.width || floorPlan.width) / viewbox.zoom,
                            top: zoomWindowSize * viewbox.offsetY * floorPlan.height / floorPlan.width / (viewbox.height || floorPlan.height) / viewbox.zoom
                        }}>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>)

}

/* <Set>
        <Rect x={30} y={148} width={240} height={150} attr={{"fill":"#10a54a","stroke":"#f0c620","stroke-width":5}}/>
        <Ellipse x={150} y={198} ry={40} rx={100} attr={{"fill":"#fff","stroke":"#e11032"}} />
        <Image src="static/images/5circle.png" x={100} y={170} width={90} height={60} />
        <Text x={150} y={258} text="同一个世界 同一个梦想" attr={{"fill":"#fff"}}/>
        <Text x={150} y={273} text="One World One Dream" attr={{"fill":"#fff"}}/>
        <Path d={["M150 287L150 287"]} animate={Raphael.animation({"path": ["M80 287L220 287"]},500,"<>")} attr={{"stroke":"#fff"}}/>
        <Line x1={150} y1={290} x2={150} y2={290} animate={Raphael.animation({ x1:80, x2:220},500,"<>")} attr={{"stroke":"#fff"}}/>
    </Set> */