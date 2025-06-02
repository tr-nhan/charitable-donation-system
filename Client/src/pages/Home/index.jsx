import HomePage from "./HomePage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user?.role === "admin") {
            navigate("/admin");
        }
    }, [user, navigate]);

    return (
        <div>
            <HomePage />
        </div>
    );
}

export default Home;
