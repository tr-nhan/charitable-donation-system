import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import VolunteerActivismTwoToneIcon from "@mui/icons-material/VolunteerActivismTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownTwoTone";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import ReportProblemTwoToneIcon from "@mui/icons-material/ReportProblemTwoTone";

import "./customStyle.css";
import ShareCampaign from "./components/ShareCampaign";
import {
    insertCampaignReaction,
    updateCampaignReaction,
    deleteCampaignReaction
} from "../../services/api/campaignApi";
import { getUserInfo } from "../../services/api/userApi";
import { Loading } from "../../components/UI";

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

function CampaignInfo({ campaign }) {
    const userId = useSelector((state) => state.auth.user.user_id);
    const navigate = useNavigate();
    const refReactionButton = useRef(null);
    // innit
    const info = campaign.campaignInfo;
    const images = campaign.campaignImages;
    const [reactions, setReactions] = useState(campaign.campaignReactions);
    const donations = campaign.campaignDonations;
    // description
    const descriptionRef = useRef();
    const [showFull, setShowFull] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    // Share campaign
    const [openShareCampaign, setOpenShareCampaign] = useState(false);
    // reactions
    const [showReactionsBar, setShowReactionsBar] = useState(false);
    const [reactionChoice, setReactionChoice] = useState(() => {
        const type = reactions.data.map((user) => {
            if (user.user_id === userId) return user.reaction_type;
        });
        return type[0] || null;
    });
    // creator
    const [creator, setCreator] = useState({});

    // if (!creator) return <Loading />;

    useEffect(() => {
        // Fetch creator info
        const fetchCreatorInfo = async () => {
            const res = await getUserInfo({ user_id: info.creator_id });
            if (res.error !== 0) return;
            setCreator(res.results[0]);
        };
        fetchCreatorInfo();

        const handleLengthDescription = () => {
            const el = descriptionRef.current;
            if (el.scrollHeight > 300) {
                setIsOverflow(true);
            }
        };
        handleLengthDescription();

        const handleClickOutside = (event) => {
            if (refReactionButton.current && !refReactionButton.current.contains(event.target)) {
                setShowReactionsBar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeReaction = async (type) => {
        if (info.isSuspend) return;
        if (reactionChoice === type) {
            setReactionChoice(null);
            const res = await deleteCampaignReaction({ campaignId: info.campaign_id });
            if (res.error !== 0) return;

            setReactions((prev) => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    [`number_of_${type}`]: prev.stats[`number_of_${type}`] - 1,
                    total_reaction: prev.stats.total_reaction - 1
                },
                data: prev.data.filter((user) => user.user_id !== userId)
            }));
        } else if (reactionChoice === null || !reactionChoice) {
            setReactionChoice(type);
            const res = await insertCampaignReaction({
                campaignId: info.campaign_id,
                reactionType: type
            });
            if (res.error !== 0) return;
            setReactions((prev) => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    [`number_of_${type}`]: prev.stats[`number_of_${type}`] + 1,
                    total_reaction: prev.stats.total_reaction + 1
                },
                data: [...prev.data, { user_id: userId, reaction_type: type }]
            }));
        } else {
            setReactionChoice(type);
            const res = await updateCampaignReaction({
                campaignId: info.campaign_id,
                reactionType: type
            });
            if (res.error !== 0) return;
            setReactions((prev) => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    [`number_of_${reactionChoice}`]: prev.stats[`number_of_${reactionChoice}`] - 1,
                    [`number_of_${type}`]: prev.stats[`number_of_${type}`] + 1
                },
                data: prev.data.map((user) => {
                    if (user.user_id === userId) {
                        return { ...user, reaction_type: type };
                    }
                    return user;
                })
            }));
        }
        setShowReactionsBar(false);
    };

    return (
        <div className="w-full col-span-3 md:col-span-2">
            {info.isSuspend && (
                <p
                    style={{
                        color: "red",
                        backgroundColor: "#ffe5e5",
                        padding: "10px",
                        border: "1px solid red",
                        borderRadius: "5px",
                        marginBottom: "15px"
                    }}>
                    ⚠️ This campaign has been suspended due to suspicious activity, including
                    potential scam behavior, multiple user reports, or violations of our platform
                    policies. Please proceed with caution and contact our support team if you need
                    further clarification.
                </p>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-semibold">{info.title}</h1>

            {/* Campaign thumbnail */}
            <img src={info.campaign_image} alt="Campaign_Img" className="mt-2 w-full" />

            {/* Goal and Currnent amout */}
            <hr className="hidden md:block border-[#e0ddd6] shadow-2xl" />
            <div className="w-full flex justify-start items-center md:hidden">
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
                <IconButton
                    ref={refReactionButton}
                    sx={{ padding: "10px", border: "solid 2px #e0ddd6", position: "relative" }}
                    onClick={() => setShowReactionsBar((prev) => !prev)}>
                    <VolunteerActivismTwoToneIcon sx={{ color: "green" }} />
                    {showReactionsBar && (
                        <div className="py-1 absolute top-[-120%] left-1 min-w-[200px] bg-white shadow-sm rounded-sm cursor-auto reaction-panel-enter">
                            {REACTIONS_TYPE.map((r) => {
                                return (
                                    <IconButton
                                        key={r.type}
                                        sx={{
                                            backgroundColor:
                                                reactionChoice === r.type ? "#f5f5f5" : "white",
                                            marginLeft: "10px",
                                            padding: "5px"
                                        }}
                                        onClick={() => handleChangeReaction(r.type)}>
                                        <r.component style={{ color: r.color }} />
                                    </IconButton>
                                );
                            })}
                        </div>
                    )}
                </IconButton>
                <div className="ml-5 flex justify-center items-center">
                    {reactions.stats.total_reaction < 0 ? (
                        <div className="text-sm font-medium text-gray-500">No reactions yet</div>
                    ) : (
                        <div className="flex flex-row gap-2 ml-3">
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

            {/* List of Donors */}
            <div className="mt-1 bg-white rounded-xl py-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 italic">
                    Donors
                </h2>
                <hr className="mb-4 border-[#e0ddd6]" />

                {donations.data.length === 0 ? (
                    <h3 className="text-lg font-semibold text-center text-gray-600 italic">
                        Let be the first
                    </h3>
                ) : (
                    <div className="space-y-6">
                        {donations.data.map((donor, i) => (
                            <div key={i} className="space-y-2">
                                {/* Title Line */}
                                <ul className="flex flex-wrap items-center gap-2 text-base font-semibold italic text-gray-800">
                                    <li className="text-lg">
                                        {donor.is_anonymous ? "Anonymous" : donor.donor_name}
                                    </li>
                                    <li>•</li>
                                    <li>
                                        {donor.fiat_amount === 0
                                            ? `${Number(donor.crypto_amount).toFixed(3)} ETH`
                                            : formatCurrencyVND(donor.fiat_amount)}
                                    </li>
                                    <li>•</li>
                                    <li className="text-gray-500 text-[12px]">
                                        {new Date(donor.created_at).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </li>
                                </ul>

                                {/* Message */}
                                {donor.donation_message && (
                                    <p className="text-sm italic text-gray-600">
                                        {donor.donation_message}
                                    </p>
                                )}

                                {/* Divider between donors */}
                                {i < donations.data.length - 1 && (
                                    <hr className="mt-4 border-t border-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* List of Images */}
            {images.length > 0 && (
                <div className="mt-6 py-3 overflow-x-auto w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 italic">
                        Images
                    </h2>
                    <hr className="mb-4 border-[#e0ddd6]" />
                    <div className="flex flex-row items-center gap-5 w-max mr-auto ml-auto">
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
            )}

            {/* Button Donation and Share */}
            <div className="p-5 mt-4 w-full border border-[#e0ddd6] grid grid-cols-6 gap-4 sm:hidden bg-white rounded-xl shadow-sm">
                <button
                    onClick={() => setOpenShareCampaign(true)}
                    className="col-span-2 w-full py-3 bg-green-100 text-green-800 font-medium rounded-2xl hover:bg-green-200 transition-colors duration-200 cursor-pointer">
                    Share
                </button>
                <button
                    disabled={userId === info.creator_id || info.isSuspend}
                    onClick={() => {
                        if (info.isSuspend) return;
                        navigate(`/donation/${info.campaign_id}`);
                    }}
                    className="col-span-4 w-full py-3 bg-green-800 text-white font-semibold rounded-2xl hover:bg-green-900 transition-colors duration-200 shadow-md cursor-pointer">
                    Donation
                </button>
                {/* Share campaign */}
                <ShareCampaign
                    open={openShareCampaign}
                    onClose={() => setOpenShareCampaign(false)}
                    data={{
                        campaign_image: info.campaign_image,
                        campaignId: info.campaign_id
                    }}
                />
            </div>

            {/* Updated Info */}
            {info.update_time > 0 && (
                <div className="mt-6 bg-white rounded-xl py-5">
                    {/* Heading */}
                    <h2 className="text-lg sm:text-xl font-semibold italic text-gray-800 mb-2">
                        {`Update (${info.update_time}) • ${info.latest_title}`}
                    </h2>
                    <hr className="mb-4 border-[#e0ddd6]" />

                    {/* UPDATE CONTENT */}
                    <div className="relative text-gray-700 leading-relaxed text-sm">
                        <div dangerouslySetInnerHTML={{ __html: info.latest_content }} />
                    </div>
                </div>
            )}

            {/* Created info  */}
            {creator ? (
                <div>
                    <hr className="border-[#e0ddd6]" />
                    <div className="my-5 flex flex-row justify-start items-start h-full">
                        <div
                            onClick={() => navigate(`/user/discover/${creator.user_id}`)}
                            className="flex flex-row justify-start items-center cursor-pointer">
                            <Avatar src="creator.profile_image" alt="" />
                            <div className="ml-5 flex flex-col justify-between items-start">
                                <span className="text-stone-600 font-semibold">
                                    <IconButton sx={{ padding: "0px", marginRight: "5px" }}>
                                        <VerifiedUserTwoToneIcon sx={{ color: "green" }} />
                                    </IconButton>
                                    Organized
                                </span>
                                <span className="font-semibold">
                                    {creator.full_name} organizing this fundraiser.
                                </span>
                            </div>
                        </div>
                        <div className="w-[1px] h-[50px] bg-gray-300 mx-10"></div>
                        <div className="text-sm text-gray-500 italic">
                            Created{" "}
                            {new Date(info.created_at).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short"
                            })}
                        </div>
                    </div>
                    <hr className="border-[#e0ddd6]" />
                </div>
            ) : (
                <Loading />
            )}

            {/* Report */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                    <ReportProblemTwoToneIcon sx={{ color: "red" }} />
                </div>

                <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-700 font-medium">
                        Is there something wrong?
                    </span>
                    <button
                        onClick={() => navigate(`/campaign/report/${info.campaign_id}`)}
                        className="text-sm text-red-600 hover:text-red-800 font-semibold underline transition duration-150 ease-in-out cursor-pointer">
                        Report this campaign
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CampaignInfo;
