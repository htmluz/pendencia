import { Link, useNavigate } from "react-router-dom"
import { FaQuestion } from "react-icons/fa";
import axios from "../api/axios";


function Footer() {
    const navigate = useNavigate();


    function handleLogout() {
        const cookieName = "logged";
        const cookieName2 = "roles";
        const pastDate = new Date(0).toUTCString();
        document.cookie = `${cookieName}=; expires=${pastDate}; path=/`;
        document.cookie = `${cookieName2}=; expires=${pastDate}; path=/`;
        window.localStorage.removeItem("USER")
        const response = axios.get('/usuarios/logout');
        navigate('/login');
    }

    return (
        <footer className='text-[#ffffffde] block font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0'>
            <Link className='mb-1 float-left ml-1 text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/pendencias">Pendencias</ Link>
            <Link className='mb-1 float-right mr-1 text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/gerencia">Gerência</Link>
            <button className='mr-1 mb-1 float-right text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' onClick={handleLogout}>Logout</button>
            <FaQuestion className='mb-1 mr-2 mt-1 float-right cursor-help' title='Bugs ou sugestões favor informar no bitrix Luiz Eduardo Krol.' />
        </footer>
)};

export default Footer;