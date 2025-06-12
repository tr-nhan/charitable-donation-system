import { Avatar } from "@mui/material";

import MainLogo from "../../../assets/images/MainLogo.png";

function IntroMedia() {
    return (
        <div className="mb-10 w-5/6 flex flex-col justify-center items-center text-center">
            <Avatar
                src={MainLogo}
                alt="Main Logo"
                sx={{ marginRight: "auto", marginBottom: "auto", width: "100px", height: "100px" }}
            />

            <h1 className="text-[40px] text-left self-start">Add media</h1>
            <h2 className="mt-5 mr-auto text-left">
                Using a bright and clear photo helps people connect to your fundraiser right away.
            </h2>
        </div>
    );
}

export default IntroMedia;
