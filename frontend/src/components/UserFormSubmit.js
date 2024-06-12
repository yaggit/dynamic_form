import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import io, { Socket } from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';

const FormSubmissionPage = () => {
    const [formData, setFormData] = useState([]);
    const [formResponses, setFormResponses] = useState({});
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [socket, setSocket] = useState(null);

    const { formId } = useParams();

    useEffect(() => {

        const fetchFormData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/form/${formId}`);
                
                setFormData(response.data.map(question => ({
                    ...question,
                    options: question.options ? JSON.parse(question.options) : []
                })));
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

      
        fetchFormData();

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
    }, [formId]);


    const handleInputChange = (e, questionIndex) => {
        const { name, value, type, checked } = e.target;
        let newValue;
    
        if (type === 'checkbox') {
            newValue = checked ? value : undefined;
        } else {
            newValue = value;
        }
    
        setFormResponses({
            ...formResponses,
            [questionIndex]: {
                ...formResponses[questionIndex],
                [name]: newValue
            }
        });
    
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage('email is required')
        }
        else {
            try {
                await axios.post('http://localhost:5000/submitForm', { email, formId, ...formResponses });

                socket.emit('submitForm', formId)
                setErrorMessage('Form submitted!')

                //await axios.post(`http://localhost:5000/sendMail`, { email, formId, ...formResponses })
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };
    }

    return (
        <Container>
            <h1 className="mt-5 mb-3">Submit Form</h1>
            {errorMessage && <Alert variant="info">{errorMessage}</Alert>}


            <Form onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {formData.map((question, index) => (
                    <Form.Group key={index}>
                        <Form.Label>{question.value}</Form.Label>
                        {question.type === 'text' && (
                            <Form.Control
                                type="text"
                                name={index}
                                onChange={(e) => handleInputChange(e, index)}
                                value={formResponses[index] ? formResponses[index][index] || '' : ''}
                            />
                        )}

                        {question.type === 'checkbox' && (
                            question.options.map((option, optionIndex) => (
                                <Form.Check
                                    key={optionIndex}
                                    type="checkbox"
                                    label={option}
                                    name={optionIndex} //name of the checbox is index in which it is mapping
                                    value={option}
                                    onChange={(e) => handleInputChange(e, index)}
                                    checked={formResponses[index] && formResponses[index][optionIndex]}
                                />
                            ))
                        )}

                        {question.type === 'radio' && (
                            question.options.map((option, optionIndex) => (
                                <Form.Check
                                    key={optionIndex}
                                    type="radio"
                                    label={option}
                                    name={index}
                                    value={option}
                                    onChange={(e) => handleInputChange(e, index)}
                                    checked={formResponses[index] && formResponses[index][index] === option}
                                />
                            ))
                        )}
                    </Form.Group>
                ))}
                <Button variant="primary" type="submit" className='mt-2'>
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default FormSubmissionPage;
