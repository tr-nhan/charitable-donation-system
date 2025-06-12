import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Avatar } from "@mui/material";

import { Loading } from "../../components/UI";
import MomoLogo from "../../assets/images/momo_icon_square_pinkbg_RGB.png";
import USDTLogo from "../../assets/images/tether-usdt-logo.png";
import PaymeLogo from "../../assets/images/Logo-PayME-V.webp";
import PaypalLogo from "../../assets/images/paypal.png";
import { getUserBalance } from "../../services/api/userBalanceApi";

const formatCurrencyVND = (amount) => {
    return amount.toLocaleString("vi-VN") + " VND";
};

function BalanceManagement() {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user.user_id);
    const [balances, setBalances] = useState({ fiatBalance: 0, cryptoBalance: 0 });

    useEffect(() => {
        const fetchUserBalance = async () => {
            const res = await getUserBalance(userId);

            setBalances(() => {
                return {
                    fiatBalance: res.results?.fiat_balance || 0,
                    cryptoBalance: res.results?.crypto_balance || 0
                };
            });
        };

        fetchUserBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-6 md:px-20 py-14 w-full max-w-6xl mx-auto">
            {/* Current Balance Header */}
            <h1 className="text-3xl md:text-4xl text-[#252525] font-bold text-center">
                Your Current Balance
            </h1>

            {/* Balance Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-center">
                <div className="p-5 flex flex-col border border-[#e0ddd6] rounded-xl bg-white shadow-sm">
                    <span className="text-sm text-[#7a7a7a]">Fiat Balance</span>
                    <span className="mt-2 text-2xl font-semibold text-[#252525]">
                        {formatCurrencyVND(Number(balances.fiatBalance))}
                    </span>
                </div>
                <div className="p-5 flex flex-col border border-[#e0ddd6] rounded-xl bg-white shadow-sm">
                    <span className="text-sm text-[#7a7a7a]">Crypto Balance</span>
                    <span className="mt-2 text-2xl font-semibold text-[#252525]">
                        {balances.cryptoBalance} USDT
                    </span>
                </div>
            </div>

            {/* Explore Button */}
            <div className="mt-10 flex justify-center">
                <Button
                    variant="outlined"
                    sx={{
                        paddingY: "10px",
                        borderRadius: "10px",
                        border: "1px solid #c0bdb8",
                        color: "#252525",
                        fontWeight: "600",
                        ":hover": {
                            backgroundColor: "#2525250d",
                            border: "2px solid black"
                        },
                        maxWidth: "200px",
                        width: "100%"
                    }}
                    onClick={() => navigate("/discover")}>
                    Let's Explore 😄
                </Button>
            </div>

            {/* Divider */}
            <hr className="my-14 border-[#e5e1d7]" />

            {/* Manage Balance Section */}
            <h2 className="text-3xl md:text-4xl text-[#252525] font-bold text-center">
                Manage Your Balance
            </h2>

            <div className="mt-10 bg-[#fbfaf8] border border-dashed border-[#949392] rounded-xl px-6 py-8 text-center max-w-md mx-auto">
                <h3 className="text-sm text-[#6f6f6f]">View your entire transaction history</h3>
                <Button
                    variant="outlined"
                    sx={{
                        color: "#252525",
                        fontWeight: "600",
                        marginTop: "12px",
                        borderRadius: "9999px",
                        borderColor: "#949392",
                        fontSize: "13px",
                        paddingX: "20px"
                    }}
                    onClick={() => navigate("/transaction/history")}>
                    History Transaction
                </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 font-sans">
                {/* Notice if user prefers not to deposit */}
                <div className="col-span-full mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-yellow-800 mb-1">Don't want to deposit?</h4>
                    <p className="text-sm text-yellow-700 leading-relaxed">
                        If you don't feel comfortable depositing to our platform, it's totally fine
                        — you can still support a campaign directly using MetaMask. We support
                        crypto donations and verify the transaction securely.
                    </p>
                </div>
                {/* Button Paypal*/}
                <button
                    onClick={() => navigate("/deposit/paypal")}
                    className="p-5 border border-[#e0ddd6] rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 transform transition-all duration-300 w-full text-left cursor-pointer">
                    <div className="w-full grid grid-cols-8 gap-2 items-start">
                        <div className="col-span-1 flex justify-center pt-1">
                            <Avatar src={PaypalLogo} variant="rounded" />
                        </div>
                        <div className="col-span-5 max-sm:col-span-6">
                            <h5 className="mb-2 font-semibold text-lg text-[#252525]">Paypal</h5>
                            <p className="text-sm text-[#6f6f6f] leading-relaxed">
                                Processing time{" "}
                                <span className="text-[#252525] font-semibold">
                                    Instant - 10 minutes
                                </span>
                                <br />
                                Fee <span className="text-[#252525] font-semibold">0%</span>
                                <br />
                                Limit{" "}
                                <span className="text-[#252525] font-semibold">
                                    {formatCurrencyVND(10000)} - {formatCurrencyVND(10000000)}
                                </span>
                            </p>
                        </div>
                        <div className="col-span-2 max-sm:col-span-1 flex justify-end">
                            <div className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-2xl font-medium">
                                Recommended
                            </div>
                        </div>
                    </div>
                </button>
                {/* Button Momo */}
                <button
                    disabled
                    onClick={() => navigate("/deposit/momo")}
                    className="p-5 border border-[#e0ddd6] rounded-xl bg-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 transform transition-all duration-300 w-full text-left">
                    <div className="w-full grid grid-cols-8 gap-2 items-start">
                        <div className="col-span-1 flex justify-center pt-1">
                            <Avatar src={MomoLogo} variant="rounded" />
                        </div>
                        <div className="col-span-5 max-sm:col-span-6">
                            <h5 className="mb-2 font-semibold text-lg text-[#252525]">Momo</h5>
                            <p className="text-sm text-[#6f6f6f] leading-relaxed">
                                Processing time{" "}
                                <span className="text-[#252525] font-semibold">
                                    Instant - 10 minutes
                                </span>
                                <br />
                                Fee <span className="text-[#252525] font-semibold">0%</span>
                                <br />
                                Limit{" "}
                                <span className="text-[#252525] font-semibold">
                                    {formatCurrencyVND(10000)} - {formatCurrencyVND(10000000)}
                                </span>
                            </p>
                        </div>
                        <div className="col-span-2 max-sm:col-span-1 flex justify-end">
                            <div className="px-2 py-1 bg-green-100 text-red-600 text-xs rounded-2xl font-medium">
                                Mantance
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default BalanceManagement;
