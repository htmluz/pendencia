import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";

function ModalNovoTipo({ fecharModal }) {
  const [formData, setFormData] = useState({
    tipo: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const svalue = value.replace(/\s+$/g, "");
    setFormData({ ...formData, [name]: svalue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("/tipos/new", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fecharModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed text-black bg-[#00000080] top-0 left-0 w-full h-full z-1000">
      <div className="bg-white w-1/4 mt-20 ml-auto mr-auto rounded p-4 pb-0 shadow-modal">
        <div className="relative flex flex-col w-full pointer-events-auto p-5 pb-8">
          <div className="font-Inter font-bold text-lg flex justify-between align-top text-right mb-2 pb-2">
            <h5 className=" select-none cursor-default">
              Novo Tipo de Pendência
            </h5>
            <button
              onClick={fecharModal}
              className="  hover:text-[15px] transition-all"
              type="button"
            >
              <AiOutlineClose />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="font-system font-semibold"
            method="POST"
          >
            <div className=" pb-3">
              <input
                required
                id="tipo"
                onChange={handleInputChange}
                name="tipo"
                type="text"
                className="font-normal px-2 mt-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
              />
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="cursor-default transition-colors  bg-[#187bcd] hover:bg-[#1167b1] rounded px-3 py-2 w-full text-white"
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

export default ModalNovoTipo;
