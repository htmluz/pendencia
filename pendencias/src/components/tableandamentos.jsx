import moment from 'moment-timezone';


function TableAndamentos( { pendencias, id, top, handleMouseOut, handleMouseOver } ) {
    const pendenciaId = pendencias.find((penden) => penden.id == id)

    function formataData(date) {
        date = moment(date);
        date.tz('America/Sao_Paulo');
        return date.format('YYYY/MM/DD HH:mm')
    } 


    return (
        <div onMouseLeave={handleMouseOut} onMouseOver={handleMouseOver} className="mt-2 border-4 border-[#212121] absolute right-[1%]" style={{top: top}} >
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