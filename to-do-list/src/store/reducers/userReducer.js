const initialState = {
    user : {
        username : '',
        pin : '',
        token : '',
    }
  }
  const userReducer = (state = initialState, action) => {
    const { type, payload} = action;
    switch(type){
      case "login":
        return {
          ...state,
          user: payload
        }
      case "logout":
        return {...state,initialState}
      default:
        return {
          ...state
        }
    }
  }
  export default userReducer;