import { useEffect, useState } from "react";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";

function Users() {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        

        const getUsers = async () => {
            try {
                console.log("try1")
                const response = await axiosPrivate.get('/usuarios/get', {
                    signal: controller.signal});
                console.log("try2");
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.log("aqui");  //add navigation pro login dps
            }
        }
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            <h2>Usuários</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.user}</li>)}
                    </ul>
                ) : <p>Sem usuários</p> 
        }
        </article>
    );
};

export default Users;