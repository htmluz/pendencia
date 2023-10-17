import React from 'react';
import './App.css';
import Tabela from './components/tabela';
import Register from './components/register';
import Signin from './components/signin';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Gerencia from './components/gerencia';

function App() {

  return (
    <>
      <Routes>
          <Route index element={<Tabela />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Signin />} />
          <Route path="pendencias" element={<Tabela />} />
          <Route path="gerencia" element={<Gerencia />} />
      </Routes>
    </>
  )
}


export default App
