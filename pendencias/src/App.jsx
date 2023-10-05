import { useState, useEffect } from 'react'
import { AiOutlinePlus } from "react-icons/ai";
import './App.css';
import Tabela from './components/tabela';

function App() {
  return (
    <>
      <nav className='flex flex-row justify-between max-h-10 px-2 py-2 text-sm text-[#ffffffde] bg-gradient-to-b from-[#212121]'>
         <h1 className='font-Inter font-bold cursor-default'>Pendências Monitoramento</h1>
         <a className='flex font-Inter font-bold cursor-default hover:bg-[#1b1b1b] transition px-1 rounded hover:text-[#eeeeeede]'>
            <AiOutlinePlus className='mr-1 mt-1 cursor-pointer'/> Nova Pendência 
          </a>
      </nav>
      <div className='text-[#ffffffde] flex w-full p-2' >
        <Tabela />
      </div>
      <footer className='py-1 w-full fixed bottom-0 text-[#ffffffde] bg-black flex' >
        <a href=''>Em Andamento</a>
        <a href=''>Concluídos</a>
        <a href=''>Todos</a>
        <a href=''>1</a>
        <a href=''>2</a>
        <a href=''>-</a>
      </footer>
    </>
  )
}

export default App
