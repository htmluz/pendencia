import React from 'react';
import { useState, useEffect } from 'react'
import { BiCommentDetail, BiEdit } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import ModalNovaPendencia from './modalnovapendencia';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import useAuth from '../Hooks/useAuth';

function Tabela() { 
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalNova, setModalNova] = useState(false);

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
        return <p className='font-Inter'>Carregando pendências...</p>
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
                                <td>
                                    <div>
                                        {item.taskid}
                                    </div>
                                </td>
                                <td>{item.incidenturl}</td>
                                <td className='pr-0'>
                                    <div className='flex flex-row pr-0'>
                                        <a href=""className='cursor-default' ><BiCommentDetail /> </a>
                                        <a href=""className='cursor-default'><BiEdit /> </a>
                                        <a href=""className='cursor-default'><AiOutlineCheckSquare /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <footer className='text-[#ffffffde] block font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0'>
                <a className='float-left p-1 hover:bg-[#333333] transition-all rounded' href=''>Em andamento</a>
                <a className='float-left p-1 hover:bg-[#333333] transition-all rounded' href=''>Concluídas</a>
                <a className='float-right p-1 hover:bg-[#333333] transition-all rounded' href=''>Tipos</a>
                <Link className='float-right p-1 hover:bg-[#333333] transition-all rounded' to="/usuarios">Usuários</Link>
            </footer>
            <div>
            { modalNova ? <ModalNovaPendencia fecharModal={clickNovaPendencia} /> : null}
            </div>
      </>
    )
};



export default Tabela