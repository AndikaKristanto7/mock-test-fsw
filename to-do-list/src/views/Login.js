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
function App() {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm()
    const [submitResp, setSubmitResp] = useState({
        submitted : false,
        error : false,
        msg : ''
    })

    const [cookies, setCookie,removeCookie] = useCookies(['user'])

    const navigate = useNavigate({})

    const onSubmit = async (data) => {
        let submitRespObj = {submitted : true}
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
                        <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicEmail">
                            <Form.Label>Username / Email address</Form.Label>
                            <Form.Control type="text" placeholder="Enter username / email"  {...register("username", { required: 'This field required!' })} />
                            <ErrorMessage errors={errors} name="username" as="p" style={{color:'red'}}/>
                        </Form.Group>
                        <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicPin">
                            <Form.Label>PIN</Form.Label>
                            <Form.Control type="password" placeholder="PIN" {...register("pin", 
                                { 
                                    required: "This field required!",  
                                }
                            )}/>
                            <ErrorMessage errors={errors} name="pin" as="p" style={{color:'red'}}/>
                        </Form.Group>
                        <Row>
                            <Col md="12">
                                {submitResp.submitted && (
                                    <Alert variant={submitResp.error ? `danger` : 'success'} className='mx-3'>
                                        {submitResp.msg}
                                    </Alert>
                                )}
                            </Col>
                        </Row>
                        <Row className='mx-3 mt-4 mb-2'>
                            <Col md={{ span: 4}}>
                                <Link to={'/register'}>Register</Link>
                            </Col>
                            <Col md={{span:3,offset:5}}>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </Row>   
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default App;
