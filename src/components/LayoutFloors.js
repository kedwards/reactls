import React from 'react';
import styles from './layoutfloors.module.css'; 
import {ListGroup } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import {
    togglefloors
} from './topnavbarSlice';

import {
    selectBuildings, selectPlans, setCurrentBuildingPlan, selectCurrentPlan
} from './buildingsSlice';


export function LayoutFloors() {
    const dispatch = useDispatch();

    const buildings = useSelector(selectBuildings);
    const plans = useSelector(selectPlans);
    const currentPlan = useSelector(selectCurrentPlan);

    const clickPlan = ({buildingId, planId})=>{
        return ()=>{
            dispatch(setCurrentBuildingPlan({buildingId,planId}))
        }
        
    }

    return (
        
        <div id="layoutSidenav_floors" style={{background: "white"}}>
            <button className={styles.tab}
                onClick={ ()=> dispatch(togglefloors())}
            >
                <svg className="bi bi-chevron-double-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
          <nav className="nav flex-column" >
            <span className="navbar-brand mb-0 h1">Buildings</span>
            <br/>

            {/* <h5>Building 1</h5>
            <ListGroup variant="flush">
                <ListGroup.Item active>Yappp</ListGroup.Item>
                <ListGroup.Item>Yappp</ListGroup.Item>
                <ListGroup.Item>Yappp</ListGroup.Item>
                <ListGroup.Item>Yappp</ListGroup.Item>
            </ListGroup>
              
            <h5>Building 1</h5>
            <ListGroup variant="flush">
                <ListGroup.Item>Yappp</ListGroup.Item>
                <ListGroup.Item>Yappp</ListGroup.Item>
                <ListGroup.Item active>Yappp</ListGroup.Item>
                <ListGroup.Item>Yappp</ListGroup.Item>
            </ListGroup> */}


            
            {Object.entries(buildings).map(([bid,b])=>{
                let headerComponent = <h5 href="#">{b.title}</h5>;
                let planComponent = Object.entries(plans).filter(([pid,p])=>(p.buildingId === bid)).map(([pid,p])=>{
                    return <ListGroup.Item key={pid} action active={currentPlan && pid===currentPlan.id} onClick={clickPlan({buildingId:bid, planId: pid})}>{p.name}</ListGroup.Item>
                });
                return <div key={bid}>{headerComponent}<ListGroup variant="flush">{planComponent}</ListGroup></div>                
            })}

            {/* {Object.entries(buildings).map(([bid,b])=>{
                let headerComponent = <span className="navbar-brand mb-0 h1" href="#">{b.title}</span>;
                let planComponent = Object.entries(plans).filter(([pid,p])=>(p.buildingId === bid)).map(([pid,p])=>{
                    return <a key={pid} className="navbar-brand" href="#" onClick={clickPlan({buildingId:bid, planId: pid})}>{p.name}</a>
                });
                return <div key={bid} className="nav flex-column">{headerComponent}{planComponent}<br/></div>                
            })} */}
          </nav>
        </div>

    );
}