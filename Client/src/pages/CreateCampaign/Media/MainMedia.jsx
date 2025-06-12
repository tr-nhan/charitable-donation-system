/* eslint-disable react-hooks/exhaustive-deps */
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import { useState, useRef, useEffect } from "react";

function MainMedia({ setData, saveData }) {
    const [uploaded, setUploaded] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(saveData.campaign_image ? URL.createObjectURL(saveData.campaign_image) : "");
    const [selectedFile, setSelectedFile] = useState(saveData.campaign_image || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setData({ campaign_image: selectedFile });
    }, [selectedFile]);

    const handleDelete = () => {
        setUploaded(false);
        setPreviewSrc("");
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="md:px-[160px] px-2 w-full h-full flex flex-col justify-center md:items-start text-center ">
            <h2 className="md:text-3xl text-2xl text-center font-semibold">Add a cover photo or video</h2>
            <p className="mt-2 text-sm">
                Cover media helps tell your story. If you find a better photo later, you can always
                change it.
            </p>
            {!uploaded && (
                <>
                    <label
                        className="mt-3 p-15 border-dashed border-[1px] flex flex-col justify-center items-center hover:border-2 group cursor-pointer"
                        htmlFor="uploadPhoto">
                        <PhotoCameraBackIcon sx={{ color: "gray" }} />
                        <p className="text-gray-500 group-hover:text-black">Add a photo</p>
                    </label>
                </>
            )}
            <input
                type="file"
                className="hidden"
                id="uploadPhoto"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        setUploaded(true);
                        setPreviewSrc(URL.createObjectURL(file));
                        setSelectedFile(file);
                    }
                }}
            />
            {uploaded && (
                <div className="mt-3">
                    <img
                        src={previewSrc}
                        alt="Photo"
                        className="w-52 h-52 border-2 border-gray-300"
                    />
                    <div className="mt-3 flex flex-row justify-between items-center gap-3">
                        <button
                            className="px-4 py-1 border rounded-sm bg-red-600 text-gray-50 cursor-pointer"
                            onClick={handleDelete}>
                            Delete
                        </button>
                        <label
                            htmlFor="uploadPhoto"
                            className="px-4 py-1 border rounded-sm bg-accent-1 text-gray-50 cursor-pointer">
                            Choose another one
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainMedia;
