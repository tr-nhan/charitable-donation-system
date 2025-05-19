import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Avatar } from "@mui/material";

import { getCampaignsByUser } from "../../services/api/campaignApi";
import Loading from "../../components/UI/Loading";

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
        <div className="w-full mt-5">
            {campaigns.length === 0 ? (
                <div className="w-full flex flex-col justify-start items-center">
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
                <div className="w-full flex flex-col justify-start items-center">
                    <h1 className="mb-5 text-xl font-semibold">Your Campaigns</h1>
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.campaign_id}
                            className="py-3 px-3 rounded-2xl bg-[#fbfaf8] min-w-[400px] max-w-[600px] border-[1px] border-[#c0bdb8] hover:border-2 hover:bg-[#2525250d] hover:border-black cursor-pointer flex flex-row justify-between items-center">
                            <Avatar src={campaign.campaign_image} variant="rounded" />
                            <div className="ml-5 flex-1 flex flex-col justify-center items-start">
                                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                                <p className="truncate text-sm text-[#6f6f6f]">{campaign.description}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <h2>
                                    <b>Goal:</b> <span className="text-green-900">{campaign.goal_amount}</span>
                                </h2>
                                <p className="text-sm text-[#6f6f6f]">Current: {campaign.current_amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {loading && <Loading />}
        </div>
    );
}

export default UserCampaigns;
