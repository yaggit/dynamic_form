import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../src/components/Login';
import AddUser from './components/AddUser';
import Dashboard from './components/Dashboard';
import CreateForm from './components/CreateForm';
import ForgotPassword from './components/ForgotPassword';
import FormSubmissionPage from './components/UserFormSubmit';
import AllResponses from './components/AllUserResponse';
import EditFormPage from './components/EditForm';
import Chat from './components/Chat';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/createForm' element={<CreateForm/>}/>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path='/userFormSubmit/:formId' element={<FormSubmissionPage/>}/>
      <Route path="/allResponses/:formId" element={<AllResponses/>}/>
      <Route path="/editForm/:formId" element={<EditFormPage/>}/>
      <Route path="/chat" element={<Chat/>}/>
    </Routes>
  );
}

export default App;  