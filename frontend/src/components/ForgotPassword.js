import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        if(location.pathname === '/'){
            localStorage.removeItem('accessToken')
        }
    })

    const handleRegister = () => {
        navigate('/addUser');
    };

    const handleLogin = () => {
        navigate('/')
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Please enter both email!');
            return;
        }
         
        try {
            const response = await axios.post('http://localhost:5000/users/forgotPassword', { email, password });

            if (response.status === 200) {
                navigate('/');

            } else {
                setErrorMessage('Email not found! Sign up!.');
                console.error('Email not found! Sign up!.', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred during password reset:', error);
            setErrorMessage('An error occurred during password reset. Please try again later.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="login-form p-4 border rounded">
                <h3 className="text-center">Forgot Password</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit} className="mt-3">
                    <Form.Group controlId="formUsername">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>


                    <Button variant="primary" type="submit" className="w-100 mt-2">
                        Change Detailes
                    </Button>
                    <Button variant="secondary" className="w-100 mt-3" onClick={handleRegister}>
                        SignUp
                    </Button>
                    <Button variant="secondary" className="w-100 mt-3" onClick={handleLogin}>
                        Login
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ForgotPassword;