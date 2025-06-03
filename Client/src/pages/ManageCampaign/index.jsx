import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    ManageCampaignDashboard,
    ManageCampaignUpdate,
    ManageCampaignUpdateImages,
    WithdrawRequest
} from "./components";

import { getFullInfoCampaignById } from "../../services/api/campaignApi";

const OPTIONS = [
    {
        label: "Dashboard",
        value: "dashboard",
        component: ({ campaignId, isSuspend }) => (
            <ManageCampaignDashboard campaignId={campaignId} isSuspend={isSuspend} />
        )
    },
    {
        label: "Update Campaign",
        value: "update-campaign",
        component: ({ campaignId, isSuspend }) => (
            <ManageCampaignUpdate campaignId={campaignId} isSuspend={isSuspend} />
        )
    },
    {
        label: "Update Images",
        value: "update-images",
        component: ({ campaignId, isSuspend }) => (
            <ManageCampaignUpdateImages campaignId={campaignId} isSuspend={isSuspend} />
        )
    },
    {
        label: "Withdraw request",
        value: "withdraw-request",
        component: ({ campaignId, isSuspend }) => (
            <WithdrawRequest campaignId={campaignId} isSuspend={isSuspend} />
        )
    }
];

function ManageCampaign() {
    const { campaignId } = useParams();
    const [active, setActive] = useState("dashboard");
    const [isSuspend, setIsSuspend] = useState(false);

    useEffect(() => {
        const fetchInitState = async () => {
            const res = await getFullInfoCampaignById(campaignId);

            setIsSuspend(res.results.campaignInfo.isSuspend);
        };

        fetchInitState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const current = OPTIONS.find((item) => item.value === active);

    return (
        <div className="w-full py-10 px-2 md:px-10 flex flex-col md:flex-row items-start gap-5">
            {/* Buttons container */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto flex-wrap">
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setActive(option.value)}
                        className={`md:px-4 md:py-3 px-6 py-3 rounded cursor-pointer md:text-lg font-semibold ${
                            active === option.value ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}>
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Vertical Divider */}
            <div className="ml-5 mr-10 hidden md:block w-px self-stretch bg-[#e0ddd6]" />

            {/* Element display */}
            <div className="flex-1 w-full">{current?.component({ campaignId, isSuspend })}</div>
        </div>
    );
}

export default ManageCampaign;
