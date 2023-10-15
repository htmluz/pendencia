import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_.]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const URL_REGISTRO = "/usuarios/new";

function Register() {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {               //seta o focus quando loadar o componente
        userRef.current.focus();
    }, [])

    useEffect(() => {              
        const result = USER_REGEX.test(user);       
        setValidName(result);
    }, [user])
    
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(URL_REGISTRO,
                { user, pwd },
                {
                    header: { 'Content-type': 'application/json',},
                    withCredentials: true
                });
            console.log(user)
            console.log(pwd)
            console.log(response.data);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg("Sem resposta do servidor");
            } else {
                setErrMsg("Falha ao se registrar")
            }
        }
    }

    return (
        <>
            <section className="bg-white w-2/6 mt-20 ml-auto mr-auto rounded p-4 pb-5 shadow-modal font-Inter font-bold">
                {success ? (
                    <section>
                        <p className="cursor-default text-base font-system font-thin">
                            <a className="font-Inter font-bold">Usuário criado!<br/></a> 
                            <span>
                                <a className="underline" href="#">Entrar</a>
                            </span>
                        </p>
                    </section>
                ) : (
                    <div>
                        <p ref={errRef} className={errMsg ? "bg-[#ff333355] text-[#ff0000] rounded p-1 mb-2 text-center" : "hidden"}>{errMsg}</p>
                        <div className=" pb-2 mb-2">
                            <h1 className="cursor-default text-xl">Registrar-se</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label className="flex flex-row justify-between" htmlFor="user">
                                Usuário:
                                <span className={validName ? "text-[#06c258] pt-1" : "hidden"}>
                                    <AiOutlineCheck />
                                </span>
                                <span className={validName || !user ? "hidden" : " text-[#ff0000] pt-1"}>
                                    <AiOutlineClose />
                                </span>
                            </label>
                            <input 
                                type="text" 
                                id="user"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                required
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                                className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                            />
                            <p className={userFocus && user && !validName ? "cursor-default font-system text-sm text-center w-full font-light rounded bg-[#aaaaaa] p-1 mt-2" : "hidden"}>
                                4 a 24 Caracteres<br />
                                Precisa começar com uma letra e não pode conter espaço.<br />
                            </p>
                            <label className="flex flex-row justify-between pt-5" htmlFor="pwd">
                                Senha:
                                <span className={validPwd ? "text-[#06c258] pt-1" : "hidden"}>
                                    <AiOutlineCheck />
                                </span>
                                <span className={validPwd || !pwd ? "hidden" : " text-[#ff0000] pt-1"}>
                                    <AiOutlineClose />
                                </span>
                            </label>
                            <input 
                                type="password" 
                                id="pwd"
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                            />
                            <p className={pwdFocus && !validPwd ? "cursor-default font-system text-sm text-center w-full font-light rounded bg-[#aaaaaa] p-1 mt-2 mb-4" : "hidden"}>
                                8 a 24 Caracteres<br />
                                Precisa conter pelo menos um símbolo, uma letra em caixa alta e um número.<br />
                                Símbolos permitidos: ! @ # $ %<br />
                            </p>

                            <label className="flex flex-row justify-between pt-5" htmlFor="confirm_pwd">
                                Confirmar Senha:
                                <span className={validMatch && matchPwd ? "text-[#06c258] pt-1" : "hidden"}>
                                    <AiOutlineCheck />
                                </span>
                                <span className={validMatch || !matchPwd ? "hidden" : " text-[#ff0000] pt-1"}>
                                    <AiOutlineClose />
                                </span>
                            </label>
                            <input 
                                type="password" 
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                className="font-normal px-2 transition-colors focus:outline-none focus:bg-[#dddddd] leading-9 bg-[#efefef] rounded w-full"
                            />
                            <p className={matchFocus && !validMatch ? "cursor-default font-system text-sm text-center w-full font-light rounded bg-[#aaaaaa] p-1 mt-2" : "hidden"}>
                                Precisa ser idêntico a senha.
                            </p>
                            <button className='mt-4 mb-4 transition-colors bg-[#187bcd] hover:bg-[#1167b1] active:bg-[#0d4c82] rounded px-3 py-2 w-full text-white' disabled={!validName || !validPwd || !validMatch ? true : false}>
                                Criar usuário
                            </button>
                        </form>
                        <p className="cursor-default text-base font-system font-thin">
                            Já tem uma conta?<br />
                            <span>
                                <Link to="/login" className=" underline">Entrar</Link>
                            </span>
                        </p>
                    </div>
                )}
            </section> 
            
        </>
    );
}

export default Register;