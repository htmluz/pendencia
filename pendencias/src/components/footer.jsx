import { Link } from "react-router-dom"

function Footer() {

    return (
        <footer className='text-[#ffffffde] block font-system bg-gradient-to-t from-[#212121] fixed w-full bottom-0'>
            <Link className='float-left p-1 hover:bg-[#333333] transition-all rounded' to="/pendencias">Em andamento</ Link>
            <Link className='float-left p-1 hover:bg-[#333333] transition-all rounded' to="/pendencias">Concluídas</Link>
            <Link className='float-right p-1 hover:bg-[#333333] transition-all rounded' to="/gerencia">Gerência</Link>
        </footer>
)};

export default Footer;