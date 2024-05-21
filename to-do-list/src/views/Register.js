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

      const navigate = useNavigate({})
    
      const onSubmit = async (data) => {
        if(data.pin !== data.confirmPin){
            setError('confirmPin', { type: 'custom', message: 'Confirmation PIN is not match!' });
            return false;
        }
        let submitRespObj = {submitted : true}
        BeApp.userRegister(data)
        .then((resp)=>{
            submitRespObj.error = resp.data.error
            submitRespObj.msg = resp.data.msg
            setSubmitResp(submitRespObj)

            setTimeout(()=>{
                navigate('/')
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
                            <span>Register Form</span>
                        </div>
                        <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicEmail">
                            <Form.Label>Username / Email address</Form.Label>
                            <Form.Control type="text" placeholder="Enter username / email" {...register("username", { required: 'This field required!' })}/>
                            <ErrorMessage errors={errors} name="username" as="p" style={{color:'red'}}/>
                        </Form.Group>
                        <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicPin">
                            <Form.Label>PIN</Form.Label>
                            <Form.Control type="password" placeholder="PIN must be 6 digits of numbers" {...register("pin", 
                                { 
                                    required: "This field required!", 
                                    pattern : {
                                        value : /^[0-9]{6,6}$/g,
                                        message: "Must be 6 digits of numbers!"
                                    } 
                                }
                            )} />
                            <ErrorMessage errors={errors} name="pin" as="p" style={{color:'red'}}/>
                        </Form.Group>
                        <Form.Group className="mx-4 mb-3 mt-3" controlId="formBasicConfirmationPin">
                            <Form.Label>Confirmation PIN</Form.Label>
                            <Form.Control type="password" placeholder="PIN must be 6 digits of numbers" {...register("confirmPin", 
                                { 
                                    required: "This field required!", 
                                    pattern : {
                                        value : /^[0-9]{6,6}$/g,
                                        message: "Must be 6 digits of numbers!"
                                    } 
                                }
                            )} />
                            <ErrorMessage errors={errors} name="confirmPin" as="p" style={{color:'red'}}/>
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
                                <Link to={'/'}>Login</Link>
                            </Col>
                            <Col md={{span:3,offset:5}}>
                                <Button variant="primary" type="submit">
                                    Register
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
