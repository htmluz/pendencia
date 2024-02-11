import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
// import { axiosBitrix } from "../api/bitrix";
import moment from "moment-timezone";

function ModalFecharPendencia({ closeModal, id, idtask }) {
  const [formData, setFormData] = useState({
    fechamento: {
      user: "",
      dateclosening: moment().format("YYYY-MM-DD HH:mm"),
    },
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const keypress = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", keypress);
    return () => {
      window.removeEventListener("keydown", keypress);
    };
  }, [closeModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, fechamento: { [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.fechamento.user = window.localStorage.getItem("USER");
    try {
      const response = await axiosPrivate.put(
        `/pendencias/complete/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed text-black bg-[#00000080] top-0 left-0 w-full h-full z-1000">
      <div className="bg-white w-1/4 mt-20 ml-auto mr-auto rounded p-4 pb-0 shadow-modal">
        <div className="relative flex flex-col w-full pointer-events-auto p-5 pb-8">
          <div className="font-Inter font-bold text-lg flex justify-between align-top text-right mb-2 pb-2">
            <h5 className=" select-none cursor-default">Encerrar Pendência</h5>
            <button
              onClick={closeModal}
              className="  hover:text-[15px] transition-all"
              type="button"
            >
              <AiOutlineClose />
            </button>
          </div>
          <form
            method="PUT"
            onSubmit={handleSubmit}
            className="font-system font-semibold"
          >
            <div className=" pb-3">
              <input
                required
                id="dateclosening"
                value={formData.fechamento.dateclosening}
                onChange={handleInputChange}
                min="2023-01-01T00:00"
                max="2666-01-01T00:00"
                name="dateclosening"
                type="datetime-local"
                className="font-normal px-2 mt-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="cursor-default transition-colors  bg-[#187bcd] hover:bg-[#1167b1] rounded px-3 py-2 w-full text-white"
              >
                Encerrar Pendência
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalFecharPendencia;
