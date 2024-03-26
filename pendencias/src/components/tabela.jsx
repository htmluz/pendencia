import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { BsClipboard } from "react-icons/bs";
import { PiWarningFill, PiWarningOctagonFill } from "react-icons/pi";
import { FaSortDown, FaSortUp, FaQuestion } from "react-icons/fa";
import ModalAndamento from "./modalandamento";
import ModalNovaPendencia from "./modalnovapendencia";
import ModalFecharPendencia from "./modalFecharPendencia";
import ModalEditPendencia from "./modaleditpendencia";
import ModalDetalhePendencia from "./modaldetalhependencia";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import moment from "moment-timezone";
import axios from "../api/axios";

function Tabela() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [col, setCol] = useState("dateinit");
  const [order, setOrder] = useState("asc");
  const [idOut, setIdOut] = useState(null);
  const [unidade, setUnidade] = useState("TIO");
  const [loading, setLoading] = useState(false);
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
  const [pendenciaDetalhe, setPendenciaDetalhe] = useState(null);
  const [pendenciasAbertas, setPendenciasAbertas] = useState([]);
  const [pendenciasAbertasSYGO, setPendenciasAbertasSYGO] = useState([]);
  const [pendenciasFinalizadas, setPendenciasFinalizadas] = useState([]);
  const [pendenciasFinalizadasSYGO, setPendenciasFinalizadasSYGO] = useState(
    []
  );
  const [searchValue, setSearchValue] = useState("titulo");
  const [time, setTime] = useState(Date.now());

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 90000);
    if (
      modalDetalhe &&
      !modalNova &&
      modalAndam &&
      modalFechar &&
      modalEditar
    ) {
      loadPendencia();
      loadPendenciaSYGO();
      return () => {
        clearInterval(interval);
      };
    } else {
      return () => {
        clearInterval(interval);
      };
    }
  }, [time]);

  useEffect(() => {
    startIndex = currentPage * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    if (!isCheckedUni && !isCheckedManu) {
      setPendenciasabertaspag(
        pendenciasAbertas
          .filter((item) => item.tipo !== "Campanha de Manutenção")
          .slice(startIndex, endIndex)
      );
    } else if (isCheckedUni && !isCheckedManu) {
      setPendenciasabertaspag(
        pendenciasAbertasSYGO.slice(startIndex, endIndex)
      );
    } else {
      setPendenciasabertaspag(
        pendenciasAbertas
          .filter((item) => item.tipo === "Campanha de Manutenção")
          .slice(startIndex, endIndex)
      );
    }
  }, [
    currentPage,
    pendenciasAbertas,
    isCheckedUni,
    isCheckedManu,
    pendenciasAbertasSYGO,
    isChecked,
  ]);

  useEffect(() => {
    startIndex = currentPage * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    if (!isCheckedUni && !isCheckedManu) {
      setPendenciasfinalizadaspag(
        pendenciasFinalizadas
          .filter((item) => item.tipo !== "Campanha de Manutenção")
          .slice(startIndex, endIndex)
      );
    } else if (isCheckedUni && !isCheckedManu) {
      setPendenciasfinalizadaspag(
        pendenciasFinalizadasSYGO.slice(startIndex, endIndex)
      );
    } else {
      setPendenciasfinalizadaspag(
        pendenciasFinalizadas
          .filter((item) => item.tipo === "Campanha de Manutenção")
          .slice(startIndex, endIndex)
      );
    }
  }, [
    currentPage,
    pendenciasFinalizadas,
    isCheckedUni,
    isCheckedManu,
    pendenciasFinalizadasSYGO,
    isChecked,
  ]);

  useEffect(() => {
    const sorted = [...pendenciasAbertas].sort((a, b) =>
      a[col] > b[col] ? 1 : -1
    );
    setPendenciasAbertas(sorted);
  }, [!loading]);

  const loadPendencia = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/pendencias/get/openTIO");
      setPendencias(response.data);
      setTotalPages(
        Math.ceil(
          response.data.filter((item) => item.tipo !== "Campanha de Manutenção")
            .length / itemsPerPage
        )
      );
      setPendenciasAbertas(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPendenciaComplete = async () => {
    try {
      const response = await axiosPrivate.get("/pendencias/get/completeTIO");
      setPendenciasFinalizadas(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPendenciaSYGO = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/pendencias/get/openSYGO");
      setPendenciasAbertasSYGO(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPendenciaCompleteSYGO = async () => {
    try {
      const response = await axiosPrivate.get("/pendencias/get/completeSYGO");
      setPendenciasFinalizadasSYGO(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //seta a quantia de paginas
    if (isChecked && !isCheckedUni && !isCheckedManu) {
      //concluidas tio
      setTotalPages(
        Math.ceil(
          pendenciasFinalizadas.filter(
            (item) =>
              item.unidade === unidade && item.tipo !== "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    } else if (isChecked && isCheckedUni && !isCheckedManu) {
      //concluidas sygo
      setTotalPages(
        Math.ceil(
          pendenciasFinalizadasSYGO.filter(
            (item) =>
              item.unidade === unidade && item.tipo !== "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    } else if (!isChecked && !isCheckedUni && !isCheckedManu) {
      //abertas tio
      setTotalPages(
        Math.ceil(
          pendenciasAbertas.filter(
            (item) =>
              item.unidade === unidade && item.tipo !== "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    } else if (!isChecked && isCheckedUni && !isCheckedManu) {
      //abertas sygo
      setTotalPages(
        Math.ceil(
          pendenciasAbertasSYGO.filter(
            (item) =>
              item.unidade === unidade && item.tipo !== "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    } else if (!isChecked && isCheckedManu) {
      //abertas manu
      setTotalPages(
        Math.ceil(
          pendenciasAbertas.filter(
            (item) => item.tipo === "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    } else if (isChecked && isCheckedManu) {
      //concluidas manu
      setTotalPages(
        Math.ceil(
          pendenciasFinalizadas.filter(
            (item) => item.tipo === "Campanha de Manutenção"
          ).length / itemsPerPage
        )
      );
      setCurrentPage(0);
    }
  }, [!isChecked, isCheckedUni]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    if (!isChecked && !isCheckedUni) {
      if (query === "") {
        setPendenciasabertaspag(
          pendenciasAbertas
            .filter((item) => item.tipo !== "Campanha de Manutenção")
            .slice(startIndex, endIndex)
        );
        setCurrentPage(0);
      } else {
        setPendenciasabertaspag(
          [...pendenciasAbertas].filter((item) =>
            searchValue === "dateinit"
              ? item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "id"
              ? item[searchValue]
                  .toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "taskid"
              ? item?.[searchValue]
                  ?.toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase())
          )
        );
      }
    } else if (!isChecked && isCheckedUni) {
      if (query === "") {
        setPendenciasabertaspag(
          pendenciasAbertasSYGO.slice(startIndex, endIndex)
        );
        setCurrentPage(0);
      } else {
        setPendenciasabertaspag(
          [...pendenciasAbertasSYGO].filter((item) =>
            searchValue === "dateinit"
              ? item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "id"
              ? item[searchValue]
                  .toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "taskid"
              ? item?.[searchValue]
                  ?.toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase())
          )
        );
      }
    } else if (isChecked && !isCheckedUni) {
      if (query === "") {
        setPendenciasfinalizadaspag(
          pendenciasFinalizadas
            .filter((item) => item.tipo !== "Campanha de Manutenção")
            .slice(startIndex, endIndex)
        );
        setCurrentPage(0);
      } else {
        setPendenciasfinalizadaspag(
          [...pendenciasFinalizadas].filter((item) =>
            searchValue === "dateinit"
              ? item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "id"
              ? item[searchValue]
                  .toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "taskid"
              ? item?.[searchValue]
                  ?.toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase())
          )
        );
      }
    } else if (isChecked && isCheckedUni) {
      if (query === "") {
        setPendenciasfinalizadaspag(
          pendenciasFinalizadasSYGO.slice(startIndex, endIndex)
        );
        setCurrentPage(0);
      } else {
        setPendenciasfinalizadaspag(
          [...pendenciasFinalizadasSYGO].filter((item) =>
            searchValue === "dateinit"
              ? item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "id"
              ? item[searchValue]
                  .toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : searchValue === "taskid"
              ? item?.[searchValue]
                  ?.toString()
                  .includes(event.target.value.replace(/\//g, "-"))
              : item[searchValue]
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase())
          )
        );
      }
    }
  };

  function handleLogout() {
    const cookieName = "logged";
    const cookieName2 = "roles";
    const pastDate = new Date(0).toUTCString();
    document.cookie = `${cookieName}=; expires=${pastDate}; path=/`;
    document.cookie = `${cookieName2}=; expires=${pastDate}; path=/`;
    window.localStorage.removeItem("USER");
    const response = axios.get("/usuarios/logout");
    navigate("/login");
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-2 font-Inter text-[#ffffffde] cursor-default select-none font-bold">
          <p className="font-bold">Carregando pendências...</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 text-sm px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  const handleCheckboxChange = () => {
    //troca o valor entre pendencias concluidas e em andamento
    setIsChecked(!isChecked);
  };

  const handleCheckboxChangeUni = () => {
    //troca o valor entre unidades
    if (!isCheckedUni) {
      setUnidade("SYGO");
    } else setUnidade("TIO");
    setIsCheckedUni(!isCheckedUni);
    if (isCheckedManu) {
      setIsCheckedManu(false);
    }
  };

  const handleCheckboxChangeUni2 = (event) => {
    let uni = event.currentTarget.nextSibling.id;
    setUnidade(uni);
    setIsCheckedManu(false);
    if (uni === "TIO") {
      setIsCheckedUni(false);
    } else if (uni === "SYGO") {
      setIsCheckedUni(true);
    }
  };

  const handleCheckboxChangeManu = () => {
    //troca o valor entre unidades
    if (isCheckedUni) {
      handleCheckboxChangeUni();
    }
    setIsCheckedManu(!isCheckedManu);
  };

  function setarId(id) {
    //função usada pra enviar id para os componentes que precisa, modal editar, modal fechar e tabela de andamentos
    setIdOut(id);
    return idOut;
  }

  function clickEncerrarPendencia(event) {
    setModalFechar((current) => !current);
    if (modalFechar) {
      const idedit = event.currentTarget.dataset.id;
      setarId(idedit);
      if (!isCheckedUni) {
        let pendenciabyId = pendenciasAbertas.find(
          (pendencia) => pendencia.id == idedit
        );
        pendenciabyId = pendenciabyId.taskid;
        setPendenciaFechar(pendenciabyId);
      } else {
        let pendenciabyId = pendenciasAbertasSYGO.find(
          (pendencia) => pendencia.id == idedit
        );
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
      // const idedit = event.currentTarget.dataset.id; //seto o id primeiro numa variavel pra usar ele dentro do if ainda
      // setarId(idedit);
      if (!isCheckedUni) {
        // let pendenciabyId = pendenciasAbertas.find(
        //   (pendencia) => pendencia.id == idedit
        // ); //acho a pendencia pelo id
        event.dateatt = formataDataEdit(event.dateatt); //formatando pra preencher o campo datetime-local, tá bugando a hora que edita ele edita na tabela tb
        event.dateend = formataDataEdit(event.dateend);
        event.dateinit = formataDataEdit(event.dateinit);
        setPendenciaEdit(event); //passo a pendencia que encontrei com os values ja pra preencher o modal
      } else {
        // let pendenciabyId = pendenciasAbertasSYGO.find(
        //   (pendencia) => pendencia.id == idedit
        // );
        event.dateatt = formataDataEdit(event.dateatt);
        event.dateend = formataDataEdit(event.dateend);
        event.dateinit = formataDataEdit(event.dateinit);
        setPendenciaEdit(event);
      }
    } else {
      if (!isCheckedUni) {
        loadPendencia();
      } else {
        loadPendenciaSYGO();
      }
    }
    setModalEditar((current) => !current);
  }

  function clickAndamentoPendencia(event) {
    setModalAndam((current) => !current);
    if (modalAndam) {
      const id1 = event.currentTarget.dataset.id;
      setarId(id1);
      if (!isCheckedUni) {
        let pendenciabyId = pendenciasAbertas.find(
          (pendencia) => pendencia.id == id1
        );
        setPendenciaEdit(pendenciabyId);
      } else {
        let pendenciabyId = pendenciasAbertasSYGO.find(
          (pendencia) => pendencia.id == id1
        );
        setPendenciaEdit(pendenciabyId);
      }
    } else {
      if (!isCheckedUni) {
        loadPendencia();
      } else {
        loadPendenciaSYGO();
      }
    }
  }

  const clickNovaPendencia = () => {
    setModalNova((current) => !current);
    if (modalNova) {
      if (!isCheckedUni) {
        loadPendencia();
      } else {
        loadPendenciaSYGO();
      }
    }
  };

  const clickDetalhePendencia = (event) => {
    if (modalDetalhe && !isChecked) {
      const idedit = event.currentTarget.dataset.id;
      setarId(idedit);
      if (!isCheckedUni) {
        let pendenciabyId = pendencias.find(
          (pendencia) => pendencia.id == idedit
        );
        setPendenciaDetalhe(pendenciabyId);
      } else {
        let pendenciabyId = pendenciasAbertasSYGO.find(
          (pendencia) => pendencia.id == idedit
        );
        setPendenciaDetalhe(pendenciabyId);
      }
    } else if (modalDetalhe && isChecked) {
      const idedit = event.currentTarget.dataset.id;
      setarId(idedit);
      if (!isCheckedUni) {
        let pendenciabyId = pendenciasFinalizadas.find(
          (pendencia) => pendencia.id == idedit
        );
        setPendenciaDetalhe(pendenciabyId);
      } else {
        let pendenciabyId = pendenciasFinalizadasSYGO.find(
          (pendencia) => pendencia.id == idedit
        );
        setPendenciaDetalhe(pendenciabyId);
      }
    } else if (!modalDetalhe && !isChecked && !isCheckedUni) {
      loadPendencia();
    } else if (!modalDetalhe && !isChecked && isCheckedUni) {
      loadPendenciaSYGO();
    }
    setModalDetalhe((current) => !current);
  };

  function formataData(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    return date.format("YYYY/MM/DD HH:mm");
  }

  function formataDataEdit(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    return date.format("YYYY-MM-DD HH:mm");
  }

  function dataAviso(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    date = date.isBefore(moment().tz("America/Sao_Paulo"));
    return date;
  }

  function AvisoManuHeaderURG() {
    const sap = pendenciasAbertas
      .filter((item) => item.tipo === "Campanha de Manutenção")
      .map((item) => dataAviso(item.dateend));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  function AvisoManuHeader() {
    const sap = pendenciasAbertas
      .filter((item) => item.tipo === "Campanha de Manutenção")
      .map((item) => dataAviso(item.dateatt));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  function AvisoTIOurg() {
    const sap = pendenciasAbertas
      .filter((item) => item.tipo !== "Campanha de Manutenção")
      .map((item) => dataAviso(item.dateend));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  function AvisoTIO() {
    const sap = pendenciasAbertas
      .filter((item) => item.tipo !== "Campanha de Manutenção")
      .map((item) => dataAviso(item.dateatt));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  function AvisoSYGO() {
    const sap = pendenciasAbertasSYGO.map((item) => dataAviso(item.dateatt));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  function AvisoSYGOURG() {
    const sap = pendenciasAbertasSYGO.map((item) => dataAviso(item.dateend));
    if (sap.some((item) => item === true)) {
      return true;
    } else {
      return false;
    }
  }

  const sorting = (col) => {
    if (!isChecked && !isCheckedUni) {
      if (order === "asc") {
        const sorted = [...pendenciasAbertas].sort((a, b) =>
          a[col] > b[col] ? 1 : -1
        );
        setPendenciasAbertas(sorted);
        setCol(col);
        setOrder("dsc");
      }
      if (order === "dsc") {
        const sorted = [...pendenciasAbertas].sort((a, b) =>
          a[col] < b[col] ? 1 : -1
        );
        setPendenciasAbertas(sorted);
        setCol(col);
        setOrder("asc");
      }
    } else if (isChecked && !isCheckedUni) {
      if (order === "asc") {
        const sorted = [...pendenciasFinalizadas].sort((a, b) =>
          a[col] > b[col] ? 1 : -1
        );
        setPendenciasFinalizadas(sorted);
        setCol(col);
        setOrder("dsc");
      }
      if (order === "dsc") {
        const sorted = [...pendenciasFinalizadas].sort((a, b) =>
          a[col] < b[col] ? 1 : -1
        );
        setPendenciasFinalizadas(sorted);
        setCol(col);
        setOrder("asc");
      }
    } else if (!isChecked && isCheckedUni) {
      if (order === "asc") {
        const sorted = [...pendenciasAbertasSYGO].sort((a, b) =>
          a[col] > b[col] ? 1 : -1
        );
        setPendenciasAbertasSYGO(sorted);
        setCol(col);
        setOrder("dsc");
      }
      if (order === "dsc") {
        const sorted = [...pendenciasAbertasSYGO].sort((a, b) =>
          a[col] < b[col] ? 1 : -1
        );
        setPendenciasAbertasSYGO(sorted);
        setCol(col);
        setOrder("asc");
      }
    } else if (isChecked && isCheckedUni) {
      if (order === "asc") {
        const sorted = [...pendenciasFinalizadasSYGO].sort((a, b) =>
          a[col] > b[col] ? 1 : -1
        );
        setPendenciasFinalizadasSYGO(sorted);
        setCol(col);
        setOrder("dsc");
      }
      if (order === "dsc") {
        const sorted = [...pendenciasFinalizadasSYGO].sort((a, b) =>
          a[col] < b[col] ? 1 : -1
        );
        setPendenciasFinalizadasSYGO(sorted);
        setCol(col);
        setOrder("asc");
      }
    }
  };

  return (
    <>
      <nav className=" select-none flex flex-row justify-between max-h-10 px-2 py-2 text-sm text-[#ffffffde] bg-gradient-to-b from-[#212121]">
        <div className="text-[#ffffffde] flex">
          <label className="mb-1 py-3 relative inline-flex cursor-default select-none items-center justify-center rounded-l-md bg-[#343434] p-[3px] pr-0">
            <input
              type="button"
              className="sr-only"
              onClick={handleCheckboxChangeUni2}
            />
            <span
              id="TIO"
              className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${
                !isCheckedUni && !isCheckedManu
                  ? "bg-[#242424]"
                  : "hover:bg-[#292929]"
              } transition-all`}
            >
              MON-SC
              {AvisoTIO() ? (
                <PiWarningFill className="ml-1 mr-0 text-yellow-500" />
              ) : null}
              {AvisoTIOurg() ? (
                <PiWarningOctagonFill className="ml-1 mr-0 text-red-500" />
              ) : null}
            </span>
          </label>
          <label className="mb-1 py-3 relative inline-flex cursor-default select-none items-center justify-center bg-[#343434] p-[3px] pl-0">
            <input
              type="button"
              className="sr-only"
              onClick={handleCheckboxChangeUni2}
            />
            <span
              id="SYGO"
              className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${
                isCheckedUni && !isCheckedManu
                  ? "bg-[#242424]"
                  : "hover:bg-[#292929]"
              } transition-all`}
            >
              MON-RS
              {AvisoSYGO() ? (
                <PiWarningFill className="ml-1 mr-0 text-yellow-500" />
              ) : null}
              {AvisoSYGOURG() ? (
                <PiWarningOctagonFill className="ml-1 mr-0 text-red-500" />
              ) : null}
            </span>
          </label>
          <label className="mb-1 py-3 relative inline-flex cursor-default select-none items-center justify-center rounded-r-md bg-[#343434] p-[3px] pl-0 ">
            <input
              className="sr-only"
              id="manutencao"
              type="checkbox"
              onChange={handleCheckboxChangeManu}
              checked={isCheckedManu}
            />
            <span
              className={`flex items-center space-x-[6px] rounded pl-[14px] pr-[8px] text-sm font-medium ${
                isCheckedManu ? "bg-[#242424]" : "hover:bg-[#292929]"
              } transition-all`}
            >
              Manutenções Programadas
              {AvisoManuHeader() ? (
                <PiWarningFill className="ml-1 text-yellow-500" />
              ) : null}
              {AvisoManuHeaderURG() ? (
                <PiWarningOctagonFill className="ml-1 mr-0 text-red-500" />
              ) : null}
            </span>
          </label>
        </div>
        <div className="ml-auto w-3/5">
          <input
            id="search"
            placeholder="Procurar Pendência"
            className="pl-1 rounded-l bg-[#343434] hover:bg-[#1b1b1b] w-2/4 transition focus:outline-none focus:bg-[#1b1b1b]"
            onChange={handleSearch}
            type="text"
          />
          <select
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="text-[#9CA3AF] pl-1 rounded-r bg-[#343434] hover:bg-[#1b1b1b] transition focus:outline-none focus:bg-[#1b1b1b] text-center"
            id="search"
          >
            <option value="titulo">&#8595; Título</option>
            <option value="id">ID Pendência</option>
            <option value="tipo">Tipo</option>
            <option value="responsavel">Responsável</option>
            <option value="dateinit">Início</option>
            <option value="taskid">ID Eng</option>
          </select>
        </div>
        <a
          onClick={clickNovaPendencia}
          className="flex font-system font-medium cursor-default bg-[#343434] hover:bg-[#1b1b1b] transition py-[1px] px-[10px] rounded-md "
        >
          <AiOutlinePlus className="mr-1 mt-1 cursor-pointer" /> Nova Pendência
        </a>
      </nav>
      <div className="text-[#ffffffde] flex w-full p-2">
        {!isChecked ? (
          <table className="font-Inter w-full">
            <thead className="text-left border-b-2 border-[#292929]">
              <tr className="cursor-default select-none">
                <th>Id</th>
                <th>Título</th>
                <th onClick={() => sorting("tipo")}>
                  <div className="flex">
                    Tipo
                    {col === "tipo" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "tipo" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th onClick={() => sorting("responsavel")}>
                  <div className="flex">
                    Responsável
                    {col === "responsavel" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "responsavel" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th className="flex" onClick={() => sorting("dateinit")}>
                  Início
                  {col === "dateinit" && order === "asc" ? (
                    <FaSortUp className="mt-1" />
                  ) : null}
                  {col === "dateinit" && order === "dsc" ? (
                    <FaSortDown className="mt-1" />
                  ) : null}
                </th>
                <th onClick={() => sorting("dateend")}>
                  <div className="flex">
                    Previsão
                    {col === "dateend" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "dateend" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th className="flex" onClick={() => sorting("dateatt")}>
                  Atualizar em
                  {col === "dateatt" && order === "asc" ? (
                    <FaSortUp className="mt-1" />
                  ) : null}
                  {col === "dateatt" && order === "dsc" ? (
                    <FaSortDown className="mt-1" />
                  ) : null}
                </th>
                <th>ID Eng</th>
                <th>Incidente</th>
              </tr>
            </thead>
            <tbody>
              {pendenciasabertaspag
                .filter((item) => item.unidade === unidade)
                .map((item) => (
                  <tr
                    className="font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6"
                    key={item.id}
                  >
                    <td data-id={item.id}>
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText(item.id);
                        }}
                        className="font-bold hover:text-[#aaaaaa] transition-all select-none"
                      >
                        {item.id}
                      </div>
                    </td>
                    <td
                      data-id={item.id}
                      onClick={clickDetalhePendencia}
                      className="flex justify-between"
                    >
                      {item.titulo}
                      {item.massiva ? (
                        <div className="rounded-sm bg-yellow-500 h-4 my-auto font-semibold leading-3 px-1 mr-1 text-black">
                          Aviso Massiva
                        </div>
                      ) : null}
                    </td>
                    <td data-id={item.id} onClick={clickDetalhePendencia}>
                      {item.tipo}
                    </td>
                    <td data-id={item.id} onClick={clickDetalhePendencia}>
                      {item.responsavel}
                    </td>
                    <td data-id={item.id} onClick={clickDetalhePendencia}>
                      {formataData(item.dateinit)}
                    </td>
                    <td data-id={item.id} onClick={clickDetalhePendencia}>
                      <div className="flex">
                        {formataData(item.dateend)}
                        {dataAviso(item.dateend) ? (
                          <PiWarningOctagonFill className="mt-1 ml-1 text-red-500" />
                        ) : null}
                      </div>
                    </td>
                    <td
                      data-id={item.id}
                      className="flex"
                      onClick={clickDetalhePendencia}
                    >
                      {formataData(item.dateatt)}
                      {dataAviso(item.dateatt) ? (
                        <PiWarningFill className="mt-1 ml-1 text-yellow-500" />
                      ) : null}
                    </td>
                    <td>
                      {item.taskid ? (
                        <div className="flex">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.taskid);
                            }}
                            className="flex hover:text-[#aaaaaa]"
                          >
                            <BsClipboard className="mt-1 mr-1" />
                          </div>
                          <a
                            className="underline hover:text-[#aaaaaa]"
                            href={
                              "http://engenharia.redeunifique.com.br/umov/gerencia_tarefa/?id_atividade=" +
                              item.taskid
                            }
                            target="_blank"
                          >
                            {item.taskid}
                          </a>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {item.incidenturl ? (
                        <a
                          className="underline hover:text-[#aaaaaa]"
                          href={item.incidenturl}
                          target="_blank"
                        >
                          Incidente
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <table className="font-Inter w-full">
            <thead className="text-left border-b-2 border-[#292929]">
              <tr className="cursor-default select-none">
                <th>Id</th>
                <th>Título</th>
                <th onClick={() => sorting("tipo")}>
                  <div className="flex">
                    Tipo
                    {col === "tipo" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "tipo" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th onClick={() => sorting("responsavel")}>
                  <div className="flex">
                    Responsável
                    {col === "responsavel" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "responsavel" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th className="flex" onClick={() => sorting("dateinit")}>
                  Início
                  {col === "dateinit" && order === "asc" ? (
                    <FaSortUp className="mt-1" />
                  ) : null}
                  {col === "dateinit" && order === "dsc" ? (
                    <FaSortDown className="mt-1" />
                  ) : null}
                </th>
                <th onClick={() => sorting("dateend")}>
                  <div className="flex">
                    Fim
                    {col === "dateend" && order === "asc" ? (
                      <FaSortUp className="mt-1" />
                    ) : null}
                    {col === "dateend" && order === "dsc" ? (
                      <FaSortDown className="mt-1" />
                    ) : null}
                  </div>
                </th>
                <th>ID Eng</th>
                <th>Incidente</th>
              </tr>
            </thead>
            <tbody>
              {isCheckedUni
                ? pendenciasfinalizadaspag.map((item) => (
                    <tr
                      className="font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6"
                      key={item.id}
                    >
                      <td data-id={item.id}>
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(item.id);
                          }}
                          className="font-bold hover:text-[#aaaaaa] transition-all select-none"
                        >
                          {item.id}
                        </div>
                      </td>
                      <td
                        data-id={item.id}
                        onClick={clickDetalhePendencia}
                        className="flex justify-between"
                      >
                        {item.titulo}
                        {item.massiva ? (
                          <div className="rounded-sm bg-yellow-500 h-4 my-auto font-semibold leading-3 px-1 mr-1 text-black">
                            Aviso Massiva
                          </div>
                        ) : null}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {item.tipo}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {item.responsavel}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {formataData(item.dateinit)}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {formataData(item.dateend)}
                      </td>
                      <td>
                        {item.taskid ? (
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.taskid);
                            }}
                            className="flex hover:text-[#aaaaaa]"
                          >
                            <BsClipboard className="mt-1 mr-1" />
                            {item.taskid}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        {item.incidenturl ? (
                          <a
                            className="underline hover:text-[#aaaaaa]"
                            href={item.incidenturl}
                            target="_blank"
                          >
                            Incidente
                          </a>
                        ) : null}
                      </td>
                      <td className="pr-0">
                        <div className="flex flex-row pr-0">
                          <a
                            data-id={item.id}
                            className={`cursor-default ${
                              item.andamento.length > 0
                                ? "hover:text-[#aaaaaa]"
                                : "text-[#666666]"
                            }`}
                          >
                            <BiCommentDetail />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                : pendenciasfinalizadaspag.map((item) => (
                    <tr
                      className="font-system text-sm hover:bg-[#12121266] transition-all cursor-default leading-6"
                      key={item.id}
                    >
                      <td data-id={item.id}>
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(item.id);
                          }}
                          className="font-bold hover:text-[#aaaaaa] transition-all select-none"
                        >
                          {item.id}
                        </div>
                      </td>
                      <td
                        data-id={item.id}
                        onClick={clickDetalhePendencia}
                        className="flex justify-between"
                      >
                        {item.titulo}
                        {item.massiva ? (
                          <div className="rounded-sm bg-yellow-500 h-4 my-auto font-semibold leading-3 px-1 mr-1 text-black">
                            Aviso Massiva
                          </div>
                        ) : null}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {item.tipo}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {item.responsavel}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {formataData(item.dateinit)}
                      </td>
                      <td data-id={item.id} onClick={clickDetalhePendencia}>
                        {formataData(item.dateend)}
                      </td>
                      <td>
                        {item.taskid ? (
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.taskid);
                            }}
                            className="flex hover:text-[#aaaaaa]"
                          >
                            <BsClipboard className="mt-1 mr-1" />
                            {item.taskid}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        {item.incidenturl ? (
                          <a
                            className="underline hover:text-[#aaaaaa]"
                            href={item.incidenturl}
                            target="_blank"
                          >
                            Incidente
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className="text-[#ffffffde] flex justify-between font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0 pb-0">
        <label className="mb-1 ml-1 relative inline-flex cursor-default select-none items-center justify-center rounded-md bg-[#343434] p-[3px] ">
          <input
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span
            className={`flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${
              !isChecked ? "bg-[#242424]" : "hover:bg-[#292929]"
            } transition-all`}
          >
            Em Andamento
          </span>
          <span
            className={` flex items-center space-x-[6px] rounded px-[14px] text-sm font-medium ${
              isChecked ? "bg-[#242424]" : " hover:bg-[#292929]"
            } transition-all`}
          >
            Concluídas
          </span>
        </label>
        <div className="m-auto  block">
          <ReactPaginate
            className="flex flex-row bg-[#343434] rounded-md"
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            previousLabel={"<"}
            previousClassName="hover:bg-[#292929] transition-all rounded w-[15px]"
            previousLinkClassName="cursor-default"
            nextLinkClassName={"cursor-default w-full"}
            nextLabel={">"}
            nextClassName="hover:bg-[#292929] transition-all rounded w-[15px]"
            pageLinkClassName="cursor-default"
            pageClassName="mx-1 hover:bg-[#292929] transition-all rounded"
            activeClassName="bg-[#242424]"
            breakLabel="..."
            pageRangeDisplayed={5}
          />
        </div>
        <div className="p-9 py-0"></div>
        <FaQuestion
          className="mb-1 mr-2 mt-1 float-right cursor-help"
          title="Bugs ou sugestões mattermost @kroluiz"
        />
        <button
          className="mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
        <Link
          className="mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md"
          to="/gerencia"
        >
          Gerência
        </Link>
      </footer>
      <div>
        {modalNova ? (
          <ModalNovaPendencia
            fecharModal={clickNovaPendencia}
            Unidade={isCheckedUni ? "SYGO" : "TIO"}
          />
        ) : null}
        {!modalFechar ? (
          <ModalFecharPendencia
            closeModal={clickEncerrarPendencia}
            id={idOut}
            idtask={pendenciaFechar}
          />
        ) : null}
        {!modalEditar ? (
          <ModalEditPendencia
            fecharModal={clickEditarPendencia}
            penden={pendenciaEdit}
          />
        ) : null}
        {!modalAndam ? (
          <ModalAndamento
            penden={pendenciaEdit}
            closeModal={clickAndamentoPendencia}
            id={idOut}
          />
        ) : null}
        {!modalDetalhe ? (
          <ModalDetalhePendencia
            fecharModal={clickDetalhePendencia}
            penden={pendenciaDetalhe}
            closePend={clickEncerrarPendencia}
            editPend={clickEditarPendencia}
          />
        ) : null}
      </div>
    </>
  );
}

export default Tabela;
