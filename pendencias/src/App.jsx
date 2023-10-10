import { useState, useEffect } from 'react'
import React from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import './App.css';
import Tabela from './components/tabela';
import ModalNovaPendencia from './components/modalnovapendencia';

function App() {
  const [modalNova, setModalNova] = useState(false);

  const clickNovaPendencia = () => {
    setModalNova(current => !current);
  }

  
  return (
    <>
      <nav className=' select-none flex flex-row justify-between max-h-10 px-2 py-2 text-sm text-[#ffffffde] bg-gradient-to-b from-[#212121]'>
         <h1 className='font-Inter font-bold cursor-default'>Pendências Monitoramento</h1>
         <a onClick={clickNovaPendencia} className='flex font-Inter font-bold cursor-default hover:bg-[#1b1b1b] transition px-1 rounded hover:text-[#eeeeeede]'>
            <AiOutlinePlus className='mr-1 mt-1 cursor-pointer'/> Nova Pendência 
          </a>
      </nav>
      <div className='text-[#ffffffde] flex w-full p-2' >
        <Tabela />
      </div>
      <div>
       { modalNova ? <ModalNovaPendencia fecharModal={clickNovaPendencia} /> : null}
      </div>
      <footer className='py-1 border-[#292929] w-full fixed bottom-0 text-[#ffffffde] flex ' >
        <a className='px-1 transition rounded align-left hover:bg-[#1b1b1b] hover:text-[#eeeeeede]' href=''>Em Andamento</a>
        <a className='px-1 transition rounded align-left hover:bg-[#1b1b1b] hover:text-[#eeeeeede]' href=''>Concluídos</a>
        <a className='px-1 transition rounded align-left hover:bg-[#1b1b1b] hover:text-[#eeeeeede]' href=''>Todos</a>
        <a className='px-1 transition rounded hover:bg-[#1b1b1b] hover:text-[#eeeeeede] fixed right-1' href=''>1</a>
        <a className='px-1 transition rounded hover:bg-[#1b1b1b] hover:text-[#eeeeeede] fixed right-5' href=''>2</a>
        <a className='px-1 transition rounded hover:bg-[#1b1b1b] hover:text-[#eeeeeede] fixed right-10' href=''>-</a>
      </footer>
    </>
  )
}




export default App
