import { useEffect, useState } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import ModalNovoUser from "./modalnovouser";
import { BsTrash } from "react-icons/bs" 

function Users() {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [modalUser, setModalUser] = useState(false);

    const getUsers = async () => {
        try {
            const response = await axiosPrivate.get('/usuarios/get');
            setUsers(response.data);
        } catch (err) {
            console.log(err)
        }
    }

    const clickModal = () => {
        setModalUser(current => !current);
        if (!modalUser) {
            getUsers();
        }
      } 


    const deleteUser = async (event) => {
        try {
            let name = event.currentTarget;
            name = name.previousSibling;
            name = name.textContent;
            const response = await axiosPrivate.delete(`/usuarios/delete/${name}`)
        } catch (err) {
            console.log(err)
        }
        getUsers();
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <>
            <div className="ml-5 p-2 mt-5 w-1/3 bg-[#191919] rounded flex flex-col justify-between cursor-default select-none">
            <article className="">
                <h2 className="font-bold border-b-2 border-[#292929] pb-2 mb-2">Usuários</h2>
                {users?.length
                    ? (
                        <ul className="mb-2">
                            {users.map((user, i) => <li className="flex justify-between" key={i}>
                                                        <span>{user?.user}</span>
                                                        <BsTrash onClick={deleteUser} className="mt-1 hover:text-[#aaaaaa] transition-all" />
                                                    </li>
                            )}
                        </ul>
                    ) : <p>Sem conexão com o banco</p> 
            }
            </article>
                <button onClick={clickModal} className="px-1 py-1 w-full mt-2 rounded cursor-default transition-colors bg-[#187bcd] hover:bg-[#1167b1] active:bg-[#0d4c82] ">Novo Usuário</button>
            </div>
            { modalUser ? <ModalNovoUser fecharModal={clickModal} /> : null}
        </>
    );
};

export default Users;