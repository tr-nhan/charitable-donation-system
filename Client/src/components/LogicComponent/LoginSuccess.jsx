import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchLoginStatus } from "../../redux/authSlice";
import { useEffect } from "react";

function LoginSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchLoginStatus());
        navigate("/");
    }, [dispatch, navigate]);

    return <></>;
}

export default LoginSuccess;
