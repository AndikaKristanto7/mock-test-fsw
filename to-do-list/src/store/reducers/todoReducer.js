const initialState = {
    todos: [
      {
        id: 1,
        todo: "title one",
        createdAt : '',
        updatedAt : ''
      },
      {
        id: 2,
        todo: "title two",
        createdAt : '',
        updatedAt : ''
      },
    ]
  }
  const todoReducer = (state = initialState, action) => {
    const { type, payload} = action;
    switch(type){
      case "init":
        return {
          ...state,
          todos : payload
        }
      case "add":
        return {
          ...state,
          todos: [...state.todos,payload]
        }

      case "edit":
        const todos = [...state.todos]
        const updatedTodo = [...todos]
        const getTodoIndex = updatedTodo.findIndex(obj => obj.id === payload.id)
        updatedTodo[getTodoIndex] = payload  
        return {
          ...state,
          todos : updatedTodo
        }
      
      case "del":

        return{
          ...state,
          todos: state.todos.filter(todo => todo.id !== payload.id)
        }
      default:
        return {
          ...state
        }
    }
  }
  export default todoReducer;