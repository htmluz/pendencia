import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {  //hook serve pra renovar o accesstoken no axiosprivate
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/usuarios/refresh', {
            withCredentials: true
        });
        await setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;