import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';

function App() {
  return(
    <Routes>
      <Route path='/' element={<Layout />}>
        
      </Route>
    </Routes>
  )
}

export default App;
