export const addTodo = data => {
    return({
      type: "add",
      payload: data
    })
  }
  export const delTodo = data => {
    return({
      type: "del",
      payload: data
    })
  }

  export const initTodo = data => {
    return({
      type : "init",
      payload : data
    })
  }

  export const editTodo = data => {
    return({
      type : "edit",
      payload : data
    })
  }