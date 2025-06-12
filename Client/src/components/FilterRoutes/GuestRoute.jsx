import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

function GuestRoute() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const shouldRedirect = useMemo(() => isLoggedIn, [isLoggedIn]);

    return shouldRedirect ? <Navigate to="/" replace /> : <Outlet />;
}

export default GuestRoute;
