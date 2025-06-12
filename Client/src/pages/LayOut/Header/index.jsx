import { useMediaQuery } from "@mui/material";
import HeaderMobile from "./HeaderMobile";
import HeaderPC from "./HeaderPC";

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");

  return isMobile ? <HeaderMobile /> : <HeaderPC />;
};

export default Header;
