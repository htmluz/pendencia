import React from 'react';
import { useState, useEffect } from 'react'



const Tabela = () => {

    const API = "http://localhost:5666";
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPendencia = async() => {
            setLoading(true);

            const res = await fetch(API + "/pendencias")
                .then((res) => res.json())
                .then((data) => data)
                .catch((err) => console.log(err));

                setLoading(false);
                setPendencias(res);
        }

        loadPendencia();
    }, [])

    console.log(pendencias);
    if(loading) {
        return <p>Carregando...</p>
    }

    return (
        <table className="font-Inter w-full">
            <thead className="text-left border-b-2 border-[#292929]">
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Responsável</th>
                </tr>
            </thead>
            <tbody>
                {pendencias.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.titulo}</td>
                        <td>{item.tipo}</td>
                        <td>{item.responsavel}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};



export default Tabela