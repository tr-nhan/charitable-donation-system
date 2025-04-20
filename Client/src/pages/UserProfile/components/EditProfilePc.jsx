import { useState, useRef, useEffect } from "react";
import {
    IconButton,
    Button,
    Avatar,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../customStyle.css";

import { updateUser, updateAvatar } from "../../../services/api/userApi";

function EditProfilePc({ onClose, data, setNewProfile }) {
    const fileInputRef = useRef(null);
    const fullNameRef = useRef(null);
    const bioRef = useRef(null);
    const [userInfo, setUserInfo] = useState(data);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onFocus, setOnFocus] = useState({
        full_name: false,
        bio: false
    });

    useEffect(() => {
        setUserInfo(data);
    }, [data]);


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        let isSame = true;

        isSame = data.private === userInfo.private;

        if (data.full_name && userInfo?.full_name) {
            const fullName1 = data.full_name.trim();
            const fullName2 = userInfo.full_name?.trim?.() || "";
            if (fullName1 !== fullName2) {
                isSame = false;
            }
        }

        const bio1 = data.bio?.trim?.() || "";
        const bio2 = userInfo.bio?.trim?.() || "";
        if (bio1 !== bio2) {
            isSame = false;
        }

        setIsChanged(!isSame);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    const handleUpdateAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fetchUpdateAvatar = async () => {
                try {
                    setLoading(true);
                    const formData = new FormData();
                    formData.append("oldAvatar", data.profile_image);
                    formData.append("newAvatar", file);

                    const res = await updateAvatar(formData);

                    if (res.error === 0) {
                        data.profile_image = res.results.profile_image;
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUpdateAvatar();
        }
    };

    const handleSave = () => {
        let keys = Object.keys(data).filter((key) => key !== "avatar");

        let changedData = {};
        for (let key of keys) {
            if (data[key] !== userInfo[key]) {
                changedData[key] = userInfo[key];
            }
        }

        const fetchUpdateUser = async () => {
            try {
                setLoading(true);
                const res = await updateUser(changedData);
                if (res.error === 0) {
                    setIsChanged(false);
                    setNewProfile(userInfo);
                    onClose();
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdateUser();
    };

    return (
        <div className={`py-5 px-50 fixed inset-0 z-50 bg-white`}>
            <div className="h-screen overflow-y-scroll pb-28">
                <div className="w-full flex justify-end">
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ fontSize: "35px" }} />
                    </IconButton>
                </div>
                <div>
                    <h1 className="text-3xl font-semibold text-left">Edit profile</h1>
                    <div
                        className="mt-5 relative cursor-pointer w-fit flex flex-col items-center"
                        onClick={() => fileInputRef.current.click()}>
                        <Avatar src={data.profile_image} sx={{ width: "150px", height: "150px" }} />
                        <input
                            type="file"
                            className="hidden"
                            id="loadAvatar"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleUpdateAvatar}
                        />
                        {/* <CameraAltOutlinedIcon className="absolute bottom-0 left-9" /> */}
                        <span className="text-center font-semibold">Update Avatar</span>
                    </div>
                </div>
                <div className="mt-7 w-full flex flex-col justify-start items-start">
                    <h2 className="font-semibold">Visivility</h2>
                    <h3 className="mt-2 text-sm text-[#505050]">
                        When your profile is public, you can share it and inspire others to connect
                        with what you care about.
                    </h3>
                    <FormControl sx={{ marginTop: "20px" }}>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={data.private ? "private" : "public"}
                            name="radio-buttons-group"
                            onChange={(e) =>
                                setUserInfo((prev) => ({
                                    ...prev,
                                    private: e.target.value === "private"
                                }))
                            }>
                            <FormControlLabel
                                value="private"
                                control={<Radio color="success" />}
                                label={
                                    <div className="ml-2 flex flex-col">
                                        <span className="text-[16px] text-[#252525]">Private</span>
                                        <span className="text-sm text-[#6f6f6f]">
                                            Only you can see your profile
                                        </span>
                                    </div>
                                }
                            />
                            <FormControlLabel
                                value="public"
                                control={<Radio color="success" />}
                                label={
                                    <div className="mt-3 ml-2 flex flex-col">
                                        <span className="text-[16px] text-[#252525]">Public</span>
                                        <span className="text-sm text-[#6f6f6f]">
                                            Everyone can see your profile
                                        </span>
                                    </div>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <hr className="w-full mt-7 border-[#e5e1d7]" />
                <div className="mt-7 w-full flex flex-col justify-start items-start">
                    <h2 className="font-semibold">Profile name</h2>
                    <h3 className="mt-2 text-sm text-[#505050]">
                        This is the name that will appear on this profile.
                    </h3>
                    <div
                        className={`relative hover:bg-[#fbfaf8] cursor-text flex flex-col mt-3 px-5 py-2 rounded-lg w-full ${onFocus.full_name ? "border-2 border-black" : "border-[1px] border-[#c0bdb8]"}`}
                        onClick={() => fullNameRef.current.focus()}>
                        <span className="mr-auto text-[#6f6f6f] text-xs">Profile Name</span>
                        <input
                            type="text"
                            className="select-none w-full border-0 focus:border-0 focus:outline-none focus:ring-0 resize-none"
                            ref={fullNameRef}
                            onFocus={() => setOnFocus((prev) => ({ ...prev, full_name: true }))}
                            onBlur={() => setOnFocus((prev) => ({ ...prev, full_name: false }))}
                            value={userInfo.full_name}
                            onChange={(e) => {
                                setUserInfo((prev) => ({ ...prev, full_name: e.target.value }));
                            }}
                        />
                        {!userInfo.full_name.trim() && (
                            <span className="mr-auto text-red-600 text-xs">
                                Please enter your profile name.
                            </span>
                        )}
                    </div>
                </div>
                <hr className="w-full mt-7 border-[#e5e1d7]" />
                <div className="mt-7 w-full flex flex-col justify-start items-start">
                    <h2 className="font-semibold">Bio</h2>
                    <h3 className="mt-2 text-sm text-[#505050]">About you.</h3>
                    <div
                        className={`relative hover:bg-[#fbfaf8] cursor-text flex flex-col mt-3 px-5 py-2 rounded-lg w-full ${onFocus.bio ? "border-2 border-black" : "border-[1px] border-[#c0bdb8]"}`}
                        onClick={() => bioRef.current.click()}>
                        <textarea
                            type="text"
                            className="select-none w-full border-0 focus:border-0 focus:outline-none focus:ring-0 resize-none min-h-[100px]"
                            ref={bioRef}
                            onFocus={() => setOnFocus((prev) => ({ ...prev, bio: true }))}
                            onBlur={() => setOnFocus((prev) => ({ ...prev, bio: false }))}
                            value={userInfo.bio}
                            onChange={(e) => {
                                setUserInfo((prev) => ({ ...prev, bio: e.target.value }));
                            }}
                            placeholder="Tell others what you care about..."
                        />
                    </div>
                </div>
            </div>

            {/* Layer for Loading */}
            {loading && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative flex h-full w-full items-center justify-center">
                        <div className="flex gap-1 text-5xl font-bold text-green-950">
                            <span className="bounce-dot bounce-delay-0">.</span>
                            <span className="bounce-dot bounce-delay-1">.</span>
                            <span className="bounce-dot bounce-delay-2">.</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="shadow-2xl w-full px-50 z-50 py-5 bg-white fixed left-0 bottom-0 flex justify-center items-center">
                <Button
                    onClick={handleSave}
                    fullWidth
                    variant="contained"
                    disabled={!isChanged}
                    sx={{
                        borderRadius: "10px",
                        paddingY: "12px",
                        backgroundColor: isChanged ? "#252525" : "#e5e1d7",
                        fontWeight: 600
                    }}>
                    Save
                </Button>
            </div>
        </div>
    );
}

export default EditProfilePc;
