import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconButton, Avatar, Drawer, Box, List, ListItem, Button } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { logout as logOutApi } from "../../../services/api/authApi.js";
import MainLogo from "../../../assets/MainLogo.webp";
import { logout } from "../../../redux/authSlice.js";

function HeaderMobile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await logOutApi();
            if (res.error !== 0) return;

            dispatch(logout());

            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="z-50 px-2 w-full flex items-center h-[56px] fixed flex-1 shadow bg-white">
            <nav className="w-full h-full flex flex-row justify-between items-center">
                <IconButton onClick={() => navigate("/campaign/search")}>
                    <SearchOutlinedIcon></SearchOutlinedIcon>
                </IconButton>
                <IconButton onClick={() => navigate("/")}>
                    <Avatar src={MainLogo} alt="Main Logo" variant="rounded" />
                </IconButton>
                <IconButton onClick={() => setIsDrawerOpen(true)}>
                    <MenuIcon></MenuIcon>
                </IconButton>
            </nav>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box
                    padding={2}
                    width={320}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        backgroundColor: "#f9f9f9"
                    }}>
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={() => setIsDrawerOpen(false)}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Box>

                    <Box mt={2}>
                        <List sx={{ width: "100%" }}>
                            {[
                                "Your Profile",
                                "Your Balance",
                                "How to Start?",
                                "Help Center",
                                "Common Questions"
                            ].map((text, index) => (
                                <ListItem
                                    key={text}
                                    button
                                    onClick={() => {
                                        const routes = [
                                            "/profile",
                                            "/balance",
                                            "/fundraising-tips",
                                            "/help-center",
                                            "/common-questions"
                                        ];
                                        navigate(routes[index]);
                                        setIsDrawerOpen(false);
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        paddingY: 1.8,
                                        paddingX: 2.5,
                                        mb: index < 4 ? 2 : 0, // space between items except last
                                        border: "1px solid transparent",
                                        // boxShadow: "0 0 0 rgba(0,0,0,0)", // for smooth shadow transition
                                        transition:
                                            "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                                        fontWeight: 600,
                                        fontSize: 16,
                                        color: "#222",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        backgroundColor: "#f0f7f5",
                                        borderColor: "#008044",
                                        boxShadow: "0 4px 12px rgba(0, 128, 68, 0.15)",

                                        "&:hover": {
                                            backgroundColor: "#f0f7f5",
                                            borderColor: "#008044",
                                            boxShadow: "0 4px 12px rgba(0, 128, 68, 0.15)"
                                        },
                                        "&:active": {
                                            backgroundColor: "#bbebd0",
                                            borderColor: "#00592a",
                                            boxShadow: "none"
                                        }
                                    }}>
                                    {text}
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box mb="auto" mt="5px" display="flex" flexDirection="column" gap={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                fontWeight: "600",
                                backgroundColor: "#008044",
                                "&:hover": {
                                    backgroundColor: "#006c38"
                                }
                            }}
                            onClick={() => navigate("/create-campaign")}>
                            Start a Fund
                        </Button>

                        {!isLoggedIn ? (
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    py: 1.5,
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    borderColor: "#444",
                                    color: "#444"
                                }}
                                onClick={() => {
                                    navigate("/sign-in");
                                    setIsDrawerOpen(false);
                                }}>
                                Log In
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    backgroundColor: "#ff3d3d",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#d32f2f"
                                    }
                                }}
                                onClick={() => {
                                    handleLogout();
                                    setIsDrawerOpen(false);
                                }}>
                                Log Out
                            </Button>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </header>
    );
}

export default HeaderMobile;
