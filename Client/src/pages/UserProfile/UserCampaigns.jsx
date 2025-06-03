import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Avatar } from "@mui/material";

import { getCampaignsByUser } from "../../services/api/campaignApi";
import Loading from "../../components/UI/Loading";

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

function UserCampaigns() {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user.user_id);
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const response = await getCampaignsByUser(userId);

                if (response.error === 0) {
                    setCampaigns(response.results);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {campaigns.length === 0 ? (
                <div className="px-10 w-full flex flex-col justify-start items-center">
                    <h2 className="text-center text-[#252525] font-semibold text-xl">
                        No Campaigns
                    </h2>
                    <h3 className="text-center text-[#949392]">Create a new one now!</h3>
                    <Button
                        sx={{
                            backgroundColor: "#008044",
                            marginTop: "10px",
                            minWidth: "200px",
                            maxWidth: "500px",
                            color: "#fbfaf8",
                            fontWeight: "600",
                            paddingY: "10px",
                            ":hover": {
                                color: "#949392"
                            }
                        }}
                        onClick={() => navigate("/create-campaign")}>
                        Start a Fund
                    </Button>
                </div>
            ) : (
                <div className="md:px-10 w-full flex flex-col justify-start items-center">
                    <h1 className="mb-5 text-xl font-semibold">Your Campaigns</h1>
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.campaign_id}
                            className="mt-2 py-3 px-3 rounded-2xl bg-[#fbfaf8] w-[400px] md:w-[500px] border-[1px] border-[#c0bdb8] hover:border-2 hover:bg-[#2525250d] hover:border-black cursor-pointer flex flex-row gap-3 items-start justify-start"
                            onClick={() => navigate(`/campaign/manage/${campaign.campaign_id}`)}>
                            <Avatar src={campaign.campaign_image} variant="rounded" />
                            <div>
                                <div className="flex-1 flex flex-col justify-center items-start">
                                    <h2 className="text-lg font-semibold truncate max-w-[300px] md:max-w-[400px]">
                                        {campaign.title}
                                    </h2>
                                </div>
                                <div className="flex flex-col justify-center items-start">
                                    <h2 className="text-sm">
                                        <b>Goal:</b>{" "}
                                        <span className="text-green-900">
                                            {formatCurrencyVND(campaign.goal_fiat)}
                                        </span>
                                    </h2>
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
                        </div>
                    ))}
                </div>
            )}
            {loading && <Loading />}
        </>
    );
}

export default UserCampaigns;
