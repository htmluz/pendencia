import React, { useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";

function ModalNovaPendencia( { fecharModal }) {

    return (
            <div className='fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000'>
                <div className='bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-4 shadow-modal'>
                    <form>
                        <div className='relative flex flex-col w-full pointer-events-auto'>
                            <div className='font-Inter font-bold text-lg flex justify-between align-top text-right'>
                                <h5>Adicionar Pendência</h5>
                                <button onClick={fecharModal} className='hover:text-[15px] transition-all' type="button">
                                    <AiOutlineClose />
                                </button>
                            </div>
                            <div>
                                <div >
                                    <label htmlFor="">
                                        Título:
                                        <input name="titulo" maxLength="120" type="text" className=' border rounded' />
                                    </label>
                                </div>
                                <div >
                                    <label htmlFor="">
                                        Título:
                                        <input name="titulo" maxLength="120" type="text" className=' border rounded' />
                                    </label>
                                </div>
                                <div >
                                    <label htmlFor="">
                                        Descrição:
                                        <input name="titulo" maxLength="120" type="text" className=' border rounded' />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    )
}

export default ModalNovaPendencia