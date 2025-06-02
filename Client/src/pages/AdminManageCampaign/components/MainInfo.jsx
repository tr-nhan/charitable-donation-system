import { useState, useRef, useEffect } from "react";

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

import { updateCampaignSuspend } from "../../../services/api/campaignApi";

function MainInfo({ info, donations }) {
    // description
    const descriptionRef = useRef();
    const [showFull, setShowFull] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const [campaign, setCampaign] = useState(info);

    useEffect(() => {
        const handleLengthDescription = () => {
            const el = descriptionRef.current;
            if (el.scrollHeight > 300) {
                setIsOverflow(true);
            }
        };
        handleLengthDescription();
    }, []);

    const handleOnclickSuspend = () => {
        const fetchUpdateSuspend = async () => {
            const tmp = !campaign.isSuspend;            
            const res = await updateCampaignSuspend(tmp, campaign.campaign_id);

            if (res.error === 0) {
                setCampaign((prev) => ({ ...prev, isSuspend: tmp }));
            }
        };

        fetchUpdateSuspend();
    };

    return (
        <div className="w-full">
            {/* Title */}
            <h1 className="mb-4 text-3xl font-semibold">{campaign.title}</h1>

            {/* Campaign thumbnail */}
            <img src={campaign.campaign_image} alt="Campaign_Img" className="mt-2 w-full" />

            {/* Suspend Button */}
            <div className="my-4 flex justify-end ml-auto w-full">
                <button
                    onClick={() => handleOnclickSuspend()} // you'll define this later
                    className={`px-4 py-4 rounded-lg font-medium transition w-full text-lg cursor-pointer
            ${
                campaign.isSuspend
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
            }
        `}>
                    {campaign.isSuspend ? "Unsuspend" : "Suspend"}
                </button>
            </div>

            {/* Goal and Currnent amout */}
            <hr className="border-[#e0ddd6] shadow-2xl" />
            <div className="w-full flex justify-start items-center">
                <div className="p-5 mt-4 w-full md:w-3/4 border border-[#e0ddd6] md:border-0 md:shadow-[0] grid grid-cols-6 gap-4 bg-white rounded-xl shadow-sm">
                    {/* Goal & Current */}
                    <div className="col-span-4 flex flex-col justify-center gap-2">
                        {/* Goal */}
                        <div className="text-lg font-semibold text-gray-800">
                            Goal:
                            <span className="ml-2 text-xl font-bold text-green-700">
                                {formatCurrencyVND(campaign.goal_fiat)}
                            </span>
                            {parseFloat(campaign.goal_crypto) > 0 && (
                                <>
                                    <span className="mx-1 text-gray-500">|</span>
                                    <span className="text-md font-medium text-green-600">
                                        {parseFloat(campaign.goal_crypto).toLocaleString()} ETH
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Current */}
                        <div className="text-sm font-medium text-gray-500">
                            Raised so far:
                            <span className="ml-2 font-semibold text-blue-500">
                                {formatCurrencyVND(campaign.current_fiat)}
                            </span>
                            {parseFloat(campaign.current_crypto) > 0 && (
                                <>
                                    <span className="mx-1 text-gray-400">|</span>
                                    <span className="text-sm font-medium text-blue-400">
                                        {parseFloat(campaign.current_crypto).toLocaleString()} ETH
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
                        dangerouslySetInnerHTML={{ __html: campaign.description }}
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

            {/* Updated campaign */}
            {campaign.update_time > 0 && (
                <div className="mt-6 bg-white rounded-xl py-5">
                    {/* Heading */}
                    <h2 className="text-lg sm:text-xl font-semibold italic text-gray-800 mb-2">
                        {`Update (${campaign.update_time}) • ${campaign.latest_title}`}
                    </h2>
                    <hr className="mb-4 border-[#e0ddd6]" />

                    {/* UPDATE CONTENT */}
                    <div className="relative text-gray-700 leading-relaxed text-sm">
                        <div dangerouslySetInnerHTML={{ __html: campaign.latest_content }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainInfo;
