import { useState } from "react";
import { Dialog, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

import bgShareProfile from "../../assets/images/bgShareProfile.jpg";

function DonationInfo({ campaign }) {
    const userId = useSelector((state) => state.auth.user.user_id);
    const navigate = useNavigate();
    // innit
    const info = campaign.campaignInfo;
    const donations = campaign.campaignDonations;

    // share campaign
    const [openShareCampaign, setOpenShareCampaign] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `http://localhost:3000/campaign/discover/${info.campaign_id}`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    return (
        <div className="hidden md:block w-full h-fit max-w-sm bg-white rounded-2xl p-6 shadow-md">
            {/* Raised amount + percentage */}
            <div className="flex flex-col justify-center items-start mb-4">
                <div>
                    <p className="text-3xl font-bold text-green-900">
                        {formatCurrencyVND(info.current_fiat)} raised
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600">
                            Goal {formatCurrencyVND(info.goal_fiat)} · {donations.stats.total_count}{" "}
                            donations
                        </p>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                            Primary goal
                        </span>
                    </div>
                </div>
                <div className="mt-6">
                    <p className="text-xl font-bold text-gray-900">
                        {info.current_crypto} ETH raised
                    </p>
                    <p className="text-[12px] text-gray-500">
                        Goal {info.goal_crypto} ETH · {donations.stats.total_count} donations
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mb-4">
                <button
                    onClick={() => setOpenShareCampaign(true)}
                    className="bg-lime-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-lime-400 transition cursor-pointer">
                    Share
                </button>
                <button
                    disabled={userId === info.creator_id || info.isSuspend}
                    onClick={() => {
                        if (info.isSuspend) return;
                        navigate(`/donation/${info.campaign_id}`);
                    }}
                    className="bg-green-800 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer">
                    Donate now
                </button>
            </div>

            {/* Activity summary */}
            <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-600 rounded-full px-2 py-1 text-xs font-medium">
                    {donations.stats.total_count || 0} people just donated
                </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium cursor-pointer"
                    onClick={() => navigate("/campaign/search")}>
                    Discover more
                </button>
            </div>

            {/* Dialog Share Campaign */}
            <Dialog
                open={openShareCampaign}
                onClose={() => setOpenShareCampaign(false)}
                PaperProps={{
                    style: {
                        backgroundImage: `url(${bgShareProfile})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "10px"
                    }
                }}>
                <div className="min-w-[500px] min-h-[200px] p-5 flex flex-col justify-start items-center">
                    <Avatar
                        src={info.campaign_image}
                        alt="Avatar"
                        sx={{ width: "70px", height: "70px", marginTop: "-5px" }}
                    />
                    <h1 className="mt-1 text-2xl text-center font-semibold">
                        Share this Campaign for everyone.
                    </h1>
                    <h2 className="text-sm text-center text-[#505050]">
                        Add this link to your social media or share directly with others.
                    </h2>
                    <div className="mt-1 flex flex-row justify-between items-center gap-2 w-full max-w-[450px]">
                        <div
                            className={`relative cursor-no-drop bg-white hover:bg-[#fbfaf8] flex flex-col justify-between px-5 py-1 rounded-lg w-full border-[1px] border-[#c0bdb8]`}>
                            <span className="text-[12px] text-[#6f6f6f]">Profile link</span>
                            <input
                                type="text"
                                value={`http://localhost:3000/campaign/discover/${info.campaign_id}`}
                                className="w-full border-0 focus:border-0 focus:outline-none focus:ring-0 resize-none cursor-no-drop"
                                readOnly
                            />
                        </div>
                        <Button
                            variant="contained"
                            sx={{
                                minWidth: "125px",
                                maxWidth: "130px",
                                minHeight: "100%",
                                borderRadius: "10px",
                                backgroundColor: copied ? "#e5e1d7" : "#252525",
                                fontSize: "14px",
                                color: copied ? "#252525" : "white"
                            }}
                            onClick={handleCopy}
                            disabled={copied}>
                            {copied ? "Copied!" : "Copy Link"}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default DonationInfo;
