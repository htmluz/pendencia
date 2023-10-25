import { useEffect, useState } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import ModalNovoTipo from "./modalnovotipo";
import { BsTrash } from "react-icons/bs" 


function Tipos() {
    const [tipos, setTipos] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [modalTipo, setModalTipo] = useState(false);

    const getTipos = async () => {
        try {
            const response = await axiosPrivate.get("/tipos/get");
            setTipos(response.data);
        } catch (err) {
            console.log(err)
        }
    }

    const clickModal = () => {
        setModalTipo(current => !current);
        if (!modalTipo) {
            getTipos();
        }
      }

    const deleteTipo = async (event) => {
        try {
            let tipo = event.currentTarget;
            tipo = tipo.previousSibling;
            tipo = tipo.textContent;
            const response = await axiosPrivate.delete(`/tipos/delete/${tipo}`)
        } catch (err) {
            console.log(err)
        }
        getTipos();
    }


    useEffect(() => {
        getTipos();
    }, [])




    return (
        <>
        <div className="ml-5 p-2 mt-5 w-1/3 bg-[#191919] rounded flex flex-col justify-between cursor-default select-none">
            <article className="">
                <h2 className="font-bold border-b-2 border-[#292929] pb-2 mb-2" >Tipos de Pendência</h2>
                {tipos?.length
                        ? (
                        <ul className="font-system mb-2 leading-6">
                            {tipos.map((tipo, i) => <li key={i} className="flex justify-between">
                                                        <span>{tipo?.tipo}</span>
                                                        <BsTrash onClick={deleteTipo} className="mt-1 hover:text-[#aaaaaa] transition-all" />
                                                    </li>
                            )}
                        </ul>
                    ) : <p>Sem conexão com o banco</p>}
            </article>
            <button onClick={clickModal} className="px-1 py-1 w-full mt-2 rounded cursor-default transition-colors bg-[#187bcd] hover:bg-[#1167b1] active:bg-[#0d4c82] ">Novo Tipo</button>
        </div>
        { modalTipo ? <ModalNovoTipo fecharModal={clickModal} /> : null}
        </>
    )
}

export default Tipos;