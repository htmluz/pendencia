import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';

function TableAndamentos( { pendencias, id, top, handleMouseOut, handleMouseOver } ) {
    const pendenciaId = pendencias.find((penden) => penden.id == id)
    const bott = window.innerHeight;
    const divRef = useRef(null);
    const [maxH, setMaxH] = useState(0);


    function formataData(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo');
        return date.format('YYYY/MM/DD HH:mm')
    } 


    useEffect(() => {   //caso a div for sair da tela seta o maxH pra não sair
        const divee = divRef.current.getBoundingClientRect().bottom; 
        if (divee > bott) setMaxH(divee - bott);
    }, []) 

    return (
        <div 
            ref={divRef}
            onMouseLeave={handleMouseOut} 
            onMouseOver={handleMouseOver} 
            className="mt-2 border-4 border-[#212121] absolute right-[1%] overflow-auto min-w-[520px] max-w-[1200px]" 
            style={{
                top: top,
                maxHeight: maxH > 0 ? `${maxH}px` : 'none', 
                overflowY: maxH > 0 ? 'visible' : 'none'
            }} 
        >
            <table className="w-full font-Inter text-xs font-light rounded text-[#ffffffde]">
                <thead className="border-b-2 border-[#292929] font-Inter font-thin">
                    <tr>
                        <th>Hora</th>
                        <th>Usuário</th>
                        <th>Andamento</th>
                    </tr>
                </thead>
                <tbody>
                    {pendenciaId.andamento.map((andamento, i) => (
                        <tr className=" leading-6 font-system" key={i}> 
                            <th className='align-top text-left'>{formataData(andamento.dateandamento)}</th>                    
                            <th className='align-top pl-2 text-left'>{andamento.user}</th>
                            <th className="min-w-[500px] max-w-[1000px] text-left pl-2">{andamento.andamento}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableAndamentos;