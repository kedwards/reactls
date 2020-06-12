import React from 'react';  
import styles from './layoutcounts.module.css'; 

import { useDispatch } from 'react-redux';
import {
    togglecounts
} from './topnavbarSlice';

export function LayoutCounts() {
    const dispatch = useDispatch();

    return (
        
        <div id="layoutSidenav_counts" style={{background: "orange"}}>
            <button className={styles.tab}
                onClick={ ()=> dispatch(togglecounts())}
            >
                <svg className="bi bi-chevron-double-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
          <nav className="sidenav shadow-left sidenav-light" ></nav>
        </div>

    );
}