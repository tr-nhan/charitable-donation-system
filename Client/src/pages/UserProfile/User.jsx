import { useRef, useState, useEffect } from "react";
import { Avatar, Button, Dialog, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import "./customStyle.css";

import { getUserInfo } from "../../services/api/userApi";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import NoAvatar from "../../assets/images/NoAvatar.jpg";
import { updateAvatar } from "../../services/api/userApi";
import EditBioMobile from "./components/editBioMobile";

function User() {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const user = useSelector((state) => state.auth.user);
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [openEditBio, setOpenEditBio] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const res = await getUserInfo({ user_id: user.user_id });
                if (res.error === 0) {
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
                <div className="mt-7 py-5 px-10 w-full flex flex-col justify-between items-center border-[1px] border-[#949392] border-dashed bg-[#fbfaf8] rounded-xl">
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

            {/* Dialog edit Bio */}
            {isMobile ? (
                <EditBioMobile
                    open={openEditBio}
                    onClose={() => setOpenEditBio(false)}
                    setNewBio={(newBio) =>
                        setUserInfo((prev) => ({ ...prev, bio: newBio }))
                    }></EditBioMobile>
            ) : (
                <Dialog open={openEditBio}></Dialog>
            )}
        </section>
    );
}

export default User;
