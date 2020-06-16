import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';


import {
    selectTags
} from './tagsSlice';

 
const {Raphael,Paper,Set,Circle,Ellipse,Image,Rect,Text,Path,Line} = require('react-raphael');
 

// Testing React's behaviour
// var node = document.createElement("LI");                 // Create a <li> node
// var textnode = document.createTextNode("Water");         // Create a text node
// node.appendChild(textnode);
// setTimeout(function(){ document.getElementById('addhere').appendChild(node)},2000)

export function RTLS() {
    const dispatch = useDispatch();
    const tags = useSelector(selectTags);
    
    let data = [
        {x:50,y:50,r:40,attr:{"stroke":"#0b8ac9","stroke-width":5}},
        {x:100,y:100,r:40,attr:{"stroke":"#f0c620","stroke-width":5}},
        {x:150,y:50,r:40,attr:{"stroke":"#1a1a1a","stroke-width":5}},
        {x:200,y:100,r:40,attr:{"stroke":"#10a54a","stroke-width":5}},
        {x:250,y:50,r:40,attr:{"stroke":"#e11032","stroke-width":5}}
    ]

    console.log(`redrawing canvas: ${Date.now()}`)

    return (<>
                {/* <div>{menuOpen?'true':'false'}</div> */}
                <div>{JSON.stringify(tags)}</div>
                {/* { (new Date()).getMinutes() % 2 == 0 ? <div id="addhere"></div> : null } */}
                
                <Paper width={600} height={400}>
                    <Set>    
                    {
                        Object.entries(tags).map(([key,ele])=>{
                            return (<Circle key={ele.id} x={ele.prevX*10} y={ele.prevY*10} r={10} animate={Raphael.animation({cx:ele.x*10, cy:ele.y*10},100,'<>')} attr={{"stroke":"#e11032","stroke-width":5}}/>)
                        })
                    }
                    </Set>

                    {/* <Set>
                        <Rect x={30} y={148} width={240} height={150} attr={{"fill":"#10a54a","stroke":"#f0c620","stroke-width":5}}/>
                        <Ellipse x={150} y={198} ry={40} rx={100} attr={{"fill":"#fff","stroke":"#e11032"}} />
                        <Image src="static/images/5circle.png" x={100} y={170} width={90} height={60} />
                        <Text x={150} y={258} text="同一个世界 同一个梦想" attr={{"fill":"#fff"}}/>
                        <Text x={150} y={273} text="One World One Dream" attr={{"fill":"#fff"}}/>
                        <Path d={["M150 287L150 287"]} animate={Raphael.animation({"path": ["M80 287L220 287"]},500,"<>")} attr={{"stroke":"#fff"}}/>
                        <Line x1={150} y1={290} x2={150} y2={290} animate={Raphael.animation({ x1:80, x2:220},500,"<>")} attr={{"stroke":"#fff"}}/>
                    </Set> */}
                </Paper>
            </>)
    
}
