import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './reducers/todoReducer'
import userReducer from './reducers/userReducer'
export default configureStore({
  reducer: {
    todoReducer,
    userReducer
  },
})