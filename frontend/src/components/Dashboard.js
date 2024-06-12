import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './component.css'
import PublicLinkModal from './LinkModal';
import io from 'socket.io-client';
import { googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


const ENDPOINT = 'http://localhost:5000';


const Dashboard = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [publicLink, setPublicLink] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [responseCounts, setResponseCounts] = useState({});
    const [name, setName] = useState('')


    const handleDelete = async (formId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/deleteForm/${formId}`);

            if(response ==200) {
                navigate('/dashboard')
            }else{
                console.log('error deleting')
            }
      
        } catch (error) {
            console.error('Error deleting form:', error);
        }
    }


    useEffect(() => {
        const socket = io(ENDPOINT);
    const fetchForms = async () => {
        try {
            
            const token = localStorage.getItem('accessToken')
            const decode = jwtDecode(token)
            setName(decode.name)

            if (!token) {
                console.log('No token found.');
                navigate("/");
                return;
            }

            localStorage.setItem('accessToken', token);

            const headers = {
                'Authorization': token
            };

            const response = await axios.get('http://localhost:5000/allForms', { headers });
            setForms(response.data || []);

            const formIds = response.data.map(form => form.id);

            socket.on('submitForm', (count) => {
                console.log(count);
                setResponseCounts((prevCounts) => ({
                  ...prevCounts,
                  [count.formId]: count.responseCount,
                  
                }));
                console.log(count)
              });

        } catch (error) {
            console.error('Error fetching forms:', error);
            setForms([]);
        }
    };

    fetchForms();

    return () => {
        socket.disconnect();
    };

}, []);

    

    const handlePublicLink = async (formId) => {

        const link = `http://localhost:3000/userFormSubmit/${formId}`;
        setPublicLink(link);
        setShowModal(true);
    }
    const handleEdit = (formId) => {
        navigate(`/editForm/${formId}`);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = () => {
        localStorage.clear()
        navigate('/');
        googleLogout();
    };

    const createNewForm = () => {
        navigate('/createForm');
    };

    const handleFormView = async (formId) => {
        navigate(`/allResponses/${formId}`);
    };

    const handleChat = async () => {
        navigate('/chat');
    }

    return (
        <div className='container'>
             <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary mt-5 mb-3">
                <div className="container-fluid">
                    <div className="product-navbar" id="navbarSupportedContent">
                        <h2>{name}'s Forms</h2>
                    </div>
                    <div className="d-flex right-menu">
                        <button className="btn btn-secondary logout-button " type="button" onClick={handleChat}>Chat</button>
                        <button className="btn btn-warning logout-button " type="button" onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </nav>
            <div>
                <button type="button" className="btn btn-primary mt-3 mb-3" onClick={createNewForm}>Create New Form</button>

            </div>
            <div className="d-flex flex-wrap justify-content-start">
                {forms.map(form => (
                    <Card key={form.id} style={{ width: '28rem', marginBottom: '20px', marginRight: '20px' }}>
                        <Card.Body>
                            <Card.Title>{form.title}</Card.Title>
                            <Card.Text>{form.description}</Card.Text>
                            <Button className='mx-2' variant="primary" onClick={() => handleFormView(form.id)}>Responses</Button>
                            <Button className='mx-2' variant="info" onClick={() => handlePublicLink(form.id)}>Public Link</Button>
                            <Button className='mx-2' variant="warning" onClick={() => handleEdit(form.id)}>Edit</Button>
                            <Button className='mx-2' variant="danger" onClick={() => handleDelete(form.id)}>Delete</Button>
                            <PublicLinkModal
                                show={showModal}
                                handleClose={handleCloseModal}
                                publicLink={publicLink}
                            />
                            {/* <Card.Text>Responses: {responseCounts[form.id]}</Card.Text> */}
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
