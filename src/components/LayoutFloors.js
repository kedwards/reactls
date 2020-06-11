import React from 'react';
// import { Button } from 'reactstrap';
// import logo from '../assets/img/honeywell-logo.png';
import styles from './layoutfloors.module.css'; 

import { useSelector, useDispatch } from 'react-redux';
import {
    //   decrement,
    //   increment,
    //   incrementByAmount,
    //   incrementAsync,
    selectFloorOpen, togglefloors
} from './topnavbarSlice';
// import styles from './Counter.module.css';

export function LayoutFloors() {
    let floorOpen = useSelector(selectFloorOpen);
    console.log(floorOpen);
    const dispatch = useDispatch();
    //   const [incrementAmount, setIncrementAmount] = useState('2');

    // useEffect(() => {    
    //     document.body.classList.toggle('sidenav-toggled',!menuOpen);
    //     document.body.classList.toggle('floors-toggled',floorOpen);
    //     document.body.classList.toggle('counts-toggled',countsOpen);
    //     document.body.classList.toggle('info-toggled',infoOpen);
    //     // document.body.classList = `menuOpen: ${menuOpen}`;  
    // });


    return (
        
        <div id="layoutSidenav_floors" style={{background: "green"}}>
            <button className={styles.tab}
                onClick={ ()=> dispatch(togglefloors())}
            >
                <svg class="bi bi-chevron-double-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
          <nav className="sidenav shadow-left sidenav-light" ></nav>
        </div>

    );
}