import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, FormGroup, FormControl, FormLabel, Alert } from 'react-bootstrap';
import axios from 'axios';
import PublicLinkModal from './LinkModal';

const CreateFormPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [publicLink, setPublicLink] = useState('');
    const [message, setMessage]= useState('')

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('title')
        localStorage.removeItem('description')
        localStorage.removeItem('questions')
        navigate('/'); 
    };

    const handleCancel = () => {
        navigate('/dashboard')
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { type: 'text', value: '', options: [] }]);
        localStorage.setItem('questions', JSON.stringify([...questions, { type: 'text', value: '', options: [] }]));
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        localStorage.setItem('title', title)
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        localStorage.setItem('description', description)
    };

    const handleQuestionChange = (event, index) => {
        const newQuestions = [...questions];
        newQuestions[index].value = event.target.value;
        setQuestions(newQuestions);
        localStorage.setItem('question', questions)
    };

    const handleTypeChange = (event, index) => {
        const newQuestions = [...questions];
        newQuestions[index].type = event.target.value;
        setQuestions(newQuestions);
    };

    const handleAddRadio = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].radios = newQuestions[index].options || [];
        newQuestions[index].options.push('');
        setQuestions(newQuestions);
    };

    const handleAddCheckbox = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].checkboxes = newQuestions[index].options || [];
        newQuestions[index].options.push('');
        setQuestions(newQuestions);
    };

    const handleRemoveRadio = (questionIndex, radioIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].radios.splice(radioIndex, 1);
        setQuestions(newQuestions);
    };

    const handleRemoveCheckbox = (questionIndex, checkboxIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].checkboxes.splice(checkboxIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('No token found. User is not authenticated.');
                navigate("/")
            }

            const headers = {
                'Authorization': localStorage.getItem('accessToken')
            }

            if(!title) {
                setMessage('Title is reuiqred!')
            }
            else{
                const response = await axios.post('http://localhost:5000/createForm', {
                    title,
                    description,
                    questions
                },
                    {
                        headers: {
                            'Authorization': localStorage.getItem('accessToken')
                        }
                    });
    
                if (response.status === 200) {
                    console.log('Form Created.');
                    navigate('/dashboard')
                } else {
                    console.log(`Unexpected status code: ${response.status}`);
                }
            }
           
        } catch (error) {
            console.error('Error creating form:', error.message || JSON.stringify(error));
        }
    };

    return (
        <Container>
             <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary mt-5 mb-3">
                <div className="container-fluid">
                    <div className="product-navbar" id="navbarSupportedContent">
                        <h2>Create Form</h2>
                    </div>
                    <div className="d-flex right-menu">
                        <button className="btn btn-warning logout-button " type="button" onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </nav>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel><h4><b>Title</b></h4></FormLabel>
                    <FormControl type="text" value={title} onChange={handleTitleChange} placeholder="Form Title" />
                    <FormControl className='mt-3' type="text" value={description} onChange={handleDescriptionChange} placeholder="Description" />
                </FormGroup>

                {questions.map((question, index) => (
                    <FormGroup key={index}>
                        <FormLabel><h5 className='mt-3'>Question {index + 1}</h5></FormLabel>
                        <FormControl type="text" value={question.value} onChange={(event) => handleQuestionChange(event, index)} placeholder="Enter question" />
                        <Form.Control as="select" value={question.type} onChange={(event) => handleTypeChange(event, index)} className="mt-2">
                            <option value="text">Text</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                        </Form.Control>

                        {question.type === 'radio' && (
                            <div>
                                {question.radios && question.radios.map((radio, radioIndex) => (
                                    <div key={radioIndex} className="mt-2">
                                        <FormControl
                                            type="text"
                                            value={radio}
                                            onChange={(event) => {
                                                const newQuestions = [...questions];
                                                newQuestions[index].radios[radioIndex] = event.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            placeholder={`Radio ${radioIndex + 1}`}
                                        />
                                        <Button
                                            variant="danger"
                                            onClick={() => handleRemoveRadio(index, radioIndex)}
                                            className="ml-2"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="primary"
                                    onClick={() => handleAddRadio(index)}
                                    className="mt-2"
                                >
                                    Add Radio
                                </Button>
                            </div>
                        )}

                        {question.type === 'checkbox' && (
                            <div>
                                {question.checkboxes && question.checkboxes.map((checkbox, checkboxIndex) => (
                                    <div key={checkboxIndex} className="mt-2">
                                        <FormControl
                                            type="text"
                                            value={checkbox}
                                            onChange={(event) => {
                                                const newQuestions = [...questions];
                                                newQuestions[index].checkboxes[checkboxIndex] = event.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            placeholder={`Checkbox ${checkboxIndex + 1}`}
                                        />
                                        <Button
                                            variant="danger"
                                            onClick={() => handleRemoveCheckbox(index, checkboxIndex)}
                                            className="ml-2"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="primary"
                                    onClick={() => handleAddCheckbox(index)}
                                    className="mt-2"
                                >
                                    Add Checkbox
                                </Button>
                            </div>
                        )}

                        <Button variant="danger" onClick={() => handleDeleteQuestion(index)} className="mt-2">Delete</Button>
                    </FormGroup>
                ))}

                <Button className="mt-2 mx-2" variant="primary" onClick={handleAddQuestion}>Add Question</Button>
                <Button variant="success" type="submit" className="mt-2 ml-2">Submit</Button>
                <Button className="mt-2 mx-2" variant="secondary" onClick={handleCancel}>Cancel</Button>
                <PublicLinkModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    publicLink={publicLink}
                />
            </Form>
        </Container>
    );
};

export default CreateFormPage;