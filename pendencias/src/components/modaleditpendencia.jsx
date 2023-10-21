import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import useAxiosPrivate from '../Hooks/useAxiosPrivate';

function ModalEditPendencia( { fecharModal, penden }) {
    const [formData, setFormData] = useState({
        titulo: penden.titulo,
        tipo: penden.tipo,
        responsavel: penden.responsavel,
        dateinit: penden.dateinit,
        dateend: penden.dateend,
        dateatt: penden.dateatt,
        taskid: penden.taskid,
        incidenturl: penden.incidenturl,
        abertura: {
                user: penden.abertura.user
            },
        fechamento: {
                user: penden.fechamento.user
            }
    });
    const [tipos, setTipos] = useState();
    const axiosPrivate = useAxiosPrivate();


    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;


        const getTipos = async () => {
            try {
                const response = await axiosPrivate.get("/tipos/get", {
                    signal: controller.signal});
                isMounted && setTipos(response.data);
            } catch (err) {
                console.log(err)
            }
        }
        getTipos();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.put(`/pendencias/edit/${penden.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            fecharModal();
        } catch (err) {
            console.log(err)
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
            <div className='fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000'>
                <div className='bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-4 pb-0 shadow-modal'>
                        <div className='relative flex flex-col w-full pointer-events-auto p-5 pb-8'>
                            <div className='font-Inter font-bold text-lg flex justify-between align-top text-right mb-2 border-b-2 pb-3 border-[#efefef]'>
                                <h5>Editar Pendência</h5>
                                <button onClick={fecharModal} className='hover:text-[15px] transition-all' type="button">
                                    <AiOutlineClose />
                                </button>
                            </div>
                            <form method='PUT' onSubmit={handleSubmit}>
                                <div className='flex flex-col space-between font-system font-semibold'>
                                    <div className='py-2'>
                                        <label className='' htmlFor="titulo">
                                            Título:
                                            <input required value={formData.titulo} onChange={handleInputChange} id="titulo" name="titulo" maxLength="120" type="text" className='font-normal px-2font-normal px-2  transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                        </label>
                                    </div>
                                    <div className='py-2'>
                                        <label htmlFor="desc">
                                            Descrição:
                                            <input value={formData.desc} onChange={handleInputChange} id="desc" name="desc" type="text" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                        </label>
                                    </div>
                                    <div className='flex flex-row py-2'>
                                        <div className='w-48p mr-auto'>
                                            <label htmlFor="tipo">
                                                Tipo de Pendência:
                                                    <select required value={formData.tipo} onChange={handleInputChange} id="tipo" name="tipo" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full'>
                                                        <option value=''></option>
                                                        {tipos && tipos.map((tipo, i) => (<option key={i} value={tipo.tipo}>{tipo.tipo}</option>))}
                                                    </select>
                                            </label>
                                        </div>
                                        <div className=' w-48p'>
                                            <label htmlFor="responsavel">
                                                Responsável:
                                                <input required value={formData.responsavel} onChange={handleInputChange} id="responsavel" name="responsavel" type="text" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row py-2'>
                                        <div className='w-48p mr-auto'>
                                            <label htmlFor="taskid">
                                                Task:
                                                <input value={formData.taskid} onChange={handleInputChange} id="taskid" name="taskid" type="number" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                        </div>
                                        <div className=' w-48p'>
                                            <label htmlFor="incidenturl">
                                                Incidente:
                                                <input value={formData.incidenturl} onChange={handleInputChange} id="incidenturl" name="incidenturl" type="text" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                        </div>
                                        
                                    </div>
                                    <div className='flex flex-row py-2 border-b-2 border-[#efefef] pb-7'>
                                        <div className='w-30p mr-auto'>
                                            <label htmlFor="dateinit">
                                                Data/hora de Início:
                                                <input required value={formData.dateinit} onChange={handleInputChange} id="dateinit" name="dateinit" type="datetime-local" min="2023-01-01T00:00" max="2666-01-01T00:00" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                        </div>
                                        <div className='w-30p mr-auto'>
                                            <label htmlFor="dateatt">
                                                Atualizar em:
                                                <input required value={formData.dateatt} onChange={handleInputChange} id="dateatt" name="dateatt" type="datetime-local" min="2023-01-01T00:00" max="2666-01-01T00:00" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                        </div>
                                        <div className='w-30p'>
                                            <label htmlFor="dateend">
                                                Previsão: 
                                                <input required value={formData.dateend} onChange={handleInputChange} id="dateend" name="dateend" type="datetime-local" min="2023-01-01T00:00" max="2666-01-01T00:00" className='font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full' />
                                            </label>
                                            
                                        </div>
                                    </div>
                                    <div className='flex mt-6'>
                                        <button onClick={fecharModal} className='transition-colors mr-auto bg-[#efefef] hover:bg-[#dddddd] rounded px-3 py-2 w-48p'>Fechar</button>
                                        <button type="submit" className='transition-colors  bg-[#187bcd] hover:bg-[#1167b1] rounded px-3 py-2 w-48p text-white'>Enviar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                </div>
            </div>
    )
}

export default ModalEditPendencia;