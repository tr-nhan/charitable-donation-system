import { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import { insertCampaignUpdateImages } from "../../../services/api/campaignApi";

function ManageCampaignUpdateImages({ campaignId, isSuspend }) {
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleChooseImages = () => {
        if (isSuspend) return;
        setMessage("");
        setMessageType("");

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

    const handleUpdateImages = async () => {
        if (isSuspend) return;
        const files = previews.map((img) => img.file);
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("updateImages", file);
        });
        formData.append("campaignId", campaignId);

        setUpdateLoading(true);
        try {
            const response = await insertCampaignUpdateImages(formData);
            if (response.error === 0) {
                setMessage("Images uploaded successfully.");
                setMessageType("success");
                setPreviews([]);
            } else {
                setMessage("Failed to upload images.");
                setMessageType("error");
            }
        } catch (error) {
            console.log(error);
            setMessage("Error uploading images. Please try again.");
            setMessageType("error");
        } finally {
            setUpdateLoading(false);
            inputRef.current.value = "";
        }
    };

    const handleRemove = (id) => {
        setPreviews((prev) => prev.filter((img) => img.id !== id));
        const fileInput = inputRef.current;
        if (fileInput) fileInput.value = "";
    };

    return (
        <div className="flex flex-col justify-start items-center text-gray-800 px-4">
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
            <h1 className="text-2xl font-bold text-gray-800 mb-1 mr-auto">
                Update Campaign Images
            </h1>
            <p className="mr-auto text-sm text-gray-600 italic mb-6">
                Add images to show the current progress of your campaign. Visual updates help build
                trust with your supporters.
            </p>

            {/* Upload Zone */}
            <div
                onClick={() => inputRef.current.click()}
                className="mt-2 w-full max-w-[700px] min-h-[200px] border-2 border-dashed border-blue-400 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 transition-all duration-200 ease-in-out">
                <p className="text-blue-500 font-semibold text-lg">
                    Click to Browse or Drag & Drop Images
                </p>
                <IconButton>
                    <FileUploadOutlinedIcon sx={{ color: "#2563eb", fontSize: "36px" }} />
                </IconButton>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    ref={inputRef}
                    onChange={handleChooseImages}
                    disabled={isSuspend}
                />
            </div>

            {/* Upload Policy Notice */}
            <p className="text-sm text-gray-500 mt-2 mb-4 text-center max-w-[600px]">
                Supported formats: JPG, PNG, GIF • Max 5MB per image • Max 10 images per update
            </p>

            {/* Help Text */}
            {message && (
                <div
                    className={`text-sm px-4 py-2 rounded-md mt-2 ${
                        messageType === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                    }`}>
                    {message}
                </div>
            )}

            {/* Image Previews */}
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

            {/* Upload Button */}
            <button
                onClick={handleUpdateImages}
                disabled={previews.length === 0 || updateLoading}
                className="cursor-pointer ml-auto mr-56 mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[140px]">
                {updateLoading ? (
                    <>
                        <CircularProgress size={20} thickness={5} color="inherit" />
                        Uploading...
                    </>
                ) : (
                    "Upload Images"
                )}
            </button>
        </div>
    );
}

export default ManageCampaignUpdateImages;
