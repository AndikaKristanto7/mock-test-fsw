import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import BeApp from '../helpers/api_call/BeApp'
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie'
import {useSelector, useDispatch} from "react-redux";
import { loginUser } from "../store/actions/userAction"
function App() {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm()
    const [checkUsernameResp, setCheckUsernameResp] = useState({
        isSubmitted : false,
        error : false,
        msg : '',
    })
    const [submitResp, setSubmitResp] = useState({
        isSubmitted : false,
        error : false,
        msg : ''
    })
    const [cookies, setCookie,removeCookie] = useCookies(['user'])
    const navigate = useNavigate({})
    const dispatch = useDispatch();

    const showAlert = (data) => {
        if(data.isSubmitted){
            return (
                <Row className='mt-3'>
                    <Col md="12">
                        <Alert variant={data.error ? `danger` : 'success'} className='mx-3'>
                            {data.msg}
                        </Alert>
                    </Col>
                </Row>
            )
        }
    }
    const usernameCheck = async() => {
        let username = getValues('username')
        if(username === ""){
            setError('username',{ type: 'custom', message: 'This field is required!' })
            return;
        }else{
            setError('username',false)
        }
        var respObj = {}

        respObj = {
            isSubmitted : true,
            error : false,
            msg : ''
        }
        setCheckUsernameResp(
            respObj
        )
    }

    const handleBack = () => {
        let obj = {
            isSubmitted : false,
            error : false,
            msg : '',
        }
        setCheckUsernameResp(obj)
        setSubmitResp(obj)
        setValue('username','')
        setValue('pin','')

    }
    const onSubmit = async (data) => {
        let submitRespObj = {isSubmitted : true}
        BeApp.userLogin(data)
        .then((resp)=>{
            submitRespObj.error = resp.data.error
            submitRespObj.msg = resp.data.msg
            setSubmitResp(submitRespObj)
            let expires = new Date()
            expires.setTime(expires.getTime() + (30 * 1000 * 60))
            setCookie('user',resp.data.data, {path : '/',expires})
            setTimeout(()=>{
                navigate('/to-do-list')
                dispatch(loginUser({
                    username : resp.data.data.username,
                    token : resp.data.data.token
                }))
            },1500)

        })
        .catch((resp)=>{
            submitRespObj.error = resp.response.data.error
            submitRespObj.msg = resp.response.data.msg
            setSubmitResp(submitRespObj)
        })
      }
    
    return(
        <Container>
            <Row className='d-flex justify-content-center'>
                <Col md="4">
                    <Form className='mt-5' style={{border:'1px solid #3467eb'}} onSubmit={handleSubmit(onSubmit)}>
                        <div className='text-center' style={{backgroundColor:'#3467eb',color:'white'}}>
                            <span>Login Form</span>
                        </div>
                        {!checkUsernameResp.isSubmitted && (
                           <>
                                <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicEmail">
                                    <Form.Label>Username / Email address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username / email"  {...register("username", { required: 'This field required!' })} />
                                    <ErrorMessage errors={errors} name="username" as="p" style={{color:'red'}}/>
                                </Form.Group>
                           </>
                           
                        )}
                        {checkUsernameResp.isSubmitted && !checkUsernameResp.error &&  (
                            <>
                            {showAlert(submitResp)}
                            <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicPin" >
                                <Form.Label>PIN</Form.Label>
                                <Form.Control type="password" placeholder="PIN" maxLength="6" {...register("pin", 
                                    { 
                                        required: "This field required!",
                                        pattern : {
                                            value : /^[0-9]{6,6}$/g,
                                            message: "Must be 6 digits of numbers!"
                                        },
                                        maxLength : 6  
                                    }
                                )}/>
                                <ErrorMessage errors={errors} name="pin" as="p" style={{color:'red'}}/>
                            </Form.Group>
                            </>
                        )}
                        <Row className='mt-4 mb-2 mx-2'>
                            <Col md={{span: 4}}>
                                <Link to={'/register'}>Register</Link>
                            </Col>
                            {!checkUsernameResp.isSubmitted && (
                                <Col md={{span:2, offset:5}}>
                                    <Button variant="primary" type="button" onClick={(e) => usernameCheck(e)}>
                                        Next
                                    </Button>
                                </Col>
                            )}
                            {checkUsernameResp.isSubmitted && !checkUsernameResp.error && (
                                <>  
                                    <Col md={{span:1,offset:3}}>
                                        <Button variant="primary" type="button" onClick={(e) => handleBack(e)}>
                                            Back
                                        </Button>
                                    </Col>
                                    <Col md={{span:1,offset:1}}>
                                        <Button variant="primary" type="submit">
                                            Login
                                        </Button>
                                    </Col>
                                </>
                            )}
                            
                        </Row>   
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default App;
