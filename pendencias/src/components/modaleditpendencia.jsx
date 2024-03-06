import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import moment from "moment-timezone";

//TODO: botão alternar unidade
function ModalEditPendencia({ fecharModal, penden }) {
  const [formData, setFormData] = useState({
    titulo: penden.titulo,
    desc: penden.desc,
    tipo: penden.tipo,
    responsavel: penden.responsavel,
    dateinit: penden.dateinit,
    dateend: penden.dateend,
    dateatt: penden.dateatt,
    taskid: penden.taskid,
    incidenturl: penden.incidenturl,
    abertura: {
      user: penden.abertura.user,
    },
    fechamento: {
      user: penden.fechamento.user,
    },
    massiva: penden.massiva,
    unidade: penden.unidade,
  });
  const [tipos, setTipos] = useState();
  const axiosPrivate = useAxiosPrivate();
  const agr = Date.now();
  const [isChecked, setIsChecked] = useState(formData.unidade === "SYGO");

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const getTipos = async () => {
      try {
        const response = await axiosPrivate.get("/tipos/get", {
          signal: controller.signal,
        });
        isMounted && setTipos(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTipos();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const keypress = (e) => {
      if (e.key === "Escape") {
        fecharModal();
      }
    };

    window.addEventListener("keydown", keypress);
    return () => {
      window.removeEventListener("keydown", keypress);
    };
  }, [fecharModal]);

  useEffect(() => {
    setIsChecked(formData.unidade === "SYGO");
  }, [formData.unidade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(
        `/pendencias/edit/${penden.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fecharModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleUniChange = () => {
    if (formData.unidade === "SYGO") {
      setFormData({ ...formData, unidade: "TIO" });
    } else {
      setFormData({ ...formData, unidade: "SYGO" });
    }
  };

  function formataData(date) {
    date = moment(date);
    date.add(6, "hours");
    date.tz("America/Sao_Paulo");
    return date.format("YYYY-MM-DDTHH:mm");
  }

  return (
    <div className="fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000">
      <div className="bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-4 pb-0 shadow-modal">
        <div className="relative flex flex-col w-full pointer-events-auto p-5 pb-8">
          <div className="font-Inter font-bold text-lg flex justify-between align-top text-right mb-2 border-b-2 pb-3 border-[#efefef]">
            <h5>Editar Pendência</h5>
            <button
              onClick={fecharModal}
              className="hover:text-[15px] transition-all"
              type="button"
            >
              <AiOutlineClose />
            </button>
          </div>
          <form method="PUT" onSubmit={handleSubmit}>
            <div className="flex flex-col space-between font-system font-semibold">
              <div className="py-2">
                <label className="" htmlFor="titulo">
                  Título:
                  <input
                    required
                    value={formData.titulo}
                    onChange={handleInputChange}
                    id="titulo"
                    name="titulo"
                    maxLength="120"
                    type="text"
                    className="font-normal px-2font-normal px-2  transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                  />
                </label>
              </div>
              <div className="py-2">
                <label htmlFor="desc">
                  Descrição:
                  <input
                    value={formData.desc}
                    onChange={handleInputChange}
                    id="desc"
                    name="desc"
                    type="text"
                    className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                  />
                </label>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-48p mr-auto">
                  <label htmlFor="tipo">
                    Tipo de Pendência:
                    <select
                      required
                      value={formData.tipo}
                      onChange={handleInputChange}
                      id="tipo"
                      name="tipo"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    >
                      <option value=""></option>
                      {tipos &&
                        tipos.map((tipo, i) => (
                          <option key={i} value={tipo.tipo}>
                            {tipo.tipo}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className=" w-48p">
                  <label htmlFor="responsavel">
                    Responsável:
                    <input
                      required
                      value={formData.responsavel}
                      onChange={handleInputChange}
                      id="responsavel"
                      name="responsavel"
                      type="text"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-48p mr-auto">
                  <label htmlFor="taskid">
                    ID Eng:
                    <input
                      value={formData.taskid}
                      onChange={handleInputChange}
                      id="taskid"
                      name="taskid"
                      type="number"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
                <div className=" w-48p">
                  <label htmlFor="incidenturl">
                    Incidente:
                    <input
                      value={formData.incidenturl}
                      onChange={handleInputChange}
                      id="incidenturl"
                      name="incidenturl"
                      type="text"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-30p mr-auto">
                  <label htmlFor="dateinit">
                    Data/hora de Início:
                    <input
                      required
                      value={formData.dateinit}
                      onChange={handleInputChange}
                      id="dateinit"
                      name="dateinit"
                      type="datetime-local"
                      min="2023-01-01T00:00"
                      max="2666-01-01T00:00"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
                <div className="w-30p mr-auto">
                  <label htmlFor="dateatt">
                    Atualizar em:
                    <input
                      required
                      value={formData.dateatt}
                      onChange={handleInputChange}
                      id="dateatt"
                      name="dateatt"
                      type="datetime-local"
                      min="2023-01-01T00:00"
                      max={
                        formData.massiva ? formataData(agr) : "2666-01-01T00:00"
                      }
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
                <div className="w-30p">
                  <label htmlFor="dateend">
                    Previsão:
                    <input
                      required
                      value={formData.dateend}
                      onChange={handleInputChange}
                      id="dateend"
                      name="dateend"
                      type="datetime-local"
                      min="2023-01-01T00:00"
                      max="2666-01-01T00:00"
                      className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-center w-90% py-2 border-b-2 border-[#efefef] pb-3">
                <div className="ml-10 flex">
                  <input
                    value={formData.massiva}
                    onChange={handleInputChange}
                    type="checkbox"
                    checked={formData.massiva}
                    className="peer mt-1 mr-2 w-4 h-4 rounded focus:ring-0 bg-[#efefef] checked:bg-[#dddddd] appearance-none transition-all"
                    name="massiva"
                    id="massiva"
                  />
                  <label htmlFor="massiva" className="select-none">
                    Aviso Massivas?
                  </label>
                  <svg
                    className="absolute w-4 h-4 mt-1 opacity-0 peer-checked:opacity-100 block pointer-events-none transition-opacity duration-200 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <label
                    className=" ml-10 inline-block pr-[0.15rem]"
                    htmlFor="flexswitch"
                  >
                    MON-SC
                  </label>
                  <input
                    className="ml-2 mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexswitch"
                    onChange={handleUniChange}
                    checked={isChecked}
                  />
                  <label
                    className="inline-block pl-[0.15rem]"
                    htmlFor="flexswitch"
                  >
                    MON-RS
                  </label>
                </div>
              </div>
              <div className="flex mt-6">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="transition-colors mr-auto bg-[#efefef] hover:bg-[#dddddd] rounded px-3 py-2 w-48p"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="transition-colors  bg-[#187bcd] hover:bg-[#1167b1] rounded px-3 py-2 w-48p text-white"
                >
                  Enviar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditPendencia;
