import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import moment from 'moment-timezone';


function ModalDetalhePendencia( { fecharModal, penden }) {

    function formataData(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo');
        return date.format('YYYY/MM/DD HH:mm')
    } 

    function incidente(url) {
        url = url.match(/(\d+)/g)
        return url;
    }

    return (
            <div className='fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000'>
                <div className='bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-4 pb-6 shadow-modal'>
                        <div className='relative flex flex-col w-full pointer-events-auto p-5 pb-1'>
                            <div className='font-Inter font-bold text-lg flex justify-between align-top text-right border-b-2 pb-3 border-[#efefef]'>
                                <h5>Detalhes da Pendência</h5>
                                <button onClick={fecharModal} className='hover:text-[15px] transition-all' type="button">
                                    <AiOutlineClose />
                                </button>
                            </div>
                        </div>
                        <div className='p-5 pt-3 pb-3'>
                            <h1 className='font-Inter font-bold text-lg'>{penden.titulo}</h1>
                            <div className='w-full flex flex-row col-span-2'>
                                <div className='w-1/3 text-sm'> 
                                    <p className='text-sm mb-0'><b>Descrição:</b> {penden.desc ? penden.desc : `Sem descrição`}</p>
                                    <p className='text-sm mb-0'><b>Tipo:</b> {penden.tipo}</p>
                                    <p className='text-sm mb-0'><b>Responsável:</b> {penden.responsavel}</p>
                                    <p><b>Task:</b> {penden.taskid}</p>
                                </div>
                                <div className='w-1/3 text-sm'>
                                    <p><b>Início:</b> {formataData(penden.dateinit)}</p>
                                    <p><b>Previsão:</b> {formataData(penden.dateatt)}</p>
                                    <p><b>Término:</b> {formataData(penden.dateend)}</p>
                                    <p><b>Incidente:</b> {penden.incidenturl ? (<a className='underline hover:text-[#777777] transition-colors' target='blank' href={penden.incidenturl}>{incidente(penden.incidenturl)}</a>) : null}</p>
                                </div>
                                <div className='w-1/3 text-sm'>
                                    <p><b>Abertura:</b> {penden.abertura.user}</p>
                                    <p><b>Horário de Abertura:</b> {formataData(penden.abertura.dateopening)}</p>
                                    <p><b>Fechamento:</b> {penden?.fechamento?.user}</p>
                                    <p><b>Horário de Fechamento:</b> {penden.fechamento.dateclosening ? formataData(penden?.fechamento?.dateclosening) : null}</p>
                                </div>
                            </div>
                        </div>
                        {penden.andamento.length > 0 ? (
                            <div className='flex flex-col p-5 pt-5 pb-3'>
                                <h1 className='font-Inter font-bold mb-2 '>Andamentos: </h1>
                                <div>
                                    <table className='w-full' >
                                        <thead>
                                            <tr className='detalhe border-[#efefef] border-b-2'>
                                                <th className='text-sm text-left font-Inter font-bold'>Hora</th>
                                                <th className='text-sm font-Inter font-bold'>Usuário</th>
                                                <th className='text-sm font-Inter font-bold'>Andamentos</th>
                                            </tr>
                                        </thead>
                                        <tbody className=' '>
                                            {penden.andamento.map((andamento) => (
                                                <tr className="detalhe align-top"> 
                                                    <th className='text-sm text-left font-Inter font-normal min-w-[115px]'>{formataData(andamento.dateandamento)}</th>                    
                                                    <th className='text-sm text-left font-Inter font-normal pl-2'>{andamento.user}</th>
                                                    <th className="text-sm min-w-[60%] text-left font-Inter font-normal pl-3">{andamento.andamento}</th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null }
                        
                </div>
            </div>
    )
}

export default ModalDetalhePendencia;