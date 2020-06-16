const reducer = (state = {}, action) => {
    switch (action.type) {
      case 'REDUX_WEBSOCKET::MESSAGE':
        // Assuming that your data is a DOMString in JSON format
        // console.log(action.payload.message);
        const data = JSON.parse(action.payload.message);
        return { ...state, ...data}
      default:

        // console.log(action.type);
        return state
    }
  }
  export default reducer;