import { useMediaQuery } from "@mui/material";
import PcDevice from "./PcDevice";
import MobileDevice from "./MobileDevice";

function CreateCampaign() {
    const isMobile = useMediaQuery("(max-width: 900px)");

    return isMobile ? <MobileDevice /> : <PcDevice />;
}

export default CreateCampaign;
