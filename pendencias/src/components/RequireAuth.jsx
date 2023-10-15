import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Navigate to="/pendencias" />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;