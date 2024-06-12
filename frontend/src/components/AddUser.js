import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const AddUser = () => {

  const [errorMessage, setErrorMessage] = useState()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile_pic: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/')
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();


    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('All fields are required!');
      return;
    }


    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      console.log("Passwords don't match");
      return;
    }
    else {
        
      try {

        const response = await axios.post('http://localhost:5000/users/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status >= 200) {
          console.log('Registered successfully.');
          navigate('/');
        } else {
          console.log(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error registering user:', error.message || JSON.stringify(error));
      }
    }

  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      profile_pic: event.target.files[0],
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Sign Up</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleFormSubmit}>

            <div className="mb-3 mt-5">
             
              <input type="text" required className="form-control" placeholder='Name' id="name" name="name" value={formData.name} onChange={handleInputChange} />

            </div>

            <div className="mb-3">
          
              <input type="email" required className="form-control" placeholder='Email' id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="mb-3">
            
              <input type="password" required className="form-control" placeholder='Password' id="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>

            <div className="mb-3">
         
              <input type="password" required className="form-control" placeholder='Confirm Password' id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>


            <div className='mb-3'>

              <label>Profile Picture</label>
              <input type="file" className="form-control" id="profile_pic" name="profile_pic" onChange={handleFileChange} />
            </div>

            <div className='button'>

              <button
                className="btn btn-primary btn-sm mx-1 Login"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="btn btn-primary btn-sm mx-1 Register"
                type="button"
                onClick={handleFormSubmit}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;