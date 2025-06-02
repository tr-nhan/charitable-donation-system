import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

import { Loading } from "../../components/UI";
import { getUserInfo } from "../../services/api/userApi";
import { getCampaignsByUser } from "../../services/api/campaignApi";

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

function DiscoverUser() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [campaigns, setCampaigns] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await getUserInfo({ user_id: userId });
                if (res.error === 0 && res.results.length > 0) {
                    setUserInfo(res.results[0]);
                }
                const response = await getCampaignsByUser(userId);
                if (response.error === 0) {
                    setCampaigns(response.results);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    if (!userInfo || campaigns === null) return <Loading />;

    return (
        <div className="p-0 md:py-10 w-full h-full bg-[#f4f2ec] flex justify-center items-center">
            <div className="md:p-10 px-5 py-10 bg-white md:rounded-3xl md:w-[45%] w-full shadow-lg relative">
                {/* Profile Section */}
                <div className="flex flex-col justify-start items-center gap-2">
                    <Avatar
                        src={userInfo.profile_image}
                        sx={{
                            width: 100,
                            height: 100,
                            border: "2px dashed #ccc"
                        }}
                    />
                    <h1 className="text-2xl font-bold text-gray-800">
                        {userInfo.full_name || "Unnamed User"}
                    </h1>
                    <p className="text-sm text-gray-600 italic">
                        {userInfo.bio || "This user hasn't written a bio yet."}
                    </p>

                    <div className="mt-4">
                        {userInfo.private ? (
                            <p className="text-red-600 font-medium">🚫 This account is private.</p>
                        ) : (
                            <p className="text-gray-700">
                                📧 <span className="font-medium">Contact:</span>{" "}
                                <a
                                    href={`mailto:${userInfo.email}`}
                                    className="text-blue-600 underline">
                                    {userInfo.email}
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                {/* Scam Notice */}
                <div className="mt-6 text-sm text-center text-gray-500">
                    <p>
                        ⚠️ If you notice anything suspicious or believe this account is involved in
                        a scam, please{" "}
                        <a href="/contact" className="text-blue-600 hover:underline font-medium">
                            contact us immediately
                        </a>
                        .
                    </p>
                </div>

                <hr className="w-full my-6 border-[#e5e1d7]" />

                {/* Campaigns Section */}
                <div className="w-full">
                    {campaigns.length === 0 ? (
                        <div className="flex flex-col items-center text-center text-gray-600">
                            <h2 className="text-lg font-medium">
                                This user hasn't started any campaigns yet.
                            </h2>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>
                                    ⚠️ If you notice anything suspicious or believe any content is
                                    misleading or fraudulent, please{" "}
                                    <a
                                        href="/contact"
                                        className="text-blue-600 hover:underline font-medium">
                                        report it immediately
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h1 className="mb-5 text-xl font-semibold">The Campaigns</h1>
                            {campaigns.map((campaign) => (
                                <div
                                    key={campaign.campaign_id}
                                    className="mt-2 py-3 px-3 rounded-2xl bg-[#fbfaf8] w-full border border-[#c0bdb8] hover:bg-[#2525250d] hover:border-black transition cursor-pointer flex flex-row gap-3 items-start"
                                    onClick={() =>
                                        navigate(`/campaign/discover/${campaign.campaign_id}`)
                                    }>
                                    <Avatar
                                        src={campaign.campaign_image}
                                        variant="rounded"
                                        sx={{ width: 60, height: 60 }}
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold">{campaign.title}</h2>
                                        <p className="text-sm">
                                            <b>Goal:</b>{" "}
                                            <span className="text-green-900">
                                                {formatCurrencyVND(campaign.goal_fiat)}
                                            </span>
                                        </p>
                                        <p className="text-sm text-[#6f6f6f]">
                                            Current:{" "}
                                            {(
                                                (campaign.current_fiat / campaign.goal_fiat) *
                                                100
                                            ).toFixed(2)}
                                            % of goal
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DiscoverUser;
