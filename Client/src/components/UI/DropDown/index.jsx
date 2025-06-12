import { Button, Avatar } from "@mui/material";
import "./index.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function DropDown({ name, children, right = false, iconEnd, iconStart, sx }) {
    return (
        <div className="dropdown" style={{ ...sx }}>
            <Button
                sx={{
                    color: "#252525",
                    textTransform: "none",
                    fontSize: "16px",
                    borderRadius: "20px",
                    paddingX: 2,
                    gap: 1,
                    ":hover": { backgroundColor: "#fbfaf8" }
                }}>
                {iconStart && <div className="flex flex-row ml-2">{iconStart}</div>}
                {name}
                {iconEnd && <div className="flex flex-row ml-2">{iconEnd}</div>}
                <div className="flex flex-row relative">
                    <ArrowDropDownIcon className="arrow-down" />
                    <ArrowDropUpIcon className="arrow-up" />
                </div>
            </Button>
            <div className={`dropdown-menu rounded-2xl ${right && "right-position"}`}>
                {children}
            </div>
        </div>
    );
}

export default DropDown;
