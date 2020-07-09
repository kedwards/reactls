import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import styles from './bottomsheet.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { Table, Form } from 'react-bootstrap';
import {
    selectInfoOpen,
    toggleinfo
} from './topnavbarSlice';

import { selectFeeds } from './buildingsSlice';
import { setFocusedTags } from './tagsSlice';
import { setFocusedFeeds } from './filtersSlice';


export function BottomSheet({ width, height }) {
    const dispatch = useDispatch();
    const resizeHandler = useRef();
    const gridApiRef = useRef();
    const feeds = useSelector(selectFeeds);
    const infoOpen = useSelector(selectInfoOpen);
    const columnDefs = [
        { headerName: "id", field: "id" },
        {
            headerName: "Alias",
            field: "alias",
            valueGetter: (params) => {
                return params.data.alias || params.data.title
            },
            filter: 'agTextColumnFilter' 
        },
        { headerName: "Type", field: "type" }
    ];

    const defaultColDef = {
        // resizable: true
        flex: 1
    }

    const onSelectionChanged = (e) => {
        // setFocusedTags(e.api.getSelectedRows().reduce((m,r)=>{
        //     m[r.id] = r;
        //     return m;
        //   },{}))


        dispatch(setFocusedFeeds(e.api.getSelectedRows().reduce((m,r)=>{
            m[r.id] = true;
            return m;
        },{})));
    }

    const onSearchChanged = (e)=>{
        gridApiRef.current.setQuickFilter(e.target.value);
    }


    useEffect(() => {
        // window.onresize
        if (resizeHandler.current) {
            // setTimeout(()=>{
            resizeHandler.current();
            // })
        }

    }, [width, height, infoOpen])

    // console.log(JSON.stringify(Object.values(feeds)));

    return (

        <div id="layoutSidenav_info" className={styles.wrapper} >
            <button className={styles.tab}
                onClick={() => dispatch(toggleinfo())}
            >
                <svg className="bi bi-chevron-double-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z" />
                    <path fillRule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                </svg>
            </button>
            <div className={styles.form}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Search" onChange={onSearchChanged}/>
                        <Form.Text className="text-muted" >
                            Search for Individuals, Assets and Transports.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </div>
            <div className={`ag-theme-alpine ${styles.locatetable}`}>
                <AgGridReact
                    animateRows
                    onGridReady={params => {
                        gridApiRef.current = params.api;
                        // this.gridApi = params.api;
                        // this.columnApi = params.columnApi;
                        params.api.sizeColumnsToFit();
                        resizeHandler.current = () => {
                            params.api.sizeColumnsToFit();
                        }
                    }}
                    rowSelection={"single"}
                    onSelectionChanged={onSelectionChanged}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    rowData={Object.values(feeds)}>
                </AgGridReact>
            </div>

            {/* <Table className={styles.locatetable} striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    </tr>
                </thead>
                <tbody className={styles.locatetbody} >
                    {
                        Object.entries(feeds).map(([key, ele]) => {
                            return (
                            <tr>
                                <td>{ele.id}</td>
                                <td>{ele.alias}</td>
                                <td>{ele.title}</td>
                                <td>{ele.type}</td>
                            </tr>
                            )

                        })
                    }
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </Table> */}
        </div>
    );
}