import React from 'react';
import { useState, useEffect } from 'react'
import { BiCommentDetail, BiEdit } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import ModalNovaPendencia from './modalnovapendencia';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import useAuth from '../Hooks/useAuth';
import Footer from './footer';
import { BsClipboard } from "react-icons/bs"
import ModalFecharPendencia from './modalFecharPendencia';


function Tabela() { 
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalNova, setModalNova] = useState(false);
    const [idOut, setIdOut] = useState(null);
    const [modalFechar, setModalFechar] = useState(true);

    useEffect(() => {
        const loadPendencia = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get('/getpendencias');
                setLoading(false);
                setPendencias(response.data);
            } catch (err) {
                console.log(err)
            }
        }
        loadPendencia();
    }, [])

    if(loading) {
        return <p className='p-2 font-Inter text-[#ffffffde] font-bold'>Carregando pendências...</p>
    }
    

    function clickEncerrarPendencia(event) { //tenho que tirar a função de setar o id dessa função se não ele não vai fechar o modal
        setModalFechar(current => !current)
        if (modalFechar) {
            const id = event.currentTarget.dataset.id;
            setIdOut(id);
        }
        
    }

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
                <table className="font-Inter w-full">
                    <thead className="text-left border-b-2 border-[#292929]">
                        <tr className='cursor-default select-none' >
                            <th>Título</th>
                            <th>Tipo</th>
                            <th>Responsável</th>
                            <th>Início</th>
                            <th>Previsão</th>
                            <th>Atualizar em</th>
                            <th>Task</th>
                            <th>Incidente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendencias.map((item) => (
                            <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                <td className='pl-1' >{item.titulo}</td>
                                <td>{item.tipo}</td>
                                <td>{item.responsavel}</td>
                                <td>{item.dateinit}</td>
                                <td>{item.dateend}</td>
                                <td>{item.dateatt}</td>
                                <td>{item.taskid ? (
                                    <div onClick={() => {navigator.clipboard.writeText(item.taskid)}} className='flex hover:text-[#aaaaaa]'>
                                        <BsClipboard className='mt-1 mr-1'/>
                                        {item.taskid}
                                    </div>
                                ) : null}
                                </td>
                                <td>{item.incidenturl ? (
                                    <a className='underline hover:text-[#aaaaaa]' href={item.incidenturl} target='_blank'>incidente</a>
                                    ) : null}
                                </td>
                                <td className='pr-0'>
                                    <div className='flex flex-row pr-0'>
                                        <a className='cursor-default' ><BiCommentDetail /> </a>
                                        <a data-id={item.id} className='cursor-default'><BiEdit /> </a>
                                        <a data-id={item.id} onClick={clickEncerrarPendencia} className='cursor-default'><AiOutlineCheckSquare /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
            <div>
            { modalNova ? <ModalNovaPendencia fecharModal={clickNovaPendencia} /> : null}
            { !modalFechar ? <ModalFecharPendencia closeModal={clickEncerrarPendencia} id={idOut}/> : null }
            </div>
      </>
    )
};



export default Tabela