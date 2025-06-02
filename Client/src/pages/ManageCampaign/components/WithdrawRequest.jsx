import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Loading } from "../../../components/UI";
import { getWithdrawRequestByFilters } from "../../../services/api/withdrawApi";
import { getCampaignBalance } from "../../../services/api/campaignApi";
import { io } from "socket.io-client";

const formatCurrencyVND = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "0 VND";
    return (
        new Intl.NumberFormat("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        }).format(parsed) + " VND"
    );
};

const socket = io("http://localhost:8080");

function WithdrawRequest({ campaignId, isSuspend }) {
    const userId = useSelector((state) => state.auth.user.user_id);
    const [withdrawRequests, setWithdrawRequests] = useState(null);
    const [campaignBalance, setCampaignBalance] = useState(null);

    const [amount, setAmount] = useState("");
    const [withdrawInfo, setWithdrawInfo] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const fetchInitState = async () => {
        const resultW = await getWithdrawRequestByFilters({ campaign_id: campaignId });
        if (resultW.error === 0) setWithdrawRequests(resultW.results);

        const resultB = await getCampaignBalance(campaignId);
        if (resultB.error === 0) setCampaignBalance(resultB.results);        
    };

    useEffect(() => {
        fetchInitState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId]);

    useEffect(() => {
        socket.emit("join-user-room", userId);

        // eslint-disable-next-line no-unused-vars
        socket.on("withdraw-result", ({ campaignIdS, statusS, idS, amountS }) => {
            setWithdrawRequests((prev) => {
                return prev.map((r) => {
                    if (r.id === idS) {
                        return { ...r, status: statusS };
                    }
                    return r;
                });
            });

            if (statusS === "reject") {
                fetchInitState();
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!withdrawRequests || !campaignBalance) return <Loading />;

    const availableAmount = parseFloat(campaignBalance.fiat_amount);
    const goalAmount = parseFloat(campaignBalance.goal_fiat);
    const maxAllowedAmount = Math.min(availableAmount, goalAmount * 0.8);

    const validate = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setErrorMessage("Amount must be a valid number greater than 0.");
            return false;
        }

        if (parseFloat(amount) > maxAllowedAmount) {
            setErrorMessage(
                `Maximum allowed withdrawal is ${formatCurrencyVND(maxAllowedAmount)}.`
            );
            return false;
        }

        if (!withdrawInfo || !/\S+@\S+\.\S+/.test(withdrawInfo)) {
            setErrorMessage("A valid email is required.");
            return false;
        }

        setErrorMessage("");
        return true;
    };

    const handleSubmit = () => {
        if (isSuspend) return;
        if (validate()) {
            socket.emit(
                "withdraw-request",
                {
                    campaignId,
                    userId,
                    amount: Number(amount),
                    method: "paypal",
                    methodInfo: withdrawInfo
                },
                (response) => {
                    if (response.status === "ok") {
                        fetchInitState();
                        setAmount("");
                        setWithdrawInfo("");
                    } else {
                        alert("Withdraw failed: " + response.message);
                    }
                }
            );
        }
    };

    return (
        <div className="space-y-8 p-4">
            {isSuspend && (
                <p
                    style={{
                        color: "red",
                        backgroundColor: "#ffe5e5",
                        padding: "10px",
                        border: "1px solid red",
                        borderRadius: "5px",
                        marginBottom: "10px"
                    }}>
                    ⚠️ Your campaign has been suspended due to potential violations such as breaking
                    our policies, receiving multiple reports, or other suspicious activities. Please
                    contact our support team for more information.
                </p>
            )}
            {/* Withdraw Request Form */}
            <div className="bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Request a Withdrawal</h2>

                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {/* Available Balance */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available Balance
                        </label>
                        <div className="p-2 border rounded-md bg-gray-100 text-gray-800">
                            {formatCurrencyVND(availableAmount)}
                        </div>
                    </div>

                    {/* Withdraw Amount */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Withdraw Amount (VND)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                if (isSuspend) return;
                                setAmount(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder={`Max: ${formatCurrencyVND(maxAllowedAmount)}`}
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Withdraw Info */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your PayPal Email
                        </label>
                        <input
                            type="email"
                            value={withdrawInfo}
                            onChange={(e) => {
                                if (isSuspend) return;
                                setWithdrawInfo(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="e.g., yourname@example.com"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-1">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-950 transition cursor-pointer">
                            Request Withdrawal
                        </button>
                    </div>
                </div>

                {/* Single help text for all validation errors */}
                {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}

                {/* Static Help Text */}
                <p className="text-sm text-gray-500 mt-4">
                    Note: You can withdraw up to 80% of your campaign goal. The admin will verify
                    your request and process the withdrawal to your PayPal account.
                </p>
            </div>

            {/* Withdraw Request History */}
            <div className="bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Withdrawal History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawRequests.length > 0 ? (
                                withdrawRequests.map((req, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-2 border">
                                            {formatCurrencyVND(req.amount)}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm font-medium
            ${req.status === "process" ? "text-yellow-600 bg-yellow-100" : ""}
            ${req.status === "success" ? "text-green-600 bg-green-100" : ""}
            ${req.status === "reject" ? "text-red-600 bg-red-100" : ""}
        `}>
                                                {req.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WithdrawRequest;
