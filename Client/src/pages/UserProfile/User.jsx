import { useRef, useState, useEffect } from "react";
import { Avatar, Button, Dialog, useMediaQuery, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import "./customStyle.css";

import { getUserInfo } from "../../services/api/userApi";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";

import bgShareProfile from "../../assets/images/bgShareProfile.jpg";
import { updateAvatar, updateUser } from "../../services/api/userApi";
import EditBioMobile from "./components/editBioMobile";
import ShareProfile from "./components/ShareProfile";
import EditProfileMobile from "./components/EditProfileMobile";
import EditProfilePc from "./components/EditProfilePc";
import Loading from "../../components/UI/Loading";

function User() {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const user = useSelector((state) => state.auth.user);
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [openEditBio, setOpenEditBio] = useState(false);
    const [openShareProfile, setOpenShareProfile] = useState(false);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [copied, setCopied] = useState(false);
    const [words, setWords] = useState(0);
    const [onFocus, setOnFocus] = useState(false);
    const inputBioRef = useRef(null);
    const [inputBio, setInputBio] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const res = await getUserInfo({ user_id: user.user_id });
                if (res.error === 0) {
                    console.log(res.results[0]);
                    
                    setUserInfo(res.results[0]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     window.location.reload();
    // }, [userInfo.profile_image]);

    const handleUpdateAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fetchUpdateAvatar = async () => {
                try {
                    setLoading(true);
                    const formData = new FormData();
                    formData.append("oldAvatar", userInfo.profile_image);
                    formData.append("newAvatar", file);

                    const res = await updateAvatar(formData);

                    if (res.error === 0) {
                        window.location.reload();
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

    const handleCopy = () => {
        const link = `http://localhost:3000/user/${user.user_id}`;
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    const handleSaveBio = () => {
        setInputBio("");
        setWords(0);

        const fetchUpdateUser = async () => {
            try {
                setLoading(true);
                const res = await updateUser({ bio: inputBio });
                if (res.error === 0) {
                    setUserInfo((prev) => ({ ...prev, bio: res.results.bio }));
                    setOpenEditBio(false);
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
        <section className="w-full flex flex-col justify-start items-center">
            <div className="relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <Avatar
                    src={userInfo.profile_image}
                    sx={{ width: "100px", height: "100px", border: "1px dashed black" }}
                />
                <input
                    type="file"
                    className="hidden"
                    id="loadAvatar"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleUpdateAvatar}
                />
                {/* <CameraAltOutlinedIcon className="absolute bottom-0 left-9" /> */}
            </div>
            <h1 className="mt-2 text-2xl font-semibold">{userInfo.full_name}</h1>
            {userInfo.bio ? (
                <h2>{userInfo.bio}</h2>
            ) : (
                <div className="max-w-[512px] mt-7 py-5 px-10 w-full flex flex-col justify-between items-center border-[1px] border-[#949392] border-dashed bg-[#fbfaf8] rounded-xl">
                    <h3 className="text-sm text-[#6f6f6f]">Tell others what you care about.</h3>
                    <Button
                        variant="outlined"
                        startIcon={<AddOutlinedIcon className="text-[#6f6f6f]" />}
                        sx={{
                            color: "black",
                            fontWeight: "600",
                            marginTop: "10px",
                            borderRadius: "20px",
                            borderColor: "#949392",
                            fontSize: "12px"
                        }}
                        onClick={() => setOpenEditBio(true)}>
                        Add Bio
                    </Button>
                </div>
            )}
            <div className="max-w-[450px] mt-5 w-full flex flex-row justify-between items-center gap-5">
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        paddingY: "10px",
                        borderRadius: "10px",
                        border: "1px solid #c0bdb8",
                        color: "#252525",
                        fontWeight: "600",
                        ":hover": { backgroundColor: "#2525250d", border: "2px solid black" },
                        maxWidth: "200px"
                    }}
                    onClick={() => setOpenShareProfile(true)}>
                    Share profile
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        paddingY: "10px",
                        borderRadius: "10px",
                        border: "1px solid #c0bdb8",
                        color: "#252525",
                        fontWeight: "600",
                        ":hover": { backgroundColor: "#2525250d", border: "2px solid black" },
                        maxWidth: "200px"
                    }}
                    onClick={() => setOpenEditProfile(true)}>
                    Edit profile
                </Button>
            </div>

            {/* Layer for Loading */}
            {loading && <Loading />}

            {/* Dialog edit Bio */}
            {isMobile ? (
                <EditBioMobile
                    open={openEditBio}
                    onClose={() => setOpenEditBio(false)}
                    setNewBio={(newBio) =>
                        setUserInfo((prev) => ({ ...prev, bio: newBio }))
                    }></EditBioMobile>
            ) : (
                <Dialog open={openEditBio}>
                    <div className="px-10 py-5 min-w-[600px]">
                        <div className="w-full flex justify-end">
                            <IconButton onClick={() => setOpenEditBio(false)}>
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
                </Dialog>
            )}
            {/* Share profile */}
            {isMobile ? (
                <ShareProfile
                    open={openShareProfile}
                    onClose={() => setOpenShareProfile(false)}
                    data={{ avatar: userInfo.profile_image, user_id: user.user_id }}></ShareProfile>
            ) : (
                <Dialog
                    open={openShareProfile}
                    onClose={() => setOpenShareProfile(false)}
                    PaperProps={{
                        style: {
                            backgroundImage: `url(${bgShareProfile})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "10px"
                        }
                    }}>
                    <div className="min-w-[500px] min-h-[200px] p-5 flex flex-col justify-start items-center">
                        <Avatar
                            src={userInfo.avatar}
                            alt="Avatar"
                            sx={{ width: "70px", height: "70px", marginTop: "-5px" }}
                        />
                        <h1 className="mt-1 text-2xl text-center font-semibold">
                            Share your profile and inspire others to help.
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
                                    value={`http://localhost:3000/user/${user.user_id}`}
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
                </Dialog>
            )}
            {/* Edit profile */}
            {isMobile ? (
                <EditProfileMobile
                    open={openEditProfile}
                    onClose={() => setOpenEditProfile(false)}
                    data={userInfo}
                    setNewProfile={(newData) => {
                        if (newData.avatar !== userInfo.avatar) {
                            window.location.reload();
                            return;
                        }
                        setUserInfo(newData);
                    }}></EditProfileMobile>
            ) : (
                <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
                    <EditProfilePc
                        onClose={() => setOpenEditProfile(false)}
                        data={userInfo}
                        setNewProfile={(newData) => {
                            if (newData.avatar !== userInfo.avatar) {
                                window.location.reload();
                                return;
                            }
                            setUserInfo(newData);
                        }}
                    />
                </Dialog>
            )}
        </section>
    );
}

export default User;
