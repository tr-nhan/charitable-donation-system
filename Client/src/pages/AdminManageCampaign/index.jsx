import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "../../components/UI";
import { MainInfo, ReactionImages, Donors, Report } from "./components";
import { getFullInfoCampaignById } from "../../services/api/campaignApi";

const OPTIONS = [
    {
        label: "Main Info",
        value: "main_info",
        component: (data) => (
            <MainInfo info={data.campaignInfo} donations={data.campaignDonations} />
        )
    },
    {
        label: "Reactions And Images",
        value: "r_i",
        component: (data) => (
            <ReactionImages reactions={data.campaignReactions} images={data.campaignImages} />
        )
    },
    {
        label: "Donors",
        value: "donoations",
        component: (data) => <Donors donations={data.campaignDonations} />
    },
    {
        label: "Reports",
        value: "report",
        component: (data) => <Report reports={data.campaignReports} />
    }
];

function AdminManageCampaign() {
    const { campaignId } = useParams();
    const [active, setActive] = useState("main_info");
    const current = OPTIONS.find((item) => item.value === active);
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        const fetchInitState = async () => {
            const res = await getFullInfoCampaignById(campaignId);
            setCampaign(res.results);
        };

        fetchInitState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!campaign) return <Loading />;

    return (
        <div className="w-full py-10 px-2 md:px-20 flex flex-col md:flex-row items-start gap-5">
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
            <div className="flex-1 w-full">{current?.component(campaign)}</div>
        </div>
    );
}

export default AdminManageCampaign;
