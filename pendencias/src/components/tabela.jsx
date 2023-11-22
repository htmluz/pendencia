import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { BiCommentDetail, BiEdit } from "react-icons/bi";
import { AiOutlineCheckSquare, AiOutlinePlus } from "react-icons/ai";
import { BsClipboard } from "react-icons/bs"
import { PiWarningFill, PiWarningOctagonFill } from "react-icons/pi"
import { FaSortDown, FaSortUp, FaQuestion, FaCheck } from "react-icons/fa";
import ModalAndamento from './modalandamento';
import ModalNovaPendencia from './modalnovapendencia';
import ModalFecharPendencia from './modalFecharPendencia';
import ModalEditPendencia from './modaleditpendencia';
import ModalDetalhePendencia from './modaldetalhependencia';
import TableAndamentos from './tableandamentos';
import useAxiosPrivate from '../Hooks/useAxiosPrivate';
import moment from 'moment-timezone';
import axios from '../api/axios';

function Tabela() { 
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [col, setCol] = useState("dateinit");
    const [order, setOrder] = useState("asc")
    const [idOut, setIdOut] = useState(null);
    const [unidade, setUnidade] = useState("TIO");
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const [modalNova, setModalNova] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [pendencias, setPendencias] = useState([]);
    const [modalAndam, setModalAndam] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [modalFechar, setModalFechar] = useState(true);
    const [modalEditar, setModalEditar] = useState(true);
    const [modalDetalhe, setModalDetalhe] = useState(true);
    const [isCheckedUni, setIsCheckedUni] = useState(false);
    const [pendenciaEdit, setPendenciaEdit] = useState(null);
    const [isCheckedManu, setIsCheckedManu] = useState(false);
    const [pendenciaFechar, setPendenciaFechar] = useState(null);
    const [isElementVisible, setElementVisible] = useState(false);
    const [pendenciaDetalhe, setPendenciaDetalhe] = useState(null);
    const [pendenciasAbertas, setPendenciasAbertas] = useState([]);
    const [pendenciasAbertasSYGO, setPendenciasAbertasSYGO] = useState([]);
    const [pendenciasFinalizadas, setPendenciasFinalizadas] = useState([]);
    const [pendenciasFinalizadasSYGO, setPendenciasFinalizadasSYGO] = useState([]);
    const [searchValue, setSearchValue] = useState("titulo");

    const [pendenciasabertaspag, setPendenciasabertaspag] = useState([]);
    const [pendenciasfinalizadaspag, setPendenciasfinalizadaspag] = useState([]);
    const itemsPerPage = 31;
    let startIndex = 0;
    let endIndex = 31;



    useEffect(() => {
        loadPendencia();
        loadPendenciaComplete();
        loadPendenciaSYGO();
        loadPendenciaCompleteSYGO();
    }, []) 
    
    useEffect(() => {
        startIndex = currentPage * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
        if (!isCheckedUni && !isCheckedManu) {
            setPendenciasabertaspag(pendenciasAbertas
                .filter((item) => item.tipo !== "Campanha de Manutenção")
                .slice(startIndex, endIndex));
        } else if (isCheckedUni && !isCheckedManu) {
            setPendenciasabertaspag(pendenciasAbertasSYGO.slice(startIndex, endIndex));
        } else {
            setPendenciasabertaspag(pendenciasAbertas
                .filter((item) => item.tipo === "Campanha de Manutenção")
                .slice(startIndex, endIndex));
        }
    }, [currentPage, pendenciasAbertas, isCheckedUni, isCheckedManu, pendenciasAbertasSYGO])

    useEffect(() => {
        startIndex = currentPage * itemsPerPage;
        endIndex = startIndex + itemsPerPage;
        if (!isCheckedUni && !isCheckedManu) {
            setPendenciasfinalizadaspag(pendenciasFinalizadas
                .filter((item) => item.tipo !== "Campanha de Manutenção")
                .slice(startIndex, endIndex));
        } else if (isCheckedUni && !isCheckedManu) {
            setPendenciasfinalizadaspag(pendenciasFinalizadasSYGO.slice(startIndex, endIndex));
        } else {
            setPendenciasfinalizadaspag(pendenciasFinalizadas
                .filter((item) => item.tipo === "Campanha de Manutenção")
                .slice(startIndex, endIndex));
        }
    }, [currentPage, pendenciasFinalizadas, isCheckedUni, isCheckedManu, pendenciasFinalizadasSYGO])

    useEffect(() => {
        const sorted = [...pendenciasAbertas].sort((a, b) => 
        a[col] > b[col] ? 1 : -1
        )
        setPendenciasAbertas(sorted);
    }, [!loading])



    const loadPendencia = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get('/pendencias/get/openTIO');
            setPendencias(response.data);
            setTotalPages(Math.ceil(response.data.filter(item => item.tipo !== "Campanha de Manutenção").length / itemsPerPage));
            setPendenciasAbertas(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    }

    const loadPendenciaComplete = async () => {
        try {
            const response = await axiosPrivate.get('/pendencias/get/completeTIO');
            setPendenciasFinalizadas(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const loadPendenciaSYGO = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get('/pendencias/get/openSYGO');
            setPendenciasAbertasSYGO(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    }

    const loadPendenciaCompleteSYGO = async () => {
        try {
            const response = await axiosPrivate.get('/pendencias/get/completeSYGO');
            setPendenciasFinalizadasSYGO(response.data);
        } catch (err) {
            console.log(err);
        }
    }


    const handleMouseOver = (event) => { //mostra a tabela de andamentos
        const { clientX, clientY } = event;
        setPosition({ top: clientY, right: clientX});
        setElementVisible(true);
        setarId(event.currentTarget.dataset.id); 
    }

    const handleMouseOver2 = (event) => { //deixa a tabela ativa com o mouse em cima da div, passado pro componente de tabela
        setElementVisible(true);
    }

    const handleMouseOut = () => { //remove a tabela de andamentos
        setElementVisible(false);
    }

    
    useEffect(() => {                                               //seta a quantia de paginas
        if (isChecked && !isCheckedUni && !isCheckedManu) {         //concluidas tio
            setTotalPages(Math.ceil(pendenciasFinalizadas.filter(item => item.unidade === unidade && item.tipo !== "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0);
        } else if (isChecked && isCheckedUni && !isCheckedManu) {   //concluidas sygo
            setTotalPages(Math.ceil(pendenciasFinalizadasSYGO.filter(item => item.unidade === unidade && item.tipo !== "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0);
        } else if (!isChecked && !isCheckedUni && !isCheckedManu) { //abertas tio
            setTotalPages(Math.ceil(pendenciasAbertas.filter(item => item.unidade === unidade && item.tipo !== "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0);
        } else if (!isChecked && isCheckedUni && !isCheckedManu) {  //abertas sygo
            setTotalPages(Math.ceil(pendenciasAbertasSYGO.filter(item => item.unidade === unidade && item.tipo !== "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0); 
        } else if (!isChecked && isCheckedManu) {                   //abertas manu
            setTotalPages(Math.ceil(pendenciasAbertas.filter(item => item.tipo === "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0);
        } else if (isChecked && isCheckedManu) {                    //concluidas manu
            setTotalPages(Math.ceil(pendenciasFinalizadas.filter(item => item.tipo === "Campanha de Manutenção").length / itemsPerPage));
            setCurrentPage(0);
        }
    }, [!isChecked, isCheckedUni])

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        if (!isChecked && !isCheckedUni) {
            if (query === "") {
                setPendenciasabertaspag(pendenciasAbertas.slice(startIndex, endIndex));
                setCurrentPage(0);
            } else {
                setPendenciasabertaspag([...pendenciasAbertas].filter((item) =>
                (searchValue === 'dateinit'
                    ? item[searchValue].toLowerCase().includes(event.target.value.replace(/\//g, '-'))
                    : item[searchValue].toLowerCase().includes(event.target.value.toLowerCase())
                )
            ))}
        } else if (!isChecked && isCheckedUni) {
            if (query === "") {
                setPendenciasabertaspag(pendenciasAbertasSYGO.slice(startIndex, endIndex));
                setCurrentPage(0);
            } else {
                setPendenciasabertaspag([...pendenciasAbertasSYGO].filter((item) =>
                (searchValue === 'dateinit'
                    ? item[searchValue].toLowerCase().includes(event.target.value.replace(/\//g, '-'))
                    : item[searchValue].toLowerCase().includes(event.target.value.toLowerCase())
                )
            ))}
        } else if (isChecked && !isChecked) {
            if (query === "") {
                setPendenciasfinalizadaspag(pendenciasFinalizadas.slice(startIndex, endIndex));
                setCurrentPage(0);
            } else {
                setPendenciasfinalizadaspag([...pendenciasFinalizadas].filter((item) =>
                (searchValue === 'dateinit'
                    ? item[searchValue].toLowerCase().includes(event.target.value.replace(/\//g, '-'))
                    : item[searchValue].toLowerCase().includes(event.target.value.toLowerCase())
                )
            ))}
        } else {
            if (query === "") {
                setPendenciasfinalizadaspag(pendenciasFinalizadasSYGO.slice(startIndex, endIndex));
                setCurrentPage(0);
            } else {
                setPendenciasfinalizadaspag([...pendenciasFinalizadasSYGO].filter((item) =>
                (searchValue === 'dateinit'
                    ? item[searchValue].toLowerCase().includes(event.target.value.replace(/\//g, '-'))
                    : item[searchValue].toLowerCase().includes(event.target.value.toLowerCase())
                )
            ))}
        }
    }

    function handleLogout() {
        const cookieName = "logged";
        const cookieName2 = "roles";
        const pastDate = new Date(0).toUTCString();
        document.cookie = `${cookieName}=; expires=${pastDate}; path=/`;
        document.cookie = `${cookieName2}=; expires=${pastDate}; path=/`;
        window.localStorage.removeItem("USER");
        const response = axios.get('/usuarios/logout');
        navigate('/login');
    }

    const handlePageChange = (selectedPage) => { 
        setCurrentPage(selectedPage.selected);
    };

    if(loading) { //enquanto carrega a tabela de pendências mostra o texto
        return <p className='p-2 font-Inter text-[#ffffffde] font-bold'>Carregando pendências...</p>
    }
    
    const handleCheckboxChange = () => { //troca o valor entre pendencias concluidas e em andamento
        setIsChecked(!isChecked);
    }

    const handleCheckboxChangeUni = () => { //troca o valor entre unidades
        if (!isCheckedUni) {
            setUnidade("SYGO")
        } else (setUnidade("TIO"))
        setIsCheckedUni(!isCheckedUni);
        if (isCheckedManu) {
            setIsCheckedManu(false);
        }
    }

    const handleCheckboxChangeManu = () => { //troca o valor entre unidades
        setIsCheckedManu(!isCheckedManu);
    }

    function setarId(id) {  //função usada pra enviar id para os componentes que precisa, modal editar, modal fechar e tabela de andamentos
        setIdOut(id);
        return idOut
    }

    function clickEncerrarPendencia(event) {  
        setModalFechar(current => !current)
        if (modalFechar) {
            const idedit = event.currentTarget.dataset.id;
            setarId(idedit);
            if (!isCheckedUni) {
                let pendenciabyId = pendenciasAbertas.find((pendencia) => pendencia.id == idedit);
                pendenciabyId = pendenciabyId.taskid;
                setPendenciaFechar(pendenciabyId);
            } else {
                let pendenciabyId = pendenciasAbertasSYGO.find((pendencia) => pendencia.id == idedit);
                pendenciabyId = pendenciabyId.taskid;
                setPendenciaFechar(pendenciabyId);
            }
        } else {
            if (!isCheckedUni) {
                loadPendencia();
            } else {
                loadPendenciaSYGO();
            }
        }
    }

    function clickEditarPendencia(event) {
        if (modalEditar) {
            const idedit = event.currentTarget.dataset.id; //seto o id primeiro numa variavel pra usar ele dentro do if ainda
            setarId(idedit);
            if (!isCheckedUni) {
                let pendenciabyId = pendenciasAbertas.find((pendencia) => pendencia.id == idedit); //acho a pendencia pelo id 
                pendenciabyId.dateatt = formataDataEdit(pendenciabyId.dateatt);  //formatando pra preencher o campo datetime-local, tá bugando a hora que edita ele edita na tabela tb
                pendenciabyId.dateend = formataDataEdit(pendenciabyId.dateend);
                pendenciabyId.dateinit = formataDataEdit(pendenciabyId.dateinit);
                setPendenciaEdit(pendenciabyId);                //passo a pendencia que encontrei com os values ja pra preencher o modal
            } else {
                let pendenciabyId = pendenciasAbertasSYGO.find((pendencia) => pendencia.id == idedit);
                pendenciabyId.dateatt = formataDataEdit(pendenciabyId.dateatt);
                pendenciabyId.dateend = formataDataEdit(pendenciabyId.dateend);
                pendenciabyId.dateinit = formataDataEdit(pendenciabyId.dateinit);
                setPendenciaEdit(pendenciabyId);  
            }
        } else {
            if (!isCheckedUni) {
                loadPendencia();
            } else {
                loadPendenciaSYGO();
            }
            
        }
        setModalEditar(current => !current);
    }

    function clickAndamentoPendencia(event) {
        setModalAndam(current => !current)
        if (modalAndam) {
            setarId(event.currentTarget.dataset.id);
        } else {
            if (!isCheckedUni) {
                loadPendencia();
            } else {
                loadPendenciaSYGO();
            }
        }
    }

    const clickNovaPendencia = () => {
        setModalNova(current => !current);
            if (modalNova) {
                if (!isCheckedUni) {
                    loadPendencia();
                } else {
                    loadPendenciaSYGO()
                }
            } 
    }

    const clickDetalhePendencia = (event) => {
        if (modalDetalhe && !isChecked) {
            const idedit = event.currentTarget.dataset.id;
            setarId(idedit);
            if (!isCheckedUni) {
                let pendenciabyId = pendencias.find((pendencia) => pendencia.id == idedit);
                setPendenciaDetalhe(pendenciabyId);
            } else {
                let pendenciabyId = pendenciasAbertasSYGO.find((pendencia) => pendencia.id == idedit);
                setPendenciaDetalhe(pendenciabyId);
            }
        } else if (modalDetalhe && isChecked) {
            const idedit = event.currentTarget.dataset.id;
            setarId(idedit);
            if (!isCheckedUni) {
                let pendenciabyId = pendenciasFinalizadas.find((pendencia) => pendencia.id == idedit);
                setPendenciaDetalhe(pendenciabyId);
            } else {
                let pendenciabyId = pendenciasFinalizadasSYGO.find((pendencia) => pendencia.id == idedit);
                setPendenciaDetalhe(pendenciabyId);
            }
        }
        setModalDetalhe(current => !current);
    }



    function formataData(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo');
        return date.format('YYYY/MM/DD HH:mm')
    } 

    function formataDataEdit(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo')
        return date.format('YYYY-MM-DD HH:mm');
    }

    function dataAviso(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo');
        date = date.isBefore(moment().tz('America/Sao_Paulo'))
        return date
    }

    
    const sorting = (col) => {
        if (!isChecked && !isCheckedUni) {
            if (order === "asc") {
                const sorted = [...pendenciasAbertas].sort((a, b) => 
                a[col] > b[col] ? 1 : -1
                )
                setPendenciasAbertas(sorted);
                setCol(col);
                setOrder("dsc");
            }
            if (order === "dsc") {
                const sorted = [...pendenciasAbertas].sort((a, b) => 
                a[col] < b[col] ? 1 : -1
                )
                setPendenciasAbertas(sorted);
                setCol(col);
                setOrder("asc");
            }
        } else if (isChecked && !isCheckedUni) {
            if (order === "asc") {
                const sorted = [...pendenciasFinalizadas].sort((a, b) => 
                a[col] > b[col] ? 1 : -1
                )
                setPendenciasFinalizadas(sorted);
                setCol(col);
                setOrder("dsc");
            }
            if (order === "dsc") {
                const sorted = [...pendenciasFinalizadas].sort((a, b) => 
                a[col] < b[col] ? 1 : -1
                )
                setPendenciasFinalizadas(sorted);
                setCol(col);
                setOrder("asc");
            }
        } else if (!isChecked && isCheckedUni) {
            if (order === "asc") {
                const sorted = [...pendenciasAbertasSYGO].sort((a, b) => 
                a[col] > b[col] ? 1 : -1
                )
                setPendenciasAbertasSYGO(sorted);
                setCol(col);
                setOrder("dsc");
            }
            if (order === "dsc") {
                const sorted = [...pendenciasAbertasSYGO].sort((a, b) => 
                a[col] < b[col] ? 1 : -1
                )
                setPendenciasAbertasSYGO(sorted);
                setCol(col);
                setOrder("asc");
            }
        } else if (isChecked && isCheckedUni) {
            if (order === "asc") {
                const sorted = [...pendenciasFinalizadasSYGO].sort((a, b) => 
                a[col] > b[col] ? 1 : -1
                )
                setPendenciasFinalizadasSYGO(sorted);
                setCol(col);
                setOrder("dsc");
            }
            if (order === "dsc") {
                const sorted = [...pendenciasFinalizadasSYGO].sort((a, b) => 
                a[col] < b[col] ? 1 : -1
                )
                setPendenciasFinalizadasSYGO(sorted);
                setCol(col);
                setOrder("asc");
            }
        }
    }

    

    return (
        <>
            <nav className=' select-none flex flex-row justify-between max-h-10 px-2 py-2 text-sm text-[#ffffffde] bg-gradient-to-b from-[#212121]'>
                <label className='mb-1 py-3 relative inline-flex cursor-default select-none items-center justify-center rounded-l-md bg-[#343434] p-[3px] pr-0 '>
                        <input 
                            type="checkbox" 
                            className='sr-only'
                            checked={isCheckedUni}
                            onChange={() => {
                                handleCheckboxChangeUni(), setIsChecked(false)
                            }}
                        />
                        <span className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${!isCheckedUni && !isCheckedManu ? 'bg-[#242424]' : 'hover:bg-[#292929]'} transition-all`}>
                            TIO
                        </span>
                        <span className={` flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${isCheckedUni && !isCheckedManu ? 'bg-[#242424]' : ' hover:bg-[#292929]'} transition-all`}>
                            SYGO
                        </span>
                </label>
                <div className='text-[#ffffffde] flex'>
                    <label className='mb-1 py-3 relative inline-flex cursor-default select-none items-center justify-center rounded-r-md bg-[#343434] p-[3px] pl-0 '>
                        <input 
                            className='sr-only'  
                            id='manutencao' 
                            type='checkbox'
                            onChange={handleCheckboxChangeManu}
                            checked={isCheckedManu}
                        />
                        <span className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${isCheckedManu ? 'bg-[#242424]' : 'hover:bg-[#292929]'} transition-all`}>
                            Manutenções Programadas
                        </span>
                    </label>
                </div>
                <div className='ml-auto w-3/5'>
                    <input id="search" placeholder='Procurar Pendência' className='pl-1 rounded-l bg-[#343434] hover:bg-[#1b1b1b] w-2/4 transition focus:outline-none focus:bg-[#1b1b1b]' onChange={handleSearch} type="text" />
                    <select value={searchValue} onChange={(event) => setSearchValue(event.target.value)} className='text-[#9CA3AF] pl-1 rounded-r bg-[#343434] hover:bg-[#1b1b1b] transition focus:outline-none focus:bg-[#1b1b1b] text-center' id='search'>
                        <option value="titulo">&#8595; Título</option>
                        <option value='tipo'>Tipo</option>
                        <option value='responsavel'>Responsável</option>
                        <option value='dateinit'>Início</option>
                    </select>
                </div>
                <a onClick={clickNovaPendencia} className='flex font-system font-medium cursor-default bg-[#343434] hover:bg-[#1b1b1b] transition py-[1px] px-[10px] rounded-md '>
                    <AiOutlinePlus className='mr-1 mt-1 cursor-pointer'/> Nova Pendência 
                </a>
            </nav>
            <div className='text-[#ffffffde] flex w-full p-2' >
                {!isChecked ? (
                    <table className="font-Inter w-full">
                        <thead className="text-left border-b-2 border-[#292929]">
                            <tr className='cursor-default select-none'>
                                <th>Título</th>
                                <th onClick={() => sorting('tipo')}>
                                    <div className='flex'>
                                        Tipo
                                        {col === "tipo" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "tipo" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th onClick={() => sorting('responsavel')}>
                                    <div className='flex'>
                                        Responsável
                                        {col === "responsavel" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "responsavel" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th className='flex' onClick={() => sorting('dateinit')}>
                                    Início
                                    {col === "dateinit" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                    {col === "dateinit" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                </th>
                                <th onClick={() => sorting('dateend')}>
                                    <div className='flex'>
                                        Previsão
                                        {col === "dateend" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "dateend" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th className='flex' onClick={() => sorting('dateatt')}>
                                    Atualizar em
                                    {col === "dateatt" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                    {col === "dateatt" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                </th>
                                <th>Task</th>
                                <th>Incidente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendenciasabertaspag
                                .filter(item => item.unidade === unidade)
                                .map((item) => (
                                    <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                        <td data-id={item.id} onClick={clickDetalhePendencia} className='pl-1' >{item.titulo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.tipo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.responsavel}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{formataData(item.dateinit)}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>
                                            <div className='flex'>
                                                {formataData(item.dateend)}
                                                {dataAviso(item.dateend) ? <PiWarningOctagonFill className='mt-1 ml-1 text-red-500' /> : null}
                                            </div>
                                            </td>
                                        <td data-id={item.id} className='flex' onClick={clickDetalhePendencia}>
                                            {formataData(item.dateatt)}
                                            {dataAviso(item.dateatt) ? <PiWarningFill className='mt-1 ml-1 text-yellow-500' /> : null}
                                        </td>
                                        <td>{item.taskid ? (
                                            <div onClick={() => {navigator.clipboard.writeText(item.taskid)}} className='flex hover:text-[#aaaaaa]'>
                                                <BsClipboard className='mt-1 mr-1'/>
                                                {item.taskid}
                                            </div>
                                        ) : null}
                                        </td>
                                        <td>{item.incidenturl ? (
                                            <a className='underline hover:text-[#aaaaaa]' href={item.incidenturl} target='_blank'>Incidente</a>
                                            ) : null}
                                        </td>
                                        <td className='pr-0'>
                                            <div className='flex flex-row pr-0'>
                                                <a 
                                                    onMouseOver={item.andamento.length > 0 ? handleMouseOver : null }
                                                    onMouseLeave={handleMouseOut}
                                                    data-id={item.id} 
                                                    onClick={clickAndamentoPendencia} 
                                                    className={`cursor-default ${item.andamento.length > 0 ? 'hover:text-[#aaaaaa]' : 'text-[#666666]'}`} >
                                                    <BiCommentDetail /> 
                                                </a>
                                                <a data-id={item.id} onClick={clickEditarPendencia} className='cursor-default hover:text-[#aaaaaa] transition-all'><BiEdit /> </a>
                                                <a data-id={item.id} onClick={clickEncerrarPendencia} className='cursor-default hover:text-[#aaaaaa] transition-all'><AiOutlineCheckSquare /></a>
                                            </div>
                                        </td>
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                ) : 
                    <table className="font-Inter w-full">
                        <thead className="text-left border-b-2 border-[#292929]">
                            <tr className='cursor-default select-none'>
                                <th>Título</th>
                                <th onClick={() => sorting('tipo')}>
                                    <div className='flex'>
                                        Tipo
                                        {col === "tipo" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "tipo" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th onClick={() => sorting('responsavel')}>
                                    <div className='flex'>
                                        Responsável
                                        {col === "responsavel" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "responsavel" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th className='flex' onClick={() => sorting('dateinit')}>
                                    Início
                                    {col === "dateinit" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                    {col === "dateinit" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                </th>
                                <th onClick={() => sorting('dateend')}>
                                    <div className='flex'>
                                        Fim
                                        {col === "dateend" && order === "asc" ? <FaSortUp className='mt-1'/> : null}
                                        {col === "dateend" && order === "dsc" ? <FaSortDown className='mt-1'/> : null}
                                    </div>
                                </th>
                                <th>Task</th>
                                <th>Incidente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isCheckedUni ? pendenciasFinalizadas
                                .filter(item => item.unidade === "SYGO")
                                .map((item) => (
                                    <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                        <td data-id={item.id} onClick={clickDetalhePendencia} className='pl-1' >{item.titulo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.tipo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.responsavel}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{formataData(item.dateinit)}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{formataData(item.dateend)}</td>
                                        <td>{item.taskid ? (
                                            <div onClick={() => {navigator.clipboard.writeText(item.taskid)}} className='flex hover:text-[#aaaaaa]'>
                                                <BsClipboard className='mt-1 mr-1'/>
                                                {item.taskid}
                                            </div>
                                        ) : null}
                                        </td>
                                        <td>{item.incidenturl ? (
                                            <a className='underline hover:text-[#aaaaaa]' href={item.incidenturl} target='_blank'>Incidente</a>
                                            ) : null}
                                        </td>
                                        <td className='pr-0'>
                                            <div className='flex flex-row pr-0'>
                                                <a 
                                                    onMouseOver={item.andamento.length > 0 ? handleMouseOver : null }
                                                    onMouseLeave={handleMouseOut}
                                                    data-id={item.id} 
                                                    className={`cursor-default ${item.andamento.length > 0 ? 'hover:text-[#aaaaaa]' : 'text-[#666666]'}`} >
                                                    <BiCommentDetail /> 
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                            )) : pendenciasfinalizadaspag
                                .map((item) => (
                                    <tr className='font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6' key={item.id}>
                                        <td data-id={item.id} onClick={clickDetalhePendencia} className='pl-1' >{item.titulo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.tipo}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{item.responsavel}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{formataData(item.dateinit)}</td>
                                        <td data-id={item.id} onClick={clickDetalhePendencia}>{formataData(item.dateend)}</td>
                                        <td>{item.taskid ? (
                                            <div onClick={() => {navigator.clipboard.writeText(item.taskid)}} className='flex hover:text-[#aaaaaa]'>
                                                <BsClipboard className='mt-1 mr-1'/>
                                                {item.taskid}
                                            </div>
                                        ) : null}
                                        </td>
                                        <td>{item.incidenturl ? (
                                            <a className='underline hover:text-[#aaaaaa]' href={item.incidenturl} target='_blank'>Incidente</a>
                                            ) : null}
                                        </td>
                                        <td className='pr-0'>
                                            <div className='flex flex-row pr-0'>
                                                <a 
                                                    onMouseOver={item.andamento.length > 0 ? handleMouseOver : null }
                                                    onMouseLeave={handleMouseOut}
                                                    data-id={item.id} 
                                                    className={`cursor-default ${item.andamento.length > 0 ? 'hover:text-[#aaaaaa]' : 'text-[#666666]'}`} >
                                                    <BiCommentDetail /> 
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
            }
            </div>
            {isElementVisible ? <TableAndamentos handleMouseOver={handleMouseOver2} handleMouseOut={handleMouseOut} top={position.top} id={idOut} pendencias={isChecked ? pendenciasfinalizadaspag : pendenciasabertaspag} /> : null}
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
                        nextLinkClassName={'cursor-default w-full'}
                        nextLabel={">"}
                        nextClassName='hover:bg-[#292929] transition-all rounded w-[15px]'
                        pageLinkClassName='cursor-default'
                        pageClassName='mx-1 hover:bg-[#292929] transition-all rounded'
                        activeClassName='bg-[#242424]'
                        breakLabel="..."
                        pageRangeDisplayed={20}
                    />
                </div>
                <FaQuestion className='mb-1 mr-2 mt-1 float-right cursor-help' title='Bugs ou sugestões favor informar no bitrix Luiz Eduardo Krol.' />
                <button className='mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' onClick={handleLogout}>Logout</button>
                <Link className='mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/gerencia">Gerência</Link>
            </footer>
            <div>
            { modalNova ? <ModalNovaPendencia fecharModal={clickNovaPendencia} Unidade={isCheckedUni ? "SYGO" : "TIO"}/> : null}
            { !modalFechar ? <ModalFecharPendencia closeModal={clickEncerrarPendencia} id={idOut} idtask={pendenciaFechar}/> : null }
            { !modalEditar ? <ModalEditPendencia fecharModal={clickEditarPendencia} penden={pendenciaEdit}/> : null}
            { !modalAndam ? <ModalAndamento closeModal={clickAndamentoPendencia} id={idOut}/> : null }
            { !modalDetalhe ? <ModalDetalhePendencia fecharModal={clickDetalhePendencia} penden={pendenciaDetalhe} /> : null}
            </div>
      </>
    )
};



export default Tabela