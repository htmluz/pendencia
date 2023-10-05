const Tabela = () => {
    const data = [
        { id: 1, titulo: "SOC <> CTA Atenuado", Tipo: "Trecho Atenuado", responsavel: "ALT"},
        { id: 2, titulo: "sssss", Tipo: "fdsafsdafdsa", responsavel: "fdsafdsa"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
        { id: 3, titulo: "3esdfs", Tipo: "fdasfdsa", responsavel: "231321"},
    ];

    return (
        <table className=" font-Inter w-full">
            <thead className="text-left border-b-2 border-[#292929]">
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Responsável</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.titulo}</td>
                        <td>{item.Tipo}</td>
                        <td>{item.responsavel}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};



export default Tabela