import React, { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import { addTodo, delTodo,initTodo,editTodo } from "../store/actions/todoAction"
import { useCookies } from "react-cookie";
import { loginUser,logoutUser } from "../store/actions/userAction"
import Container from 'react-bootstrap/Container'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form"
import InputGroup from "react-bootstrap/InputGroup"; 
import FormControl from "react-bootstrap/FormControl"; 
import ListGroup from "react-bootstrap/ListGroup"; 
import Button from "react-bootstrap/Button"; 
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { ErrorMessage } from "@hookform/error-message";
import BeApp from '../helpers/api_call/BeApp'
import moment from 'moment';
const TodoApp= () => {
  const [cookies, setCookie,removeCookie] = useCookies(['user'])
  const todos = useSelector(state => state.todoReducer.todos);
  const user = useSelector(state => state.userReducer.user)
  const dispatch = useDispatch();
  const navigate = useNavigate({})
  
  useEffect(()=>{
    if(cookies.user && Object.keys(cookies.user).length !== 0){
      setInterval(()=>{
        let cookiesObj = {username:cookies.user.username,pin:cookies.user.pin}
        BeApp.refreshToken(cookiesObj)
        .then((resp)=>{
            cookies.user.token = resp.data.token
            let expires = new Date()
            expires.setTime(expires.getTime() + (30 * 1000 * 60))
            setCookie('user',
            {...cookiesObj,token : resp.data.token}, 
            {path : '/',expires})
            
            dispatch(loginUser(cookies.user))
        }).catch((e)=>{
            console.log(e)
        })
      },25 * 1000 * 60)
    }
  },[])


  useEffect(() => {
    if(cookies.user){
      BeApp.getTodoByUsername({username:cookies.user.username})
      .then((resp) => {
        dispatch(loginUser(cookies.user))
        console.log(user)
        dispatch(initTodo(resp.data.data))
      })
    } 
  },[cookies])

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
    setValue
  } = useForm()

  const addNewTodo = (todo) => {
    
    const data = {
      todo,
      createdAt : moment().format(),
      updatedAt : null
    }
    BeApp.insertTodo(data)
    .then((resp) => {
      dispatch(
        addTodo({id : resp.data.data.id,...data}))
    })
  }
  
  const onSubmit = async (data) => {
    addNewTodo(data.addItem)
    setValue('addItem','')
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    removeCookie('user',{path:'/'});
    navigate('/')
  }

  const handleEdit = (index) => {
    const editedTodo = prompt('Edit the todo:'); 
    if (editedTodo !== null && editedTodo.trim() !== '') { 
      let data = {
        id : index,
        todo : editedTodo,
        updatedAt : moment().format()
      }
      BeApp.editTodo(data)
      .then((resp) => {
        dispatch(editTodo(data))
      })
    } 
  }

  const handleDelete = (index) => {
    let data = {
      id : index,
    }
    BeApp.deleteTodo(data)
    .then((resp) => {
      dispatch(delTodo(data))
    })
  }
  return(
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
          <Row style={
            { 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                fontSize: "3rem", 
                fontWeight: "bolder", 
            }
          } 
          >
            TODO LIST 
          </Row>
          <Row>
            <Col md={{ span: 5, offset: 4 }}> 
              <InputGroup className="mb-3"> 
                  <FormControl 
                      placeholder="add item . . . "
                      size="lg"
                      aria-label="add something"
                      aria-describedby="basic-addon2"
                      {...register("addItem", { required: 'Add item field required!' })}
                  /> 
                  <InputGroup>
                    <Button 
                        variant="dark"
                        className="mt-2"
                        type="submit"
                    > 
                        Add 
                    </Button> 
                  </InputGroup> 
              </InputGroup>
              <ErrorMessage errors={errors} name="addItem" as="p" style={{color:'red'}}/>  
            </Col>
          </Row>
        </Form>
        <Row>
          <Col md={{ span: 5, offset: 4 }}> 
            <ListGroup> 
              {/* map over and print items */} 
              {todos.map((item, index) => { 
                  return ( 
                    <div key = {item.id} >  
                      <ListGroup.Item 
                          variant="dark"
                          action 
                          style={
                            {
                              display:"flex", 
                              justifyContent:'space-between'
                            }
                          } 
                      > 
                        <span style={{wordWrap:'break'}}>{item.todo}</span>
                        <span> 
                          <Button style={{marginRight:"10px"}} 
                          variant = "light"
                          onClick={ (e)=> handleDelete(item.id)}
                          > 
                            Delete 
                          </Button> 
                          <Button variant = "light"
                            onClick={(e) => handleEdit(item.id)}
                          > 
                            Edit 
                          </Button> 
                        </span> 
                      </ListGroup.Item> 
                      <Row  
                          style={
                            {
                              display:"flex", 
                              justifyContent:'space-between'
                            }
                          } >
                        <Row>
                            <Col>
                              <span style={{wordWrap:'break'}}>
                                {item.updatedAt ? 'Updated At' : 'Created At'} {moment(item.updatedAt ?? item.createdAt).format("MMMM Do YYYY HH:mm")}
                              </span>
                            </Col>
                          </Row>
                      </Row>
                    </div> 
                  ); 
                })} 
            </ListGroup> 
          </Col> 
        </Row>
        <Row className="mt-2">
          <Col md={{ span: 5, offset: 8 }}>
          <InputGroup>
              <Button 
                  variant="warning"
                  className="mt-2"
                  type="button"
                  onClick={(e) => handleLogout()}
              > 
                  Logout 
              </Button> 
            </InputGroup>
          </Col>
        </Row>
    </Container>
  )
}
export default TodoApp;