import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use( 
            config => {
                if (!config.headers['Authorization']) {  //aqui olho no header authorization, se n existir é a primeira request então colocamos o header nele
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`; 
                }
                return config;
            }, (error) => Promise.reject(error) 
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response, //se resposta ok volta a resposta
            async (error) => { //se não roda aqui 
                const prevRequest = error?.config; 
                if (error?.response?.status === 403 && !prevRequest?.sent) { //se expirou o token retorna 403, só tenta 1 vez com o parametro dps do and
                    prevRequest.sent = true; //aqui adiciono o parametro send pra eviar só uma vez
                    const newAccessToken = await refresh(); //usando o hook de refreshtoken
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}` //seto o novo accesstoken
                    return axiosPrivate(prevRequest); //tento de novo o request
                } 
                return Promise.reject(error);
            }
        );

        return () => { //serve pra limpar os interceptors e n ficar empilhando um no outro 
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
};

export default useAxiosPrivate;