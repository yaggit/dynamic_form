import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwtDecode from 'jwt-decode';
import { ReactComponent as GoogleIcon } from '../logo.svg'; // Import your Google logo SVG file

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (location.pathname === '/') {
            localStorage.removeItem('accessToken');
        }
    }, [location]);

    const handleRegister = () => {
        navigate('/addUser');
    };

    const handleForgotPassword = () => {
        navigate('/forgotPassword');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/users/login', { email, password });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('accessToken', token);
                console.log('login success');
                navigate('/dashboard');

            } else {
                setErrorMessage('Login failed. Please try again.');
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('error during login:', error);
            setErrorMessage('Error during login.');
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href= "http://localhost:5000/auth/google"
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="login-form p-4 border rounded">
                <h3 className="text-center">Login</h3>
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
                            className='mb-2'
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-2">
                        Login
                    </Button>
                    <Button variant="primary" className="w-100 mt-3" onClick={handleRegister}>
                        SignUp
                    </Button>
                  <Button variant="light" className="w-auto mt-3 mx-auto d-flex align-items-center justify-content-center" onClick={handleGoogleLogin}>
    <GoogleIcon className="mr-2" />Sign in with Google
</Button>

                </Form>
            </div>
        </Container>
    );
};

export default Login;
