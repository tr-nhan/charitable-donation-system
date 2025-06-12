import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import { Loading } from "../../components/UI";
import { getFullInfoCampaignById, insertCampaignReports } from "../../services/api/campaignApi";

function ReportCampaign() {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const userId = useSelector((state) => state.auth.user.user_id);
    // init state
    const [campaign, setCampaign] = useState(null);
    // report text
    const [reportText, setReportText] = useState("");
    // preview
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState([]);
    // help text
    const [helpText, setHelpText] = useState("");
    // loading
    const [uploading, setUploading] = useState(false);
    // open dialog
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchInitState = async () => {
            const res = await getFullInfoCampaignById(campaignId);
            if (res.error === 0) setCampaign(res.results);
        };
        fetchInitState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!campaign) return <Loading />;
    if (userId === campaign.campaignInfo.creator_id)
        return navigate(`/campaign/discover/${campaignId}`);

    const handleChooseImages = () => {
        setHelpText("");
        if (previews.length >= 5) return;
        const files = inputRef.current.files;
        if (files.length === 0) return;

        Array.from(files).forEach((file) => {
            const preview = {
                id: file.name + file.lastModified,
                url: URL.createObjectURL(file),
                file
            };

            setPreviews((prev) => {
                const exists = prev.some((p) => p.id === preview.id);
                if (exists) return prev;
                return [...prev, preview];
            });
        });

        inputRef.current.value = "";
    };

    const handleRemove = (id) => {
        setPreviews((prev) => prev.filter((img) => img.id !== id));
        const fileInput = inputRef.current;
        if (fileInput) fileInput.value = "";
    };

    const handleReport = async () => {
        if (!reportText.trim()) {
            setHelpText("The report text is required.");
            return;
        } else if (previews.length <= 0) {
            setHelpText("You must add at least 1 image for the reporting.");
            return;
        }

        const files = previews.map((img) => img.file);
        if (files.length === 0) return;
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("reportImages", file);
        });
        formData.append("campaignId", campaignId);
        formData.append("reportText", reportText);
        formData.append("reporterId", userId);

        try {
            setUploading(true);
            const res = await insertCampaignReports(formData);
            console.log(res);

            if (res.error === 0) {
                setUploading(false);
                setOpenDialog(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false);
            // setOpenDialog(false);
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
        navigate(`/campaign/discover/${campaignId}`);
    };

    return (
        <div className="p-0 md:py-10 w-full h-full bg-[#f4f2ec] flex justify-center items-center">
            <div className="md:p-10 px-5 py-10 bg-white md:rounded-3xl md:w-[45%] w-full">
                <h1 className="mb-10 text-3xl text-red-700 font-bold">Report this campaign</h1>
                {/* Campaign info */}
                <div className="flex flex-row">
                    <img
                        src={campaign.campaignInfo.campaign_image}
                        alt="Campaign Thumbnail"
                        className="w-[113px] h-[84px] rounded-sm object-cover"
                    />
                    <div className="ml-5 flex flex-col justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">You are supporting:</p>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {campaign.campaignInfo.title}
                            </h2>
                        </div>

                        {campaign.campaignInfo.short_description && (
                            <p className="text-sm text-gray-500 mt-2">
                                {campaign.campaignInfo.short_description}
                            </p>
                        )}

                        <p className="text-xs text-emerald-600 italic mt-3">
                            🌱 Every small help makes a big difference. Thank you for your kindness!
                        </p>
                    </div>
                </div>

                {/* Notice and policies */}
                <div className="mt-10">
                    <h2 className="text-lg md:text-xl font-bold text-red-600 mb-4">
                        ⚠️ Report Campaign Notice
                    </h2>
                    <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                        <p>
                            Please make sure your report is{" "}
                            <span className="font-semibold text-gray-900">accurate and honest</span>
                            . False reports can lead to misuse of our moderation system and may
                            result in action against your account.
                        </p>
                        <p>
                            Provide as much{" "}
                            <span className="font-semibold text-gray-900">detail</span> as possible
                            about why you're reporting this campaign. If you have any{" "}
                            <span className="font-semibold text-gray-900">evidence</span>{" "}
                            (screenshots, links, etc.), please include them to help us investigate
                            efficiently.
                        </p>
                        <p>
                            By reporting, you’re helping us maintain a{" "}
                            <span className="text-emerald-600 font-semibold">
                                clear and trustworthy community
                            </span>
                            . We truly appreciate your effort to keep this space safe and
                            transparent for everyone.
                        </p>
                        <p className="italic text-gray-600">
                            ✅ Our team will review your report carefully and take appropriate
                            action as soon as possible.
                        </p>
                    </div>
                </div>

                {/* Report Text */}
                <div className="mt-8">
                    <label
                        htmlFor="reportText"
                        className="block text-base font-semibold text-gray-800 mb-2">
                        📝 Your Report
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                        Please describe the issue in detail (max{" "}
                        <span className="font-medium">200 words</span>). Be respectful, write
                        clearly, and avoid assumptions. Reports without clear explanation may not be
                        reviewed.
                    </p>
                    <textarea
                        value={reportText}
                        onChange={(e) => {
                            setReportText(e.target.value);
                            setHelpText("");
                        }}
                        id="reportText"
                        name="reportText"
                        rows="6"
                        maxLength={1500} // roughly 200–250 words depending on writing
                        placeholder="Describe the problem clearly and provide any relevant context or evidence..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm resize-none"></textarea>
                    <p className="text-xs text-gray-400 mt-2">
                        ✨ Help us by being specific and constructive. Your report matters.
                    </p>
                </div>

                {/* Upload images */}
                <div
                    onClick={() => inputRef.current.click()}
                    className="mt-2 w-full max-w-[700px] min-h-[200px] border-2 border-dashed border-green-800 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-green-50 transition-all duration-200 ease-in-out">
                    <p className="text-green-800 font-semibold text-lg">
                        Click to Browse or Drag & Drop Images
                    </p>
                    <IconButton>
                        <FileUploadOutlinedIcon sx={{ color: "#016630", fontSize: "36px" }} />
                    </IconButton>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        ref={inputRef}
                        onChange={handleChooseImages}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-400">At least 1 image and not over 5 images</p>

                {previews.length > 0 && (
                    <div className="mt-4 py-3 px-4 overflow-x-auto max-w-[700px] rounded-lg bg-white">
                        <div className="flex flex-row items-center gap-4 w-max">
                            {previews.map((img, i) => (
                                <div
                                    key={i}
                                    className="group overflow-hidden shrink-0 flex flex-col items-center justify-center gap-2">
                                    <img
                                        src={img.url}
                                        alt="Campaign"
                                        className="w-[100px] h-[100px] object-cover rounded-lg"
                                    />
                                    <IconButton
                                        onClick={() => handleRemove(img.id)}
                                        className="z-10"
                                        size="small">
                                        <CloseIcon sx={{ fontSize: 25, color: "red" }} />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleReport}
                    className="mt-5 py-3 bg-red-700 hover:bg-red-900 text-white font-semibold w-full rounded-xl cursor-pointer">
                    {uploading ? (
                        <>
                            <CircularProgress size={20} thickness={5} color="inherit" />
                            Uploading...
                        </>
                    ) : (
                        "Report"
                    )}
                </button>
                {/* Help text */}
                <p className="mt-2 text-right text-sm text-red-600">{helpText}</p>
            </div>

            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Report Submitted</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your report has been successfully sent to our admin team. We appreciate your
                        effort to help us maintain a clear, trustworthy, and strong community.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        We will handle your report as soon as possible. Thank you for making our
                        platform better!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ReportCampaign;
