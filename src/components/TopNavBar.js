import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import logo from '../assets/img/honeywell-logo.png';
import styles from './topnavbar.module.css'; 

import { useSelector, useDispatch } from 'react-redux';
import {  selectLoggedIn,selectUsername, setLoggedOut} from './authenticationSlice';
import {
    selectInfoOpen,
    selectFloorOpen, selectCountsOpen,
    selectMenuOpen, togglemenu
} from './topnavbarSlice';

export function TopNavBar() {
    const isAuthenticated = useSelector(selectLoggedIn);
    const username = useSelector(selectUsername);

    let menuOpen = useSelector(selectMenuOpen);
    let floorOpen = useSelector(selectFloorOpen);
    let countsOpen = useSelector(selectCountsOpen);
    let infoOpen = useSelector(selectInfoOpen);
    const dispatch = useDispatch();

    // Change Body Classes!
    useEffect(() => {    
        document.body.classList.toggle('sidenav-toggled',!menuOpen);
        document.body.classList.toggle('floors-toggled',floorOpen);
        document.body.classList.toggle('counts-toggled',countsOpen);
        document.body.classList.toggle('info-toggled',infoOpen);
    });


    return (
        <nav className="topnav navbar navbar-expand-lg navbar-light bg-light justify-content-between">


            <div className="row">
                <div className={styles.vendorlogodiv} >
                    <img src={logo} className={styles.vendorlogo} alt="logo" />
                </div>
                <Button
                    outline
                    color="primary"
                    aria-label="Toggle Menu"
                    onClick={() => dispatch(togglemenu())}
                >
                    <svg className="bi bi-list" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </Button>
            </div>

            <div className="row">

                {isAuthenticated &&(
                <>
                    <div>{username}</div>
                    <Button
                        outline
                        color="primary"
                        aria-label="Logout User"
                        onClick={() => dispatch(setLoggedOut())}
                    >
                        Logout
                    </Button>
                </>
                )}
                



                {/* { infoOpen?'true':'false'}
                <Button
                    outline
                    color="primary"
                    aria-label="Toggle Counts"
                    onClick={() => dispatch(toggleinfo())}
                >
                    I
                </Button>

                {countsOpen?'true':'false'}
                <Button
                    outline
                    color="primary"
                    aria-label="Toggle Counts"
                    onClick={() => dispatch(togglecounts())}
                >
                    C
                </Button>

                {floorOpen?'true':'false'}
                <Button
                    outline
                    color="primary"
                    aria-label="Toggle Floorplans"
                    onClick={() => dispatch(togglefloors())}
                >
                    F
                </Button> */}

            </div>
        </nav>
    );
}