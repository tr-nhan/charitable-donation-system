import { useMediaQuery } from "@mui/material";
import SignUpMobile from "./SignUpMobile";
import SignUpPC from "./SignUpPC";

const SignUp = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");

  return isMobile ? <SignUpMobile /> : <SignUpPC />;
};

export default SignUp;
