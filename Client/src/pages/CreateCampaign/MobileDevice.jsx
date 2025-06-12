import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import MainChooseType from "./ChooseType/MainChooseType";
import MainGoal from "./Goal/MainGoal";
import MainInfoCampaign from "./InfoCampaign/MainInfoCampaign";
import MainMedia from "./Media/MainMedia";
import { createCampaign } from "../../services/api/campaignApi";

const COMPONENTS = [
    MainChooseType,
    MainGoal,
    MainInfoCampaign,
    MainMedia
];

function MobileDevice() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [campaignInfo, setCampaignInfo] = useState({});
    const [allowContinue, setAllowContinue] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    const setData = useCallback((data) => {
        setCampaignInfo((prev) => ({ ...prev, ...data }));
    }, []);

    useEffect(() => {
        if (currentIndex === 0 && campaignInfo.category) {
            setAllowContinue(true);
        } else if (currentIndex === 1 && campaignInfo.goal_fiat?.trim()) {
            setAllowContinue(true);
        } else if (
            currentIndex === 2 &&
            campaignInfo.title?.trim() &&
            campaignInfo.description?.trim()
        ) {
            setAllowContinue(true);
        } else if (currentIndex === 3 && campaignInfo.campaign_image) {
            setAllowContinue(true);
        } else {
            setAllowContinue(false);
        }
    }, [campaignInfo, currentIndex]);

    const handleCreate = async () => {
        const formData = new FormData();

        Object.entries(campaignInfo).forEach(([key, value]) => {
            if (key === "campaign_image" && value) {
                formData.append(key, value);
            } else if (key === "goal_fiat" || key === "goal_crypto") {
                formData.append(key, Number(value.replace(/,/g, "")));
            } else {
                formData.append(key, value);
            }
        });

        try {
            setLoadingCreate(true);
            const res = await createCampaign(formData);
            if (res.error === 0) navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCreate(false);
        }
    };

    const CurrentComponent = COMPONENTS[currentIndex];

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4 pt-8 pb-20 bg-white overflow-y-auto">
            <CurrentComponent setData={setData} saveData={campaignInfo} />

            {/* Progress bar */}
            <div className="w-full flex flex-row items-center my-4">
                <hr
                    className="border-t-[1px] border-green-700"
                    style={{ width: `${((currentIndex + 1) / COMPONENTS.length) * 100}%` }}
                />
                <hr
                    className="border-t-[1px] border-gray-300"
                    style={{ width: `${100 - ((currentIndex + 1) / COMPONENTS.length) * 100}%` }}
                />
            </div>

            {/* Navigation buttons */}
            <div className="w-full flex flex-row justify-between items-center gap-4">
                {currentIndex > 0 && (
                    <button
                        className="bg-white border-[1px] border-gray-300 text-gray-700 font-semibold py-3 px-5 rounded-lg"
                        onClick={() => {
                            setCurrentIndex(currentIndex - 1);
                            setAllowContinue(false);
                        }}>
                        Back
                    </button>
                )}
                {currentIndex < COMPONENTS.length - 1 && (
                    <button
                        className={`text-white font-semibold py-3 px-7 rounded-lg ml-auto ${
                            !allowContinue ? "bg-gray-300" : "bg-[#252525]"
                        }`}
                        disabled={!allowContinue}
                        onClick={() => {
                            setCurrentIndex(currentIndex + 1);
                            setAllowContinue(false);
                        }}>
                        Continue
                    </button>
                )}
                {currentIndex === COMPONENTS.length - 1 && (
                    <button
                        className={`text-white font-semibold py-3 px-7 rounded-lg ml-auto ${
                            !allowContinue ? "bg-gray-300" : "bg-[#252525]"
                        }`}
                        disabled={!allowContinue}
                        onClick={handleCreate}>
                        {!loadingCreate ? (
                            "Create!"
                        ) : (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default MobileDevice;
