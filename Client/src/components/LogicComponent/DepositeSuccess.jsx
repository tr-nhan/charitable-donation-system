import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Loading } from "../UI";
import { capturePaypal } from "../../services/api/transactionApi";

function DepositSuccess() {
    const navigate = useNavigate();
    const { method } = useParams();
    const fiatAmount = Number(localStorage.getItem("fiatDeposit"));

    useEffect(() => {
        if (!fiatAmount || fiatAmount === null) {
            navigate("/balance");
        }
        if (method === "paypal") {
            const queryParams = new URLSearchParams(window.location.search);
            const orderId = queryParams.get("token");

            const fetchCapturePaypal = async () => {
                try {
                    const res = await capturePaypal(orderId, fiatAmount);

                    if (res.error === 0) navigate("/balance");
                } catch (error) {
                    console.log(error);
                }
            };

            fetchCapturePaypal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Loading></Loading>;
}

export default DepositSuccess;
