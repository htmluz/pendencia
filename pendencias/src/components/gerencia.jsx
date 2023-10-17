import Tipos from "./tipos";
import Users from "./users"
import Footer from "./footer";

function Gerencia() {
    return (
        <div className="flex flex-row justify-center text-[#ffffffde]">
            <Users />
            <Tipos />
            <Footer />
        </div>
    )
}

export default Gerencia;