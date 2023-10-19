import React from 'react';
import { useState, useEffect, useReducer } from 'react'
import { BiCommentDetail, BiEdit } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import ModalNovaPendencia from './modalnovapendencia';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import useAuth from '../Hooks/useAuth';
import { BsClipboard } from "react-icons/bs"
import ModalFecharPendencia from './modalFecharPendencia';
import ModalEditPendencia from './modaleditpendencia';
import ReactPaginate from 'react-paginate';

function Tabela() { 
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalNova, setModalNova] = useState(false);
    const [idOut, setIdOut] = useState(null);
    const [modalFechar, setModalFechar] = useState(true);
    const [modalEditar, setModalEditar] = useState(true);
    const [pendenciaEdit, setPendenciaEdit] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [ignored, forceUpdate] = useReducer(x => + 1, 0);

    const itemsPerPage = 31;

    
    const pendenciasFinalizadas = pendencias.filter((pendencia) => pendencia.complete == true);
    const pendenciasAbertas = pendencias.filter((pendencia) => pendencia.complete == false);

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
    }, [ignored]) //por enquanto ele só vai atualizar o componente baseado nesse [ignore], pra frente pegar a resposta do post do modal nova pendencia e inserir na table
    

    useEffect(() => {   
        if (isChecked) {
            setTotalPages(Math.ceil(pendenciasFinalizadas.length / itemsPerPage))
        } else {
            setTotalPages(Math.ceil(pendenciasAbertas.length / itemsPerPage)) 
        }
    }, [!isChecked])

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pendenciasabertaspag = pendenciasAbertas.slice(startIndex, endIndex);
    const pendenciasfinalizadaspag = pendenciasFinalizadas.slice(startIndex, endIndex);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    if(loading) {
        return <p className='p-2 font-Inter text-[#ffffffde] font-bold'>Carregando pendências...</p>
    }
    
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    }

    function setarId(id) {
        setIdOut(id)
        return idOut
    }

    function clickEncerrarPendencia(event) { 
        setModalFechar(current => !current)
        if (modalFechar) {
            setarId(event.currentTarget.dataset.id)
        };
    }

    function clickEditarPendencia(event) {
        if (modalEditar) {
            const idedit = event.currentTarget.dataset.id;
            setarId(idedit);
            const pendenciabyId = pendencias.find((pendencia) => pendencia.id == idedit);
            setPendenciaEdit(pendenciabyId);
        }
        setModalEditar(current => !current);
    }


    const clickNovaPendencia = () => {
      setModalNova(current => !current);
      if (modalNova) {
        forceUpdate()
      }
    }
  
    function formataData(date) {
        date = date.replace(/T/g, ' ');
        date = date.replace(/-/g , '/')
        return date;
    } 


    return (
        <>
            <nav className=' select-none flex flex-row justify-between max-h-10 px-2 py-2 text-sm text-[#ffffffde] bg-gradient-to-b from-[#212121]'>
                <h1 className='font-Inter font-bold cursor-default'>Pendências Monitoramento</h1>
                <a onClick={clickNovaPendencia} className='flex font-system font-medium cursor-default bg-[#343434] hover:bg-[#1b1b1b] transition py-[1px] px-[10px] rounded-md '>
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
                        {isChecked && pendenciasfinalizadaspag.map((item) => (
                            <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                <td className='pl-1' >{item.titulo}</td>
                                <td>{item.tipo}</td>
                                <td>{item.responsavel}</td>
                                <td>{formataData(item.dateinit)}</td>
                                <td>{formataData(item.dateend)}</td>
                                <td>{formataData(item.dateatt)}</td>
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
                            </tr>
                        ))}
                        {!isChecked && pendenciasabertaspag.map((item) => (
                            <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                <td className='pl-1' >{item.titulo}</td>
                                <td>{item.tipo}</td>
                                <td>{item.responsavel}</td>
                                <td>{formataData(item.dateinit)}</td>
                                <td>{formataData(item.dateend)}</td>
                                <td>{formataData(item.dateatt)}</td>
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
                                        <a data-id={item.id} onClick={clickEditarPendencia} className='cursor-default hover:text-[#aaaaaa] transition-all'><BiEdit /> </a>
                                        <a data-id={item.id} onClick={clickEncerrarPendencia} className='cursor-default hover:text-[#aaaaaa] transition-all'><AiOutlineCheckSquare /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <footer className='text-[#ffffffde] flex justify-between font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0 pb-0' >
                <label className='mb-1 ml-1 relative inline-flex cursor-default select-none items-center justify-center rounded-md bg-[#343434] p-[3px] '>
                    <input 
                        type="checkbox" 
                        className='sr-only'
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <span className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${!isChecked ? 'bg-[#242424]' : 'hover:bg-[#292929]'} transition-all`}>
                        Em Andamento
                    </span>
                    <span className={` flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${isChecked ? 'bg-[#242424]' : ' hover:bg-[#292929]'} transition-all`}>
                        Concluídas
                    </span>
                </label>
                <div className='m-auto ml-[700px] block'>
                    <ReactPaginate 
                        className='flex flex-row bg-[#343434] rounded-md' 
                        pageCount={totalPages} 
                        onPageChange={handlePageChange} 
                        forcePage={currentPage} 
                        previousLabel={"<"}
                        previousClassName='hover:bg-[#292929] transition-all rounded w-[15px]'
                        previousLinkClassName='cursor-default'
                        nextLinkClassName='cursor-default'
                        nextLabel={">"}
                        nextClassName='hover:bg-[#292929] transition-all rounded w-[15px]'
                        disabledClassName=''
                        pageLinkClassName='cursor-default'
                        pageClassName='mx-1 hover:bg-[#292929] transition-all rounded '
                        activeClassName='bg-[#242424]'
                    />
                </div>
                <Link className='mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/gerencia">Gerência</Link>
            </footer>
            <div>
            { modalNova ? <ModalNovaPendencia fecharModal={clickNovaPendencia} /> : null}
            { !modalFechar ? <ModalFecharPendencia closeModal={clickEncerrarPendencia} id={idOut}/> : null }
            { !modalEditar ? <ModalEditPendencia fecharModal={clickEditarPendencia} penden={pendenciaEdit}/> : null}
            </div>
      </>
    )
};



export default Tabela