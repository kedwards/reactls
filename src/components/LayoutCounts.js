import React from 'react';  
import styles from './layoutcounts.module.css'; 

import { useDispatch, useSelector } from 'react-redux';
import {
    togglecounts
} from './topnavbarSlice';

import {
    getTagsTrigger
} from './tagsSlice';

import {
    selectFocusedFeeds
} from './filtersSlice';



export function LayoutCounts() {
    const dispatch = useDispatch();
    const focusedFeeds = useSelector(selectFocusedFeeds);
    const updateTrigger = useSelector(getTagsTrigger);

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
          <nav className="sidenav shadow-left sidenav-light" >
              {updateTrigger}
            {JSON.stringify(focusedFeeds)}
              
          </nav>
        </div>

    );
}