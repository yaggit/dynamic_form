import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, FormControl, Button, Alert } from 'react-bootstrap';

const AllResponses = () => {
  const [responses, setResponses] = useState([]);
  const [email, setEmail] = useState('');

  const formId = useParams();
  const navigate = useNavigate();

  const handleShowDashboard = () => {
    navigate('/dashboard');
  }

  const handleSendResponse = async () => {
    try {
      const htmlContent = document.documentElement.outerHTML;
      const htmlCode = await axios.post('http://localhost:5000/sendPdf', {
        email,
        formId
      });

      if (htmlCode.status === 200) {
        console.log('Form Created.');
      } else {
        console.log(`Unexpected status code: ${htmlCode.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchResponse();
  }, []);

  const fetchResponse = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.log('No token found. User is not authenticated.');
      navigate('/');
    }

    try {
      axios.get(`http://localhost:5000/allResponsesById/${formId.formId}`)
        .then(res => {
          setResponses(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.error('Error in fetching form responses!');
    }
  }

  return (
    <div className='container mt-5'>
      <h6 className='display-6'>Responses for your form number : <b>{formId.formId}</b></h6>
      <table className='table table-hover mt-4'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Question Number</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index}>
              <td>{response.id}</td>
              <td>{response.user_email}</td>
              <td>{response.question_id}</td>
              <td>{response.response_data}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <FormControl type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <Button className="mt-2 mx-2" variant="primary" onClick={handleShowDashboard}>Back To Dashboard</Button>
      <Button className="mt-2 mx-2" variant="primary" onClick={handleSendResponse}>Get PDF</Button>
    </div>
  );
};

export default AllResponses;
