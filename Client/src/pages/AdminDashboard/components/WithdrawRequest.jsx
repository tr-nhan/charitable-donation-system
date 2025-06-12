import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { io } from "socket.io-client";

import { Loading } from "../../../components/UI";
import { getWithdrawRequestByFilters } from "../../../services/api/withdrawApi";

const socket = io("http://localhost:8080");

function WithdrawRequest() {
    const userId = useSelector((state) => state.auth.user.user_id);
    const [withdrawRequests, setWithdrawRequest] = useState(null);

    const fetchWithdrawRequest = async () => {
        const res = await getWithdrawRequestByFilters({ status: "process" });
        setWithdrawRequest(res.results);
    };

    useEffect(() => {
        socket.emit("join-user-room", userId);

        // eslint-disable-next-line no-unused-vars
        socket.on("new-withdraw-request", ({ campaignIdS, statusS }) => {
            console.log("Called");

            fetchWithdrawRequest();
        });
        fetchWithdrawRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirm = (_campaignId, _userId, _amount, _id) => {
        socket.emit("withdraw-response", {
            campaignId: _campaignId,
            userId: _userId,
            status: "success",
            amount: _amount,
            id: _id
        });

        setWithdrawRequest((prev) => prev.filter((w) => w.id !== _id));
    };

    const handleReject = (_campaignId, _userId, _amount, _id) => {
        socket.emit("withdraw-response", {
            campaignId: _campaignId,
            userId: _userId,
            status: "reject",
            amount: _amount,
            id: _id
        });

        setWithdrawRequest((prev) => prev.filter((w) => w.id !== _id));
    };

    return (
        <div className="w-full">
            <h2 className="mb-12 text-2xl font-semibold">Pending Withdraw Requests</h2>

            <div className="mb-6 w-full">
                <h3 className="mb-2 text-center text-xl text-gray-700">
                    Make a search by campaign id
                </h3>
                <div className="ml-auto mr-auto relative w-full max-w-xl">
                    <SearchOutlinedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        // value={searchInput}
                        // onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
                    />
                </div>
            </div>

            {withdrawRequests ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {withdrawRequests.map((w, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Campaign ID:</span>
                                <span className="text-gray-900">{w.campaign_id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Amount:</span>
                                <span className="text-red-600 font-semibold">
                                    {w.amount.toLocaleString()} VND
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Fiat Balance:</span>
                                <span className="text-green-600 font-semibold">
                                    {w.fiat_balance.toLocaleString()} VND
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Method:</span>
                                <span>{w.method}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Method Info:</span>
                                <span>{w.method_info}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Creator:</span>
                                <span>{w.creator_name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Created At:</span>
                                <span>{new Date(w.created_at).toLocaleString()}</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-950 w-full cursor-pointer"
                                    onClick={() =>
                                        handleConfirm(w.campaign_id, w.creator_id, w.amount, w.id)
                                    }>
                                    Confirm
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full cursor-pointer"
                                    onClick={() =>
                                        handleReject(w.campaign_id, w.creator_id, w.amount, w.id)
                                    }>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default WithdrawRequest;
