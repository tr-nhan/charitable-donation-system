import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownTwoTone";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";
import CircularProgress from "@mui/material/CircularProgress";

import { Loading } from "../../../components/UI";
import {
    getFullInfoCampaignById,
    getCampaignsByUser,
    getUpdatedInfoCampaign,
    updateCampaignMetamaskAdd
} from "../../../services/api/campaignApi";

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

const REACTIONS_TYPE = [
    {
        type: "heart",
        component: FavoriteTwoToneIcon,
        color: "red"
    },
    {
        type: "thumb_up",
        component: ThumbUpAltTwoToneIcon,
        color: "blue"
    },
    {
        type: "thumb_down",
        component: ThumbDownTwoToneIcon,
        color: "orange"
    },
    {
        type: "smile",
        component: SentimentVerySatisfiedTwoToneIcon,
        color: "green"
    }
];

function ManageCampaignDashboard({ campaignId, isSuspend }) {
    const userId = useSelector((state) => state.auth.user.user_id);
    const navigate = useNavigate();
    // innitial state for campaign data
    const [campaign, setCampaign] = useState(null);
    const info = campaign?.campaignInfo;
    const images = campaign?.campaignImages;
    const reactions = campaign?.campaignReactions;
    const donations = campaign?.campaignDonations;
    // description
    const descriptionRef = useRef();
    const [showFull, setShowFull] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    // updated campaign data
    const [updatedCampaign, setUpdatedCampaign] = useState([]);
    // wallet address
    const [walletAdd, setWalletAdd] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchToCheckValidCampaign = async () => {
            try {
                const res = await getCampaignsByUser(userId);
                const campaigns = res.results;

                const isValidCampaign = campaigns.some((c) => c.campaign_id === campaignId);
                if (!isValidCampaign) {
                    navigate("/profile");
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        const fetchCampaign = async () => {
            try {
                const response = await getFullInfoCampaignById(campaignId);
                setCampaign(response.results);
                setWalletAdd(response.results.campaignInfo.metamask_add);
            } catch (error) {
                console.error("Error fetching campaign data:", error);
            }
        };

        const fetchUpdatedCampaign = async () => {
            try {
                const response = await getUpdatedInfoCampaign(campaignId);
                setUpdatedCampaign(response.results);
            } catch (error) {
                console.error("Error fetching updated campaign data:", error);
            }
        };

        fetchUpdatedCampaign();
        fetchToCheckValidCampaign();
        fetchCampaign();
    }, [userId, campaignId, navigate]);

    useEffect(() => {
        if (descriptionRef.current) {
            if (descriptionRef.current.scrollHeight > 300) {
                setIsOverflow(true);
            }
        }
    }, [campaign]);

    if (campaign === null) {
        return <Loading />;
    }

    const handleChangeAdd = async () => {
        try {
            setUpdating(true);

            const res = await updateCampaignMetamaskAdd(walletAdd, campaignId);

            if (res.error === 0) return;
            else setWalletAdd("Updating false, please try again!");
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="w-full">
            {isSuspend && (
                <p
                    style={{
                        color: "red",
                        backgroundColor: "#ffe5e5",
                        padding: "10px",
                        border: "1px solid red",
                        borderRadius: "5px",
                        marginBottom: "10px"
                    }}>
                    ⚠️ Your campaign has been suspended due to potential violations such as breaking
                    our policies, receiving multiple reports, or other suspicious activities. Please
                    contact our support team for more information.
                </p>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-semibold">{info?.title}</h1>

            {/* Thumbnail */}
            <img src={info.campaign_image} alt="" />

            {/* Wallet address */}
            <div className="mt-5 md:w-1/2 w-full mr-auto p-6 bg-white shadow-md rounded-xl space-y-4">
                {/* Notice */}
                {!walletAdd && (
                    <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md">
                        ⚠️ Please enter your MetaMask wallet address so others can donate to you via
                        crypto. This address will be public to donors.
                    </div>
                )}

                {/* Input + Button */}
                <div>
                    <label
                        htmlFor="wallet"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Wallet Address
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="wallet"
                            type="text"
                            value={walletAdd}
                            onChange={(e) => setWalletAdd(e.target.value)}
                            placeholder="0x123...abc"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <button
                            onClick={handleChangeAdd}
                            className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-950 transition cursor-pointer">
                            {updating ? (
                                <div className="flex justify-center items-center gap-1">
                                    <CircularProgress
                                        className="animate-spin"
                                        sx={{ color: "#032e15" }}
                                        size={15}
                                    />
                                    Updating...
                                </div>
                            ) : (
                                "Submit Update"
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        This will allow donors donate to this campaign through metamask.
                    </p>
                </div>
            </div>

            {/* Goal and Currnent amout */}
            <div className="w-full flex justify-start items-center max-w-[700px]">
                <div className="p-5 mt-4 w-full md:w-3/4 border border-[#e0ddd6] md:border-0 md:shadow-[0] grid grid-cols-6 gap-4 bg-white rounded-xl shadow-sm">
                    {/* Goal & Current */}
                    <div className="col-span-4 flex flex-col justify-center gap-2">
                        {/* Goal */}
                        <div className="text-lg font-semibold text-gray-800">
                            Goal:
                            <span className="ml-2 text-xl font-bold text-green-700">
                                {formatCurrencyVND(info.goal_fiat)}
                            </span>
                            {parseFloat(info.goal_crypto) > 0 && (
                                <>
                                    <span className="mx-1 text-gray-500">|</span>
                                    <span className="text-md font-medium text-green-600">
                                        {parseFloat(info.goal_crypto).toLocaleString()} ETH
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Current */}
                        <div className="text-sm font-medium text-gray-500">
                            Raised so far:
                            <span className="ml-2 font-semibold text-blue-500">
                                {formatCurrencyVND(info.current_fiat)}
                            </span>
                            {parseFloat(info.current_crypto) > 0 && (
                                <>
                                    <span className="mx-1 text-gray-400">|</span>
                                    <span className="text-sm font-medium text-blue-400">
                                        {parseFloat(info.current_crypto).toLocaleString()} ETH
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Seperator */}
                    <div className="hidden md:block w-[1px] h-full bg-gray-300 mx-auto col-span-1 md:col-span-1"></div>

                    {/* Number of Donations */}
                    <div className="flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                        <div className="text-3xl font-extrabold text-green-800">
                            {donations.stats.total_count}
                        </div>
                        <div className="text-sm font-medium text-gray-600">Donations Received</div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-1 bg-white rounded-xl py-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 italic">
                    Campaign Description
                </h2>
                <hr className="mb-4 border-[#e0ddd6]" />

                <div className="relative text-gray-700 leading-relaxed text-sm">
                    <div
                        ref={descriptionRef}
                        dangerouslySetInnerHTML={{ __html: info.description }}
                        className={`transition-all duration-300 overflow-hidden sm:text-[16px] ${
                            showFull ? "max-h-full" : "max-h-[300px]"
                        }`}
                    />

                    {/* Blur overlay */}
                    {!showFull && isOverflow && (
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl" />
                    )}
                </div>

                {/* Read More button */}
                {!showFull && isOverflow && (
                    <div className="mt-3 text-right">
                        <button
                            onClick={() => setShowFull(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 underline font-medium cursor-pointer">
                            Read more
                        </button>
                    </div>
                )}
            </div>

            {/* Reaction */}
            <div className="mt-8 flex flex-row">
                <div className="flex justify-center items-center">
                    {reactions.stats.total_reaction < 0 ? (
                        <div className="text-sm font-medium text-gray-500">No reactions yet</div>
                    ) : (
                        <div className="flex flex-row gap-2">
                            {REACTIONS_TYPE.map((r) => {
                                const count = reactions.stats[`number_of_${r.type}`];
                                return (
                                    <div
                                        key={r.type}
                                        className="ml-4 flex flex-row items-center gap-1">
                                        <r.component style={{ color: r.color }} />
                                        <span className="text-sm font-medium text-gray-500 underline">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Updated Info */}
            {info.update_time > 0 ? (
                updatedCampaign.map((item, i) => (
                    <div className="mt-6 bg-white rounded-xl py-5" key={i}>
                        {/* Heading */}
                        <h2 className="text-lg sm:text-xl font-semibold italic text-gray-800 mb-2">
                            {`Update (${item.update_number}) • ${item.title}`}
                        </h2>
                        <hr className="mb-4 border-[#e0ddd6]" />

                        {/* UPDATE CONTENT */}
                        <div className="relative text-gray-700 leading-relaxed text-sm">
                            <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        </div>
                    </div>
                ))
            ) : (
                <div className="mt-6 bg-white rounded-xl p-6 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 italic">
                        Updated Info
                    </h2>
                    <p className="text-gray-500 text-sm">
                        You haven't posted any updates yet. Start sharing progress to keep
                        supporters informed!
                    </p>
                </div>
            )}

            {/* List of Images */}
            {images.length > 0 ? (
                <div className="mt-6 py-3 px-5 overflow-x-auto max-w-[500px] md:max-w-[700px]">
                    <div className="flex flex-row items-center gap-5 w-max">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className="w-[100px] h-[100px] rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={img}
                                    alt="Campaign_Img"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-6 py-6 px-5 bg-white rounded-xl text-center text-gray-500 text-sm shadow-sm italic">
                    No campaign images have been uploaded yet.
                </div>
            )}
        </div>
    );
}

export default ManageCampaignDashboard;
