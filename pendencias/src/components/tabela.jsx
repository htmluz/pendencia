import React, { Component } from 'react';
import { useState, useEffect } from 'react'


const Tabela = () => {

    const API = "http://localhost:3001";
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
    
    if(loading) {
        return <p className='font-Inter'>Carregando pendências...</p>
    }

    return (
        <table className="font-Inter w-full">
            <thead className="text-left border-b-2 border-[#292929]">
                <tr >
                    <th >Título</th>
                    <th>Tipo</th>
                    <th>Responsável</th>
                    <th>Início</th>
                    <th>Previsão</th>
                    <th>Atualizar em</th>
                    <th>Task</th>
                    <th>Incidente</th>
                </tr>
            </thead>
            <tbody>
                {pendencias.map((item) => (
                    <tr className=' font-system text-sm hover:bg-[#12121266] transition-all cursor-default' key={item.id}>
                        <td>{item.titulo}</td>
                        <td>{item.tipo}</td>
                        <td>{item.responsavel}</td>
                        <td>{item.dateinit}</td>
                        <td>{item.dateend}</td>
                        <td>{item.dateatt}</td>
                        <td>
                            <div>
                                {item.taskid}
                            </div>
                        </td>
                        <td>{item.incidenturl}</td>
                        <td>
                            <div>
                                <a href="">a </a>
                                <a href="">a </a>
                                <a href="">a </a>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};



export default Tabela