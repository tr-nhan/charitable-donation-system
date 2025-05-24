import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import IntroChooseType from "./ChooseType/IntroChooseType";
import MainChooseType from "./ChooseType/MainChooseType";
import IntroGoal from "./Goal/IntroGoal";
import MainGoal from "./Goal/MainGoal";
import IntroInfoCampaign from "./InfoCampaign/IntroInfoCampaign";
import MainInfoCampaign from "./InfoCampaign/MainInfoCampaign";
import IntroMedia from "./Media/IntroMedia";
import MainMedia from "./Media/MainMedia";
import { createCampaign } from "../../services/api/campaignApi";

const COMPONENTS = [
    {
        id: 0,
        intro: IntroChooseType,
        main: MainChooseType
    },
    {
        id: 1,
        intro: IntroGoal,
        main: MainGoal
    },
    {
        id: 2,
        intro: IntroInfoCampaign,
        main: MainInfoCampaign
    },
    {
        id: 3,
        intro: IntroMedia,
        main: MainMedia
    }
];

function CreateCampaign() {
    const navigate = useNavigate();
    const [currentComponent, setCurrentComponent] = useState(COMPONENTS[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [campaignInfo, setCampaignInfo] = useState({});
    const [allowContinue, setAllowContinue] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    const setData = useCallback((data) => {
        setCampaignInfo((prev) => {
            return { ...prev, ...data };
        });
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

    return (
        <div className="w-full h-screen flex flex-row" style={{ backgroundColor: "#f4f2ec" }}>
            <div className="py-20 px-10 w-1/3 h-full flex flex-col justify-center items-center">
                <currentComponent.intro />
                <span className="mt-auto">
                    {currentComponent.id + 1} of {COMPONENTS.length}
                </span>
            </div>
            <div
                className="w-2/3 h-full flex flex-col justify-center items-center bg-white shadow-2xl overflow-y-auto"
                style={{ borderTopLeftRadius: "60px" }}>
                <currentComponent.main setData={setData} saveData={campaignInfo} />
                <div className="w-full h-1/12 flex flex-row justify-start items-center">
                    <hr
                        className="border-t-[1px] border-green-700 my-2"
                        style={{ width: `${((currentIndex + 1) / COMPONENTS.length) * 100}%` }}
                    />
                    <hr
                        className="border-t-[1px] border-gray-300 my-2"
                        style={{
                            width: `${100 - ((currentIndex + 1) / COMPONENTS.length) * 100}%`
                        }}
                    />
                </div>
                <div className="h-1/12 mb-12 px-20 w-full flex flex-row justify-between items-center gap-4">
                    {currentIndex > 0 && (
                        <button
                            className="bg-white text-[16px] border-[1px] border-gray-300 font-semibold py-4 px-5 rounded-lg mt-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setCurrentIndex(currentIndex - 1);
                                setCurrentComponent(COMPONENTS[currentIndex - 1]);
                            }}>
                            <ArrowBackIcon sx={{ color: "gray" }} />
                        </button>
                    )}
                    {currentIndex < COMPONENTS.length - 1 && (
                        <button
                            className={`text-white text-[16px] font-semibold py-4 px-9 rounded-lg mt-4 ml-auto ${!allowContinue ? "bg-gray-200" : "bg-[#252525] cursor-pointer"}`}
                            onClick={() => {
                                if (!allowContinue) return;
                                setCurrentIndex(currentIndex + 1);
                                setCurrentComponent(COMPONENTS[currentIndex + 1]);
                                setAllowContinue(false);
                            }}>
                            Continue
                        </button>
                    )}
                    {currentIndex === COMPONENTS.length - 1 && (
                        <button
                            className={`text-white text-[16px] font-semibold py-4 px-9 rounded-lg mt-4 ml-auto ${!allowContinue ? "bg-gray-200" : "bg-[#252525] cursor-pointer"}`}
                            onClick={() => {
                                if (!campaignInfo.campaign_image) return;
                                setAllowContinue(false);
                                handleCreate();
                            }}>
                            {!loadingCreate ? (
                                "Create!"
                            ) : (
                                <AiOutlineLoading3Quarters className="animate-spin"></AiOutlineLoading3Quarters>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateCampaign;
