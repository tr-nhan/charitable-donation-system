import { useState, useRef, useEffect } from "react";
import { IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../customStyle.css";

import { updateUser } from "../../../services/api/userApi";

function EditBioMobile({ open, onClose, setNewBio }) {
    const inputBioRef = useRef(null);
    const [onFocus, setOnFocus] = useState(false);
    const [inputBio, setInputBio] = useState("");
    const [words, setWords] = useState(0);
    const [show, setShow] = useState(open);
    const [animateClass, setAnimateClass] = useState("");

    useEffect(() => {
        if (open) {
            setShow(true);
            setAnimateClass("edit-bio-enter");
        } else {
            setAnimateClass("edit-bio-exit");
            setTimeout(() => setShow(false), 300);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    if (!show) return null;

    const handleSaveBio = () => {
        setInputBio("");
        setWords(0);

        const fetchUpdateUser = async () => {
            try {
                const res = await updateUser({ bio: inputBio });
                if (res.error === 0) {
                    setNewBio(inputBio);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUpdateUser();

        onClose();
    };

    return (
        <div className={`py-5 px-4 fixed inset-0 z-50 bg-white ${animateClass}`}>
            <div className="w-full flex justify-end">
                <IconButton onClick={onClose}>
                    <CloseIcon sx={{ fontSize: "35px" }} />
                </IconButton>
            </div>
            <div>
                <h1 className="text-3xl text-[#252525] font-semibold">Edit Bio</h1>
                <div
                    onClick={() => {
                        inputBioRef.current.focus();
                        setOnFocus(true);
                    }}
                    className={`relative hover:bg-[#fbfaf8] cursor-text flex flex-col mt-5 p-5 rounded-lg w-full ${onFocus ? "border-2 border-black" : "border-[1px] border-[#c0bdb8]"}`}>
                    <textarea
                        type="text"
                        id="inputBio"
                        className="w-full border-0 focus:border-0 focus:outline-none focus:ring-0 resize-none"
                        ref={inputBioRef}
                        onFocus={() => setOnFocus(true)}
                        onBlur={() => setOnFocus(false)}
                        value={inputBio}
                        onChange={(e) => {
                            if (words <= 160) {
                                setInputBio(e.target.value);
                                setWords(() => {
                                    const wordCount = e.target.value
                                        .split(" ")
                                        .filter((word) => word.length > 0).length;
                                    return wordCount;
                                });
                            }
                        }}
                        placeholder="Tell others what you care about..."
                    />
                    <span className="ml-auto mt-1 font-semibold">{words}/160</span>
                </div>
            </div>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    marginTop: "20px",
                    paddingY: "10px",
                    borderRadius: "10px",
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "500",
                    boxShadow: "none",
                    ":hover": {
                        backgroundColor: "#252525"
                    }
                }}
                disabled={words === 0}
                onClick={handleSaveBio}>
                Save
            </Button>
        </div>
    );
}

export default EditBioMobile;
