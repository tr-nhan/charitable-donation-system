import { useParams, useNavigate } from "react-router-dom";

function DepositUnsuccess() {
    const navigate = useNavigate();
    const { method } = useParams();
    navigate("/balance");
    return <>{method}</>;
}

export default DepositUnsuccess;
