export const loginUser = data => {
    return({
      type: "login",
      payload: data
    })
  }
  export const logoutUser = data => {
    return({
      type: "logout",
      payload: data
    })
  }