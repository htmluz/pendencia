import { Link } from "react-router-dom"

function Footer() {

    return (
        <footer className='text-[#ffffffde] block font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0'>
            <Link className='mb-1 float-left ml-1 text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/pendencias">Pendencias</ Link>
            <Link className='mb-1 float-right mr-1 text-sm font-medium cursor-default select-none px-[10px] p-[3px] bg-[#343434] hover:bg-[#1b1b1b] transition-all rounded-md' to="/gerencia">Gerência</Link>
        </footer>
)};

export default Footer;