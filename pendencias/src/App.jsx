import React from 'react';
import './App.css';
import Tabela from './components/tabela';
import Signin from './components/signin';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Gerencia from './components/gerencia';
import Layout from './components/layout';
import Dashboard from './components/dashboard';
import DashboardManu from './components/dashboardmanu';

function App() {

  return (
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Signin />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboardmanu" element={<DashboardManu />} />

            <Route element={<RequireAuth />}>
              <Route path="pendencias" element={<Tabela />} />
              <Route path="gerencia" element={<Gerencia />} />
            </Route>
          </Route>
      </Routes>
  )
}


export default App
