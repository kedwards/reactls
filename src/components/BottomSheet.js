import React from 'react';
import styles from './bottomsheet.module.css'; 

import { useSelector, useDispatch } from 'react-redux';
import {
    //selectInfoOpen,
     toggleinfo
} from './topnavbarSlice';

export function BottomSheet() {
    const dispatch = useDispatch();

    return (
        
        <div id="layoutSidenav_info" style={{background:"purple"}}>
            <button className={styles.tab}
                onClick={ ()=> dispatch(toggleinfo())}
            >
                <svg className="bi bi-chevron-double-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
                    <path fillRule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                </svg>
            </button>
          Bottom sheet Tag INFO - Editor
        </div>
    );
}