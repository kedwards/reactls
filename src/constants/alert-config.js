import { transitions, positions } from 'react-alert';

let timeout = 5000;

let Config = {
  
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: timeout,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
};
export default Config;
