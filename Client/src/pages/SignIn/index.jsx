import { useMediaQuery } from "@mui/material";
import SignInMobile from "./SignInMobile";
import SignInPC from "./SignInPC";

const SignIn = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");

  return isMobile ? <SignInMobile /> : <SignInPC />;
};

export default SignIn;
