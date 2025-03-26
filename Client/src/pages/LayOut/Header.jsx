import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Style/Header.css";
import { IconButton, Avatar, Drawer, Box, List, ListItem, Button } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import MainLogo from "../../assets/images/MainLogo.jpg";

function Header() {
    const navigate = useNavigate();
    const isLoggin = useSelector((state) => state.auth.isLoggin);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <header className="px-2 w-full flex items-center min-h-[56px] fixed z-1000 bg-white">
            <nav className="w-full h-full flex flex-row justify-between items-center">
                <IconButton>
                    <SearchOutlinedIcon></SearchOutlinedIcon>
                </IconButton>
                <Avatar src={MainLogo} alt="Main Logo" variant="rounded" />
                <IconButton onClick={() => setIsDrawerOpen(true)}>
                    <MenuIcon></MenuIcon>
                </IconButton>
            </nav>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box
                    padding={1}
                    width={350}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                    }}>
                    <IconButton
                        size="small"
                        sx={{ marginLeft: "auto" }}
                        onClick={() => setIsDrawerOpen(false)}>
                        <CloseIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                    <List>
                        <ListItem>Item 1</ListItem>
                        <ListItem>Item 2</ListItem>
                        <ListItem>Item 3</ListItem>
                    </List>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            paddingY: "12px",
                            backgroundColor: "#008044",
                            borderRadius: 2,
                            color: "white",
                            fontWeight: "500"
                        }}>
                        Start a Fund
                    </Button>
                    {!isLoggin && (
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                marginTop: 3,
                                paddingY: "12px",
                                borderRadius: 2,
                                borderColor: "#6f6f6f",
                                color: "#252525",
                                fontWeight: "600"
                            }}
                            onClick={() => navigate("/login")}    
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Drawer>
        </header>
    );
}

export default Header;
