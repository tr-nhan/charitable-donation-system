import { useState } from "react";
import { useParams } from "react-router-dom";

import { ManageCampaignDashboard, ManageCampaignUpdate, ManageCampaignUpdateImages } from "./components";

const OPTIONS = [
    {
        label: "Dashboard",
        value: "dashboard",
        component: ({ campaignId }) => <ManageCampaignDashboard campaignId={campaignId} />
    },
    {
        label: "Update Campaign",
        value: "update-campaign",
        component: ({ campaignId }) => <ManageCampaignUpdate campaignId={campaignId} />
    },
    {
        label: "Update Images",
        value: "update-images",
        component: ({ campaignId }) => <ManageCampaignUpdateImages campaignId={campaignId} />
    },
    
];

function ManageCampaign() {
    const { campaignId } = useParams();
    const [active, setActive] = useState("dashboard");

    const current = OPTIONS.find((item) => item.value === active);

    return (
        <div className="w-full py-10 px-2 md:px-10 flex flex-col md:flex-row items-start gap-5">
            {/* Buttons container */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setActive(option.value)}
                        className={`px-4 py-3 rounded cursor-pointer text-lg font-semibold ${
                            active === option.value ? "bg-green-800 text-white" : "bg-gray-200"
                        }`}>
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Vertical Divider */}
            <div className="ml-5 mr-10 hidden md:block w-px self-stretch bg-[#e0ddd6]" />

            {/* Element display */}
            <div className="flex-1 w-full">{current?.component({ campaignId })}</div>
        </div>
    );
}

export default ManageCampaign;
