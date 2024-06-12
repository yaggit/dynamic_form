import React, { useState, useEffect } from 'react';
import { Container, Button, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLinkModal from './LinkModal';

const EditFormPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [publicLink, setPublicLink] = useState('');
    const formId = useParams();
    const navigate = useNavigate()

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCancel = () => {
        navigate('/dashboard')
    }
    
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

    useEffect(() => {
        const storedTitle = localStorage.getItem('title');
        const storedDescription = localStorage.getItem('description');
        const storedQuestions = JSON.parse(localStorage.getItem('questions'));

        if (storedTitle && storedDescription && storedQuestions) {
            setTitle(storedTitle);
            setDescription(storedDescription);
            setQuestions(storedQuestions);
        }
    }, []);

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

            const response = await axios.post(`http://localhost:5000/createForm/`, {
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
                console.log('Form Updated.');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('title');
                localStorage.removeItem('description');
                localStorage.removeItem('questions');
                navigate('/dashboard');
            } else {
                console.log(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating form:', error.message || JSON.stringify(error));
        }
    };


    return (
        <Container>
            <h1 className='mt-5 mb-5'><b>Edit Form</b></h1>
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
                                            className="ml-2 mt-2"
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

                        <Button variant="danger" onClick={() => handleDeleteQuestion(index)} className="mt-2">Delete Question</Button>
                    </FormGroup>
                ))}

                <Button className="mt-2" variant="primary" onClick={handleAddQuestion}>Add Question</Button>
                <Button className="mt-2 mx-2" variant="warning" type="submit">Edit</Button>
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

export default EditFormPage;