import { useParams } from "react-router-dom";

function DepositUnsuccess() {
    const { method } = useParams();

    return <>{method}</>;
}

export default DepositUnsuccess;
