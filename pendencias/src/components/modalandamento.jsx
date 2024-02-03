import React, { useState } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment-timezone";

function ModalAndamento({ closeModal, id, penden }) {
  const [formData, setFormData] = useState({
    user: "",
    andamento: "",
    files: [],
  });
  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFormData({ ...formData, files: [...formData.files, ...filesArray] });
  };

  const renderFiles = (paths) => {
    return (
      <div className="flex ">
        {paths.map((files, index) => (
          <React.Fragment key={index}>
            {isImage(files) ? (
              <img
                src={`http://localhost:3001/pendencias/imgs/${getFileName(
                  files
                )}`}
                className="object-contain mx-auto w-[500px] h-[100px]"
              />
            ) : (
              <a>Arquivos</a>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getFileName = (path) => {
    const fileName = path.split("\\").pop();
    const lower = fileName.toLowerCase();
    return lower;
  };

  const isImage = (path) => {
    const imgext = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    const lowerpath = path.toLowerCase();
    return imgext.some((ext) => lowerpath.endsWith(ext));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.user = window.localStorage.getItem("USER");

    const form = new FormData();
    form.append("user", formData.user);
    form.append("andamento", formData.andamento);
    for (let i = 0; i < formData.files.length; i++) {
      form.append("files", formData.files[i]);
    }
    try {
      const response = await axiosPrivate.put(
        `/pendencias/andamento/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  function formataData(date) {
    date = moment(date);
    date.tz("America/Sao_Paulo");
    return date.format("HH:mm DD/MM/YYYY");
  }

  function formataBR(andam) {
    return andam.replace(/\n/g, "<br/>");
  }

  return (
    <div className="fixed text-black bg-[#00000080] top-0 left-0 w-full h-full z-1000">
      <div className="bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-4 pb-0 shadow-modal max-h-[794px] overflow-auto">
        <div className="relative flex flex-col w-full pointer-events-auto p-5 pb-8">
          <div className="font-Inter font-bold text-lg flex justify-between align-top text-right mb-2 pb-3 ">
            <h5 className=" select-none cursor-default">Andamentos</h5>
            <button
              onClick={closeModal}
              className="hover:text-[15px] transition-all"
              type="button"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div>
            {penden.andamento.map((andamento) => (
              <div className=" border-t-2 border-[#efefef] mb-2 cursor-default">
                <div className="flex">
                  <p className="font-system font-bold italic mt-1">
                    {andamento.user}
                  </p>
                  <p className="text-[11px] font-Inter italic select-none mt-3 ml-3">
                    {formataData(andamento.dateandamento)}
                  </p>
                </div>
                <div>
                  <p
                    className="font-system leading-5"
                    dangerouslySetInnerHTML={{
                      __html: formataBR(andamento.andamento),
                    }}
                  ></p>
                </div>
                {andamento.paths.length > 0
                  ? renderFiles(andamento.paths)
                  : null}
              </div>
            ))}
          </div>
          <div className="border-t-2 border-[#efefef] mt-3">
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
                  className="font-normal p-2 mt-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-6 bg-[#efefef] rounded w-full "
                />
                <input
                  title="Até 10 arquivos"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#f2f9fd] file:text-[#187bcd] hover:file:bg-[#e7f4fc]"
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
    </div>
  );
}

export default ModalAndamento;
