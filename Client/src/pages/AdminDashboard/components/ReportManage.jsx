import { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Loading } from "../../../components/UI";
import { getCampaignInfoFollowingReport } from "../../../services/api/campaignApi";

function ReportManage() {
    const [campaigns, setCampaigns] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const fetchInitState = async () => {
        const res = await getCampaignInfoFollowingReport();
        setCampaigns(res.results);
    };

    useEffect(() => {
        fetchInitState();
    }, []);

    if (!campaigns) return <Loading />;

    const filteredCampaigns = campaigns.filter(
        (c) =>
            c.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            c.campaign_id.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="p-6">
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
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Campaign grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCampaigns.map((c) => (
                    <div
                        key={c.campaign_id}
                        className="bg-white border rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition duration-200">
                        <img
                            src={c.campaign_image}
                            alt={c.title}
                            className="w-full md:w-48 h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-1">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">{c.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    <strong>ID:</strong> {c.campaign_id}
                                </p>
                            </div>
                            <div className="mt-4">
                                <span className="inline-block bg-red-100 text-red-700 font-medium text-sm px-3 py-1 rounded-full">
                                    ⚠️ {c.report_count}{" "}
                                    {c.report_count === "1" ? "report" : "reports"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCampaigns.length === 0 && (
                    <p className="text-center col-span-full text-gray-500 text-sm">
                        No campaigns found matching your search.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ReportManage;
