import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './login.module.css'; 
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useAlert } from "react-alert";

import Helper from '../constants/helper';
import apiPath from '../constants/apiPath';


import {
  setloggingin,setloggedin, setUsername, setToken
} from '../components/authenticationSlice';



export function Login() {

  const alert = useAlert();
  const [username, setUserField] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();


  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {

    console.log('submitting');
    e.preventDefault(); //setLoader(true);
    dispatch(setloggingin());
    let postJson = {username,password}; let path = apiPath.adminLogin;
    const fr = await Helper.post(postJson, path);
    const response = await fr.response.json();
    // // if(componentIsMounted.current) {
      if (fr.status === 200) {
        if (response.success) {
          alert.success(response.msg);
          dispatch(setloggedin());
          dispatch(setUsername(username));
          dispatch(setToken(response.token));
        } else {
          alert.error(response.msg);
        }
        // setLoader(false);
      } else {
        alert.error(response.error || "Error");
        // setLoader(false);
      }
    // }
  }

  return (
    <div className={styles.loginwrapper}>
      <Form onSubmit={handleSubmit} className={styles.loginform}>
        <FormGroup >
          <Label for="username" >User</Label>
          <Input
            autoFocus
            // type="username"
            name="username" id="username" 
            value={username}
            onChange={e => setUserField(e.target.value)}
          />
        </FormGroup>
        <FormGroup >
          <Label for="password" >Password</Label>
          <Input
            value={password}
            name="password" id="password" 
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}