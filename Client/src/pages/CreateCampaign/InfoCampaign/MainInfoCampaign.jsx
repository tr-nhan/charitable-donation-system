import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { TbTargetArrow } from "react-icons/tb";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { BsChatSquareText } from "react-icons/bs";
import { SiTinyletter } from "react-icons/si";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import RichText from "../../../components/UI/RichText";

// import { enhanceText as enhanceTextFnc } from "../../../services/api/servicesApi";

function MainInfoCampaign({ setData, saveData }) {
    const [inputValue, setInputValue] = useState({
        title: saveData.title || "",
        description: saveData.description || ""
    });
    // const [words, setWords] = useState(0);
    // const [enhanceText, setEnhanceText] = useState("");
    // const [openDialog, setOpenDialog] = useState(false);
    // const [loading, setLoading] = useState(false);

    useEffect(() => {
        setData({ title: inputValue.title, description: inputValue.description });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleChangeDescription = (content) => {
        // const text = inputValue.description
        //     .replace(/<[^>]*>/g, " ")
        //     .replace(/\s+/g, " ")
        //     .trim();

        // setWords(text.length === 0 ? 0 : text.split(" ").length);
        setInputValue((prev) => ({ ...prev, description: content }));
    };

    // const handleEnhance = () => {
    //     if (words < 50) return;

    //     const fetch = async () => {
    //         setLoading(true);
    //         try {
    //             const res = await enhanceTextFnc(inputValue.description);

    //             if (res.error === 0) {
    //                 setEnhanceText(res.results);
    //                 setOpenDialog(true);
    //             }
    //         } catch (error) {
    //             console.error("Enhancement failed:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetch();
    // };

    return (
        <div className="px-[160px] w-full h-dvh flex flex-col justify-center items-start overflow-y-auto">
            {/* Title */}
            <input
                type="text"
                className="w-full outline-gray-500 border-gray-400 border-[1px] bg-transparent text-lg p-2 rounded-md"
                placeholder="Title"
                value={inputValue.title}
                onChange={(e) => {
                    setInputValue({ ...inputValue, title: e.target.value });
                }}
            />

            {/* Description */}
            <div className="w-full">
                <RichText
                    content={inputValue.description}
                    onChange={handleChangeDescription}
                    classCustom={
                        "p-2 min-h-[250px] max-h-[400px] outline-gray-500 border-gray-400 border-[1px] rounded-md overflow-y-auto"
                    }
                />
            </div>

            {/* Enhance */}
            {/* <div className="mt-5 p-5 w-full bg-[#f4f2ec] rounded-lg flex flex-col justify-between items-start gap-2">
                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-start items-center">
                        <strong className="text-[16px]">Strengthen your story</strong>
                        <div className="flex flex-row justify-start items-start gap-2">
                            <CircularProgress
                                variant="determinate"
                                value={words < 50 ? (words / 50) * 100 : 100}
                                size="15px"
                                color="#008236"
                            />
                            <span className="text-sm text-gray-500">
                                {words < 50 ? `${50 - words} words needed` : "Great work!"}
                            </span>
                        </div>
                    </div>
                    <button
                        className={`px-5 min-h-12 rounded-xl bg-white border-gray-900 border-[1px] font-semibold ${words < 50 ? "opacity-25" : "cursor-pointer"}`}
                        onClick={handleEnhance}>
                        {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            "Enhance"
                        )}
                    </button>
                </div>
                <hr className="my-3 w-full border-gray-400" />
                <div className="w-full flex flex-col justify-start items-start">
                    <p className="text-[14px] text-gray-800">
                        Write as much as you can, and we’ll enhance these elements of your story
                        with AI:
                    </p>
                    <div className="flex flex-row justify-start items-center gap-2">
                        <TbTargetArrow className="text-orange-300" />
                        <span className="text-sm text-gray-600">Spelling and grammar</span>
                        <HiOutlineSpeakerWave className="text-blue-300" />
                        <span className="text-sm text-gray-600">Tone</span>
                        <BsChatSquareText className="text-purple-400" />
                        <span className="text-sm text-gray-600">Word choice</span>
                        <SiTinyletter className="text-yellow-600" />
                        <span className="text-sm text-gray-600">Paragraph structure</span>
                    </div>
                </div>
            </div>
            <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box bgcolor="#f4f2ec" width="100%">
                    <Box padding="30px">
                        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "600" }}>
                            Our Suggestion
                        </DialogTitle>
                        <DialogContent sx={{ fontSize: "0.875rem", color: "rgb(111, 111, 111)" }}>
                            Great work! We read your story and made some changes for you to review.
                        </DialogContent>
                    </Box>
                    <Box bgcolor={"white"} padding="15px 0" borderRadius={"20px 20px 0 0"}>
                        <p className="py-10 px-5">{enhanceText}</p>
                        <hr className="w-full text-gray-300" />
                        <DialogActions
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                            <Button
                                sx={{
                                    paddingY: "10px",
                                    borderRadius: "10px",
                                    borderColor: "#99a1af",
                                    color: "#252525",
                                    fontWeight: "600"
                                }}
                                fullWidth
                                variant="outlined"
                                onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                sx={{
                                    paddingY: "10px",
                                    borderRadius: "10px",
                                    backgroundColor: "#252525"
                                }}
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    setInputValue((prev) => ({
                                        ...prev,
                                        description: enhanceText
                                    }));
                                    setOpenDialog(false);
                                }}>
                                Use this story
                            </Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog> */}
        </div>
    );
}

export default MainInfoCampaign;
