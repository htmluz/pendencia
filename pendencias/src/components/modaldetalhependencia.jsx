import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment-timezone";

function ModalDetalhePendencia({ fecharModal, penden, closePend, editPend }) {
  const [formData, setFormData] = useState({
    andamento: {
      user: "",
      andamento: "",
    },
  });
  const axiosPrivate = useAxiosPrivate();

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

  function formataData(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    return date.format("YYYY/MM/DD HH:mm");
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, andamento: { [name]: value } });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    formData.andamento.user = window.localStorage.getItem("USER");
    try {
      const response = await axiosPrivate.put(
        `/pendencias/andamento/${penden.id}`,
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
  }

  function incidente(url) {
    url = url.match(/(\d+)/g);
    return url;
  }

  function formataBR(andam) {
    return andam.replace(/\n/g, "<br/>");
  }

  return (
    <div className="fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000">
      <div
        className="
        w-3/4 
        mt-20 
        ml-auto 
        mr-auto 
        rounded 
        p-4
        pb-6 
        shadow-modal 
        max-h-[794px] 
        overflow-auto
        bg-white 
      "
      >
        <div className="relative flex flex-col w-full pointer-events-auto p-5 pb-1">
          <div
            className="
            font-Inter 
            font-bold 
            text-lg 
            flex 
            justify-between 
            align-top 
            text-right 
            border-b-2 
            pb-3 
            border-[#efefef]
          "
          >
            <h5>Detalhes da Pendência</h5>
            <button
              onClick={fecharModal}
              className="hover:text-[15px] transition-all"
              type="button"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
        <div className="p-5 pt-3 pb-3">
          <h1 className="font-Inter font-bold text-lg">{penden.titulo}</h1>
          <div className="w-full flex flex-row col-span-2">
            <div className="w-1/3 text-sm">
              <p className="text-sm mb-0">
                <b>Id: </b>
                {penden.id}
              </p>
              <p className="text-sm mb-0 break-words">
                <b>Descrição:</b> {penden.desc ? penden.desc : `Sem descrição`}
              </p>
              <p className="text-sm mb-0">
                <b>Tipo:</b> {penden.tipo}
              </p>
              <p className="text-sm mb-0">
                <b>Responsável:</b> {penden.responsavel}
              </p>
              <p>
                <b>ID Eng:</b> {penden.taskid}
              </p>
            </div>
            <div className="w-1/3 text-sm">
              <p>
                <b>Início:</b> {formataData(penden.dateinit)}
              </p>
              <p>
                <b>Previsão:</b> {formataData(penden.dateatt)}
              </p>
              <p>
                <b>Término:</b> {formataData(penden.dateend)}
              </p>
              <p>
                <b>Incidente:</b>{" "}
                {penden.incidenturl ? (
                  <a
                    className="underline hover:text-[#777777] transition-colors"
                    target="blank"
                    href={penden.incidenturl}
                  >
                    {incidente(penden.incidenturl)}
                  </a>
                ) : null}
              </p>
            </div>
            <div className="w-1/3 text-sm">
              <p>
                <b>Abertura:</b> {penden.abertura.user}
              </p>
              <p>
                <b>Horário de Abertura:</b>{" "}
                {formataData(penden.abertura.dateopening)}
              </p>
              <p>
                <b>Fechamento:</b> {penden?.fechamento?.user}
              </p>
              <p>
                <b>Horário de Fechamento:</b>{" "}
                {penden.fechamento.dateclosening
                  ? formataData(penden?.fechamento?.dateclosening)
                  : null}
              </p>
            </div>
          </div>
          <div className="flex justify-between ">
            <button
              onClick={() => {
                fecharModal();
                closePend();
              }}
              className="
                font-Inter 
                cursor-default 
                transition-colors 
                disabled:cursor-not-allowed 
                rounded 
                mt-3
                px-3 
                py-2 
                w-48p 
                font-semibold 
                bg-[#ff2c2c] 
                hover:bg-[#de0a26] 
                text-white 
                disabled:bg-[#dddddd] 
              "
              disabled={penden.complete}
            >
              Encerrar Pendência
            </button>
            <button
              data-id={penden.id}
              onClick={() => {
                fecharModal();
                editPend(penden);
              }}
              className="
                font-Inter 
                cursor-default 
                transition-colors 
                disabled:cursor-not-allowed 
                rounded 
                mt-3
                px-3 
                py-2 
                w-48p 
                font-semibold 
                disabled:bg-[#dddddd]
                bg-[#187bcd] 
                hover:bg-[#1167b1]
                text-white 
              "
              disabled={penden.complete}
            >
              Editar Pendência
            </button>
          </div>
        </div>
        {penden.andamento.length > 0 ? (
          <div className="flex flex-col p-5 pt-5 pb-0">
            <h1 className="font-Inter font-bold mb-2 ">Andamentos: </h1>
            {penden.andamento.map((andamento) => (
              <div>
                <div className=" border-t-2 border-[#efefef] cursor-default">
                  <div className="flex">
                    <p className="font-system font-bold italic mt-1">
                      {andamento.user}
                    </p>
                    <p className="text-[11px] font-Inter italic select-none mt-3 ml-3">
                      {formataData(andamento.dateandamento)}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className="font-system leading-5 break-all mb-2"
                    dangerouslySetInnerHTML={{
                      __html: formataBR(andamento.andamento).replace(
                        /((http|https):\/\/[^\s]+)/g,
                        '<a class="underline text-[#187bcd]" href="$1" target="_blank">$1</a>'
                      ),
                    }}
                  ></p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="p-5 pt-0">
          <form
            method="PUT"
            onSubmit={handleSubmit}
            className="font-system font-semibold"
            encType="multipart/form-data"
          >
            <h5 className="font-Inter font-bold text-lg select-none cursor-default mt-1">
              Novo Andamento
            </h5>
            <div className="pb-1 font-system select-none">
              <textarea
                required
                id="andamento"
                rows="4"
                onChange={handleInputChange}
                name="andamento"
                type="text"
                className="
                  font-normal 
                  p-2 
                  mt-2 
                  transition-colors 
                  focus:outline-none 
                  leading-6 
                  rounded 
                  w-full
                  focus:bg-[#dddddd] 
                  bg-[#efefef] 
                "
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="
                  cursor-default 
                  transition-colors  
                  rounded 
                  px-3 
                  py-2 
                  w-full 
                  bg-[#187bcd] 
                  hover:bg-[#1167b1] 
                  text-white
                "
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhePendencia;
