import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../UI/Loading";

function AdminRoute() {
    const { isLoggedIn, status, user } = useSelector((state) => state.auth);

    if (status === "loading" || status === "idle") {
        return <Loading />;
    }    

    return isLoggedIn && user.role === "admin" ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export default AdminRoute;
