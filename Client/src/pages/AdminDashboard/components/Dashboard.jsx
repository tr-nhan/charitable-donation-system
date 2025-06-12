import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { Loading } from "../../../components/UI";
import { getCampaignsByFilter } from "../../../services/api/campaignApi";

const formatCurrencyVND = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3
    }).format(parsed);
};

function getGreenShade(percent) {
    if (percent < 25) return "#d1fae5";
    if (percent < 50) return "#6ee7b7";
    if (percent < 75) return "#34d399";
    return "#059669"; // emerald-600
}

function Dashboard() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [campaigns, setCampaigns] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async (q = searchInput, pageNumber = page) => {
        setLoading(true);
        const res = await getCampaignsByFilter({ q, page: pageNumber });
        if (pageNumber === 1) {
            setCampaigns(res.results.data);
        } else {
            setCampaigns((prev) => [...prev, ...res.results.data]);
        }
        setTotalPage(res.results.totalPage);
        setLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setPage(1);
        fetchCampaigns(e.target.value, 1);
    };

    const handleShowMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCampaigns(searchInput, nextPage);
    };

    if (loading && campaigns.length === 0) return <Loading />;

    return (
        <div>
            <h2 className="mb-12 text-2xl font-semibold">Reported Campaigns</h2>

            <div className="mb-6 w-full">
                <h3 className="mb-2 text-center text-xl text-gray-700">
                    Search by campaign ID or title
                </h3>
                <div className="ml-auto mr-auto relative w-full max-w-xl">
                    <SearchOutlinedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearch}
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Campaign List */}
            <div className="w-full max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {campaigns.map((c, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 animate-fade-in cursor-pointer"
                            onClick={() => navigate(`/admin/manage/campaign/${c.campaign_id}`)}>
                            <img
                                src={c.campaign_image}
                                alt="Campaign thumbnail"
                                className="w-full h-40 object-cover rounded-xl mb-4"
                            />
                            <h2 className="text-lg font-semibold mb-1 truncate">{c.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">by {c.full_name}</p>
                            {/* Custom Progress Bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full`}
                                    style={{
                                        width: `${(c.current_fiat / c.goal_fiat) * 100}%`,
                                        backgroundColor: getGreenShade(
                                            (c.current_fiat / c.goal_fiat) * 100
                                        )
                                    }}></div>
                            </div>

                            <b className="text-sm text-green-700">
                                {formatCurrencyVND(c.current_fiat)} raised
                            </b>
                        </div>
                    ))}
                </div>

                {/* pagination */}
                {page < totalPage && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleShowMore}
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300">
                            Show more
                        </button>
                    </div>
                )}
            </div>

            {page < totalPage && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleShowMore}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
                        Show more
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
