import HomePage from "./HomePage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCampaignsByFilter } from "../../services/api/campaignApi";
import { Loading } from "../../components/UI";

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

function Home() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [contentPages, setContentPages] = useState(null);

    useEffect(() => {
        if (user?.role === "admin") {
            navigate("/admin");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchInitState = async () => {
            const res = await getCampaignsByFilter();
            if (res.error === 0) {
                const datas = res.results.data;
                const campaigns = datas.map((item) => ({
                    imgSrc: item.campaign_image,
                    title: item.title,
                    progress: item.current_fiat,
                    target: item.goal_fiat,
                    donations: formatCurrencyVND(item.current_fiat),
                    link: `/campaign/discover/${item.campaign_id}`,
                    description: item.description
                }));
                setContentPages(campaigns);
            }
        };

        fetchInitState();
    }, []);

    if (!contentPages) return <Loading />;

    return (
        <div>
            <HomePage contentPages={contentPages} />
        </div>
    );
}

export default Home;
