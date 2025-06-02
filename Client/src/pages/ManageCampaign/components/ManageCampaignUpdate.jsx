import { useState, useRef } from "react";
import { RichText } from "../../../components/UI";
import CircularProgress from "@mui/material/CircularProgress";

import { insertCampaignUpdateInfo } from "../../../services/api/campaignApi";

function ManageCampaignUpdate({ campaignId, isSuspend }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [helpText, setHelpText] = useState("");
    const [helpType, setHelpType] = useState("");
    const [updating, setUpdating] = useState(false);

    const richTextRef = useRef();

    const handleUpdateInfo = async () => {
        if (isSuspend) return;
        if (!title.trim() || !content.trim()) {
            setHelpText("Title and description cannot be empty.");
            setHelpType("error");
            return;
        }

        setHelpText("");
        setHelpType("");
        setUpdating(true); // Start loading

        try {
            await insertCampaignUpdateInfo({ campaignId, title, content });
            setHelpText("🎉 Congratulations! Update submitted successfully.");
            setHelpType("success");
            setTitle("");
            setContent("");
            richTextRef.current?.clear(); // Clear editor content
        } catch (error) {
            console.error("Error submitting update:", error);
            setHelpText("❌ Failed to submit update. Please try again.");
            setHelpType("error");
        } finally {
            setUpdating(false); // Stop loading
        }
    };

    // Clear help text on input change
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (helpText) setHelpText("");
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
        if (helpText) setHelpText("");
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Campaign</h1>

            {/* Input Title */}
            <div className="mb-5">
                <label
                    htmlFor="update-title"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Update Title
                </label>
                <input
                    type="text"
                    id="update-title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter update title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Input Description */}
            <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Description
                </label>
                <RichText
                    ref={richTextRef}
                    content={content}
                    onChange={handleContentChange}
                    classCustom="p-3 min-h-[250px] max-h-[400px] border border-gray-300 rounded-md overflow-y-auto"
                />
            </div>

            {/* Help Text */}
            {helpText && (
                <div
                    className={`text-sm mt-2 mb-4 ${
                        helpType === "error" ? "text-red-600" : "text-green-600"
                    }`}>
                    {helpText}
                </div>
            )}

            {/* Submit Button */}
            <button
                disabled={updating || isSuspend}
                className={`ml-auto flex items-center justify-center gap-2 bg-green-800 hover:bg-green-950 text-white px-5 py-2 rounded-md font-medium transition duration-200  ${updating || isSuspend ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleUpdateInfo}>
                {updating ? (
                    <>
                        <CircularProgress className="animate-spin" />
                        Updating...
                    </>
                ) : (
                    "Submit Update"
                )}
            </button>
        </div>
    );
}

export default ManageCampaignUpdate;
