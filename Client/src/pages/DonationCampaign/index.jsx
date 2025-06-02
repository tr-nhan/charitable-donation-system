import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

import { Loading } from "../../components/UI";
import { getFullInfoCampaignById } from "../../services/api/campaignApi";
import { getUserBalance } from "../../services/api/userBalanceApi";
import { insertDonation } from "../../services/api/donationApi";
import CircularProgress from "@mui/material/CircularProgress";

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

function getGreenShade(percent) {
    if (percent < 25) return "#d1fae5";
    if (percent < 50) return "#6ee7b7";
    if (percent < 75) return "#34d399";
    return "#059669"; // emerald-600
}

function DonationCampaign() {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const userId = useSelector((state) => state.auth.user.user_id);
    const email = useSelector((state) => state.auth.user.email);
    // init state
    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    // currency optionCurrency
    const [optionCurrency, setOptionCurrency] = useState("fiat");
    const [amount, setAmount] = useState("");
    const [helpText, setHelpText] = useState({
        amount: {
            helptext: "",
            isValid: false
        },
        info: {
            helpText: "",
            isValid: false
        }
    });
    // donor's info
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [donorName, setDonorName] = useState("");
    const [message, setMessage] = useState("");
    // meta mask
    const [statusMetamask, setStatusMetamask] = useState("");
    // dialog
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchInitState = async () => {
            try {
                setLoading(true);

                const resC = await getFullInfoCampaignById(campaignId);
                const resB = await getUserBalance(userId);

                setCampaign(resC.results);
                setUserBalance(resB.results);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitState();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);

        const num = parseFloat(value);
        if (isNaN(num)) {
            setHelpText((prev) => ({ ...prev, amount: { helptext: "", isValid: false } }));
            return;
        }

        if (optionCurrency === "fiat") {
            if (num < 100000) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: {
                        helptext: "Minimum donation for fiat is 100,000 VND.",
                        isValid: false
                    }
                }));
            } else if (num > userBalance.fiat_balance) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "You do not have enough VND balance.", isValid: false }
                }));
            } else if (num + campaign.campaignInfo.current_fiat > campaign.campaignInfo.goal_fiat) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Donation exceeds campaign goal.", isValid: false }
                }));
            } else {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Great! Your contribution is meaningful.", isValid: true }
                }));
            }
        } else if (optionCurrency === "crypto") {
            if (num < 0.001) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: {
                        helptext: "Minimum donation for fiat is 0.001 ETH.",
                        isValid: false
                    }
                }));
            } else if (num > userBalance.crypto_balance) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "You do not have enough ETH balance.", isValid: false }
                }));
            } else if (
                num + campaign.campaignInfo.current_crypto >
                campaign.campaignInfo.goal_crypto
            ) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Donation exceeds campaign goal.", isValid: false }
                }));
            } else {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Amazing! Every ETH makes a difference.", isValid: true }
                }));
            }
        } else {
            if (num < 0.001) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: {
                        helptext: "Minimum donation for fiat is 0.001 ETH.",
                        isValid: false
                    }
                }));
            } else if (num > campaign.campaignInfo.goal_crypto) {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Donation exceeds campaign goal.", isValid: false }
                }));
            } else {
                setHelpText((prev) => ({
                    ...prev,
                    amount: { helptext: "Amazing! Every ETH makes a difference.", isValid: true }
                }));
            }
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setDonorName(value);

        if (!value.trim()) {
            setHelpText((prev) => ({
                ...prev,
                info: {
                    helpText: "Name cannot be empty.",
                    isValid: false
                }
            }));
        } else {
            setHelpText((prev) => ({
                ...prev,
                info: {
                    helpText: "",
                    isValid: true
                }
            }));
        }
    };

    const handleMessageChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

        if (!value.trim()) {
            setHelpText((prev) => ({
                ...prev,
                info: {
                    helpText: "Message cannot be empty.",
                    isValid: false
                }
            }));
        } else if (wordCount > 200) {
            setHelpText((prev) => ({
                ...prev,
                info: {
                    helpText: "Message must be under 200 words.",
                    isValid: false
                }
            }));
        } else {
            setHelpText((prev) => ({
                ...prev,
                info: {
                    helpText: "",
                    isValid: true
                }
            }));
        }
    };

    const handleDonation = () => {
        if (campaign.campaignInfo.isSuspend) return;
        const donationOptionCurrency = optionCurrency;
        const donationAmount = parseInt(amount);

        const fetchDonation = async () => {
            try {
                setLoading(true);
                const res = await insertDonation({
                    campaignId,
                    donorId: userId,
                    donorName,
                    donorEmail: email,
                    message,
                    isAnonymous,
                    fiatAmount: donationOptionCurrency === "fiat" ? donationAmount : null,
                    cryptoAmount: donationOptionCurrency === "crypto" ? donationAmount : null
                });

                if (res.error === 0) {
                    setOpenDialog(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonation();
    };

    const handleMetamask = async () => {
        try {
            setLoading(true);
            if (!window.ethereum) throw new Error("Metamask not installed");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const userAdd = campaign.campaignInfo.metamask_add;
            const tx = await signer.sendTransaction({
                to: userAdd,
                value: ethers.parseEther(amount)
            });

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                const res = await insertDonation({
                    campaignId,
                    donorId: userId,
                    donorName,
                    donorEmail: email,
                    message,
                    isAnonymous,
                    fiatAmount: null,
                    cryptoAmount: amount
                });

                if (res.error === 0) {
                    setOpenDialog(true);
                }
            }
        } catch (error) {
            console.error("Donation failed", error);
            setStatusMetamask("Donation failed");
        } finally {
            setLoading(false);
            setHelpText({
                amount: {
                    helptext: "",
                    isValid: false
                },
                info: {
                    helpText: "",
                    isValid: false
                }
            });
        }
    };

    const onClose = () => {
        navigate(`/campaign/discover/${campaignId}`);
    };

    if (!campaign || !userBalance) return <Loading />;
    if (campaign.campaignInfo.isSuspend) return navigate(`/campaign/discover/${campaignId}`);
    return (
        <div className="p-0 md:py-10 w-full h-full bg-[#f4f2ec] flex justify-center items-center">
            <div className="md:p-10 px-5 py-10 bg-white md:rounded-3xl md:w-[45%] w-full">
                {campaign.campaignInfo.isSuspend && (
                    <p
                        style={{
                            color: "red",
                            backgroundColor: "#ffe5e5",
                            padding: "10px",
                            border: "1px solid red",
                            borderRadius: "5px",
                            marginBottom: "15px"
                        }}>
                        ⚠️ This campaign has been suspended due to suspicious activity, including
                        potential scam behavior, multiple user reports, or violations of our
                        platform policies. Please proceed with caution and contact our support team
                        if you need further clarification.
                    </p>
                )}
                {/* Campaign info */}
                <div className="flex flex-row">
                    <img
                        src={campaign.campaignInfo.campaign_image}
                        alt="Campaign Thumbnail"
                        className="w-[113px] h-[84px] rounded-sm object-cover"
                    />
                    <div className="ml-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">You are supporting:</p>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {campaign.campaignInfo.title}
                            </h2>
                        </div>

                        {campaign.campaignInfo.short_description && (
                            <p className="text-sm text-gray-500 mt-2">
                                {campaign.campaignInfo.short_description}
                            </p>
                        )}

                        <p className="text-xs text-emerald-600 italic mt-3">
                            🌱 Every small help makes a big difference. Thank you for your kindness!
                        </p>
                    </div>
                </div>

                {/* Current raised */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Current Raised</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fiat Raised */}
                        <div className="flex flex-col">
                            <span className="text-gray-600 text-sm mb-1">Fiat (VND)</span>
                            <span className="text-green-700 font-bold text-base mb-1">
                                {formatCurrencyVND(campaign.campaignInfo.current_fiat)} raised
                            </span>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-500 rounded-full"
                                    style={{
                                        width: `${campaign.campaignInfo.current_fiat == 0 ? 0 : (campaign.campaignInfo.current_fiat / campaign.campaignInfo.goal_fiat) * 100}%`,
                                        backgroundColor: getGreenShade(
                                            (campaign.campaignInfo.current_fiat /
                                                campaign.campaignInfo.goal_fiat) *
                                                100
                                        )
                                    }}></div>
                            </div>
                        </div>

                        {/* Crypto Raised */}
                        <div className="flex flex-col">
                            <span className="text-gray-600 text-sm mb-1">Crypto (ETH)</span>
                            <span className="text-green-700 font-bold text-base mb-1">
                                {campaign.campaignInfo.current_crypto} ETH raised
                            </span>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full transition-all duration-500 rounded-full"
                                    style={{
                                        width: `${campaign.campaignInfo.current_crypto == 0 ? 0 : (campaign.campaignInfo.current_crypto / campaign.campaignInfo.goal_crypto) * 100}%`,
                                        backgroundColor: getGreenShade(
                                            (campaign.campaignInfo.current_crypto /
                                                campaign.campaignInfo.goal_crypto) *
                                                100
                                        )
                                    }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Section */}
                <div className="mt-6 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Enter your donation</h2>
                    {!campaign.campaignInfo.metamask_add && (
                        <div className="mt-2 p-3 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 rounded">
                            <p className="font-medium">Note:</p>
                            <p>
                                This campaign does not support donations via MetaMask or crypto
                                wallets. Please use another available payment method.
                            </p>
                        </div>
                    )}

                    {/* Radio Selection */}
                    <div className="mt-4 flex items-center gap-6 mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="donationType"
                                value="fiat"
                                checked={optionCurrency === "fiat"}
                                onChange={() => {
                                    setOptionCurrency("fiat");
                                    setAmount("");
                                    setHelpText((prev) => ({
                                        ...prev,
                                        amount: { helptext: "", isValid: false }
                                    }));
                                }}
                            />
                            <span className="text-sm text-gray-700">VND</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="donationType"
                                value="metamask"
                                checked={optionCurrency === "metamask"}
                                onChange={() => {
                                    setOptionCurrency("metamask");
                                    setAmount("");
                                    setHelpText((prev) => ({
                                        ...prev,
                                        amount: { helptext: "", isValid: false }
                                    }));
                                }}
                            />
                            <span className="text-sm text-gray-700">MetaMask (ETH)</span>
                        </label>
                    </div>

                    {/* Input Field */}
                    {optionCurrency !== "metamask" ? (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-semibold">
                                {optionCurrency === "fiat"
                                    ? `Your VND balance: ${formatCurrencyVND(userBalance.fiat_balance)}`
                                    : `Your ETH balance: ${userBalance.crypto_balance} ETH`}
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                                placeholder={`Enter amount in ${optionCurrency === "fiat" ? "VND" : "ETH"}`}
                            />
                            <p
                                className={`text-sm mt-1 ${helpText.amount.isValid ? "text-green-600" : "text-red-600"}`}>
                                {helpText.amount.helptext}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1 font-semibold">
                                Enter the amount
                            </label>
                            <input
                                disabled={!campaign.campaignInfo.metamask_add}
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 ${!campaign.campaignInfo.metamask_add && "cursor-not-allowed"}`}
                                placeholder={`Enter amount in ETH`}
                            />
                            <p
                                className={`text-sm mt-1 ${helpText.amount.isValid ? "text-green-600" : "text-red-600"}`}>
                                {helpText.amount.helptext}
                            </p>
                            <p className={`text-sm mt-1 text-red-600 font-semibold`}>
                                {statusMetamask}
                            </p>
                        </div>
                    )}
                </div>

                {/* Donor's info */}
                <div className="">
                    <h2 className="text-xl font-semibold text-gray-800">Let us know who you are</h2>

                    {/* Anonymous Toggle */}
                    <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => {
                                    setIsAnonymous((prev) => {
                                        if (!prev) setDonorName("Anonymous");
                                        return !prev;
                                    });
                                }}
                                className="peer hidden"
                            />
                            <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:border-green-700 peer-checked:bg-green-700 transition">
                                <span className="w-2.5 h-2.5 rounded-full bg-white peer-checked:bg-white"></span>
                            </span>
                            <span className="text-sm text-gray-700 font-medium">
                                Post anonymously
                            </span>
                        </label>
                    </div>

                    {/* Donor Name Input */}
                    <div className="space-y-1 mt-2">
                        <label className="text-sm font-medium text-gray-700">Your name</label>
                        <p className="text-xs text-gray-500">(Everyone will see who you are)</p>
                        <input
                            type="text"
                            value={isAnonymous ? "Anonymous" : donorName}
                            disabled={isAnonymous}
                            onChange={handleNameChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-1 mt-2">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <p className="text-xs text-gray-500">(Something to tell...)</p>
                        <textarea
                            value={message}
                            onChange={handleMessageChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                            rows="4"></textarea>
                    </div>

                    <p
                        className={`text-sm mt-1 ${helpText.info.isValid ? "text-green-600" : "text-red-600"}`}>
                        {helpText.info.helpText}
                    </p>
                </div>

                {/* Notice Block */}
                <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded-md">
                    <p className="text-sm text-gray-700 mb-2">
                        🙏 <strong>Thank you for your support!</strong> Your contribution helps
                        improve lives and bring real impact.
                    </p>
                    <p className="text-sm text-red-600 mb-2">
                        ⚠️ If you notice anything suspicious or incorrect about this campaign,{" "}
                        <strong>please do not proceed with the donation</strong> and report it to
                        our admin immediately.
                    </p>
                    <p className="text-sm text-blue-600">
                        💡 Want to support our platform?{" "}
                        <a href="#" className="underline text-blue-700 hover:text-blue-900">
                            Donate to help us grow the community and maintain the website
                        </a>
                        .
                    </p>
                </div>

                {/* Donate Button */}
                <div className="mt-6 flex flex-col">
                    {
                        <span className="text-gray-600 text-sm">
                            * you need to fill the required fields
                        </span>
                    }
                    <button
                        disabled={!(helpText.amount.isValid && helpText.info.isValid)}
                        onClick={() => {
                            if (optionCurrency !== "metamask") {
                                handleDonation();
                                return;
                            } else {
                                handleMetamask();
                                return;
                            }
                        }}
                        className={`mt-4 px-4 py-3 text-white rounded ${
                            helpText.amount.isValid && helpText.info.isValid
                                ? "bg-green-800 hover:bg-green-950 cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}>
                        {loading ? (
                            <>
                                <CircularProgress className="animate-spin" />
                            </>
                        ) : (
                            "Donate"
                        )}
                    </button>
                </div>
            </div>
            <Dialog open={openDialog} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle className="text-green-700 font-semibold">
                    🎉 Thank You for Your Donation!
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1" className="text-gray-700 mb-2">
                        Your support means a lot! With your contribution, we can continue building
                        better tools, helping more people, and making a bigger impact.
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        Every donation helps will make a different life. Thank you for being part of
                        our journey!
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="contained" color="success">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DonationCampaign;
