import { useState, useRef, useEffect } from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import "./customStyle.css";
import CloseIcon from "@mui/icons-material/Close";

import bgShareProfile from "../../../assets/images/bgShareProfile.jpg";

function ShareCampaign({ open, onClose, data }) {
    const contentRef = useRef(null);
    const [show, setShow] = useState(open);
    const [animateClass, setAnimateClass] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open) {
            setShow(true);
            setAnimateClass("edit-bio-enter");
            document.body.style.overflow = "hidden"; // chặn scroll khi mở
        } else {
            setAnimateClass("edit-bio-exit");
            setTimeout(() => setShow(false), 400);
            document.body.style.overflow = "auto"; // cho scroll lại khi đóng
        }

        return () => {
            document.body.style.overflow = "auto"; // đảm bảo reset nếu unmount bất ngờ
        };
    }, [open]);

    if (!show) return null;

    const handleCopy = () => {
        const link = `http://localhost:3000/campaign/discover/${data.campaignId}`;
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                console.log("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnimateClass("edit-bio-exit");
                    setTimeout(() => {
                        setShow(false);
                        onClose();
                    }, 400);
                }}></div>
            <div
                className={`py-1 px-7 absolute bottom-0 w-full h-[300px] bg-cover bg-center flex flex-col justify-start items-center ${animateClass}`}
                style={{
                    backgroundImage: `url(${bgShareProfile})`,
                    borderRadius: "10px 10px 0 0"
                }}
                ref={contentRef}>
                <div className="w-full flex flex-row justify-end">
                    <IconButton
                        onClick={() => {
                            setAnimateClass("edit-bio-exit");
                            setTimeout(() => {
                                setShow(false);
                                onClose();
                            }, 400);
                        }}>
                        <CloseIcon sx={{ fontSize: "25px" }}></CloseIcon>
                    </IconButton>
                </div>
                <Avatar
                    src={data.campaign_image}
                    alt="Avatar"
                    sx={{ width: "70px", height: "70px", marginTop: "-5px" }}></Avatar>
                <h1 className="mt-1 text-2xl text-center font-semibold">
                    Share this Campaign for everyone.
                </h1>
                <h2 className="text-sm text-center text-[#505050]">
                    Add this link to your social media or share directly with others.
                </h2>
                <div className="mt-1 flex flex-row justify-between items-center gap-2 w-full max-w-[450px]">
                    <div
                        className={`relative cursor-no-drop bg-white hover:bg-[#fbfaf8] flex flex-col justify-between px-5 py-1 rounded-lg w-full border-[1px] border-[#c0bdb8]`}>
                        <span className="text-[12px] text-[#6f6f6f]">Profile link</span>
                        <input
                            type="text"
                            value={`http://localhost:3000/campaign/discover/${data.campaignId}`}
                            className="w-full border-0 focus:border-0 focus:outline-none focus:ring-0 resize-none cursor-no-drop"
                            readOnly
                        />
                    </div>
                    <Button
                        variant="contained"
                        sx={{
                            minWidth: "125px",
                            maxWidth: "130px",
                            minHeight: "100%",
                            borderRadius: "10px",
                            backgroundColor: copied ? "#e5e1d7" : "#252525",
                            fontSize: "14px",
                            color: copied ? "#252525" : "white"
                        }}
                        onClick={handleCopy}
                        disabled={copied}>
                        {copied ? "Copied!" : "Copy Link"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ShareCampaign;
