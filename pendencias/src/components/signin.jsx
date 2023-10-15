import React, { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import useAuth from "../Hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const URL_LOGIN = "/usuarios/auth";

function Signin() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {               //seta o focus quando loadar o componente
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(URL_LOGIN,
                { user, pwd },
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            console.log(response.data);
            setAuth({ user, pwd, accessToken});
            setUser('');
            setPwd('');
            navigate('/pendencias');  //ENTENDER O QUE TA ROLANDO N TA ACESSANDO A TABELA
        } catch (err) {
            if (!err?.response) {
                setErrMsg("Sem resposta do servidor");
            } else if (err.response?.status === 400) {
                setErrMsg("Usuário e senha são necessários");
            } else if (err.response?.status === 401) {
                setErrMsg("Usuário ou senha incorretos")
            } else {
                setErrMsg("Falha no login")
            }
        }

        
    }

    return (
        <>
            <section className="bg-white w-2/6 mt-20 ml-auto mr-auto rounded p-4 pb-5 shadow-modal font-Inter font-bold">
                    <div>
                        <p ref={errRef} className={errMsg ? "bg-[#ff333355] text-[#ff0000] rounded p-1 mb-2 text-center" : "hidden"}>{errMsg}</p>
                        <div className=" pb-2 mb-2">
                            <h1 className="cursor-default text-xl">Entrar</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label className="flex flex-row justify-between" htmlFor="user">Usuário:</label>
                            <input 
                                type="text" 
                                id="user"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                            />
                            <label className="flex flex-row justify-between pt-5" htmlFor="pwd">Senha:</label>
                            <input 
                                type="password" 
                                id="pwd"
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                value={pwd}
                                className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                            />
                            <button className='cursor-default mt-4 mb-4 transition-colors bg-[#187bcd] hover:bg-[#1167b1] active:bg-[#0d4c82] rounded px-3 py-2 w-full text-white'>
                                Entrar
                            </button>
                        </form>
                        <p className="cursor-default text-base font-system font-thin">
                            Não tem uma conta?<br />
                            <span>
                                <Link to="/register" className=" underline">Registre-se</Link>
                            </span>
                        </p>
                    </div>
            </section> 
            
        </>
    );
}

export default Signin;