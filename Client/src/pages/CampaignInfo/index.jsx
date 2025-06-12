import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getFullInfoCampaignById } from "../../services/api/campaignApi";
import DonationInfo from "./DonationInfo";
import CampaignInfo from "./CampaignInfo";
import { Loading } from "../../components/UI";

function CampaignFullInfo() {
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        const fetchFullInfoCampaign = async () => {
            const res = await getFullInfoCampaignById(campaignId);
            if (res.error === 0) {
                console.log(res.results);
                
                setCampaign(res.results);
            }
        };
        fetchFullInfoCampaign();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!campaign) return <Loading />;

    return (
        <div className="w-full px-5 py-5 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-4">
            <CampaignInfo campaign={campaign} />
            <DonationInfo campaign={campaign} />
        </div>
    );
}

export default CampaignFullInfo;
