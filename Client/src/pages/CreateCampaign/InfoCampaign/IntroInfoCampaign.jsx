import { Avatar } from "@mui/material";

import MainLogo from "../../../assets/images/MainLogo.png";

function IntroInfoCampaign() {
    return (
        <div className="mb-10 w-5/6 flex flex-col justify-center items-center text-center leading-12">
            <Avatar
                src={MainLogo}
                alt="Main Logo"
                sx={{ marginRight: "auto", marginBottom: "auto", width: "100px", height: "100px" }}
            />
            <h1 className="text-[40px] text-left">Tell donors your story</h1>
        </div>
    );
}

export default IntroInfoCampaign;
