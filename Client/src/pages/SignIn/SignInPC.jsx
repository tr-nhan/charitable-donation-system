import SignBg from "../../assets/images/SignInBgImg.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, Button, TextField, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import MainLogo from "../../assets/images/MainLogo.png";
import GoogleIcon from "../../assets/icons/GoogleIcon.png";
import { login } from "../../redux/authSlice.js";
import { emailValidate, passwordValidate } from "../../services/validateForm";
import { loginWithLocal } from "../../services/api/authApi.js";
import { ButtonCostume } from "../../components/UI";

function SignInPC() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [inputValue, setInputValue] = useState({ email: "", password: "" });
    const [validData, setValidData] = useState({
        email: { error: false, message: "" },
        password: { error: false, message: "" }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Login";
    }, []);

    const handleLoginLocal = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            let isValid = true;

            const validEmail = emailValidate(inputValue.email);
            if (validEmail.error) isValid = false;

            const validPassword = passwordValidate(inputValue.password);
            if (validPassword.error) isValid = false;

            if (!isValid) {
                setValidData(() => ({ email: validEmail, password: validPassword }));
                return;
            }

            const res = await loginWithLocal(inputValue.email, inputValue.password);

            if (res.error === 2) {
                setValidData(() => ({
                    email: { error: true, message: res.message },
                    password: { error: true, message: res.message }
                }));
                return;
            }

            if (res.error === 0) {
                dispatch(login(res.results));
                
                if (res.results.email?.toLowerCase() === "admin@gmail.com") {
                    console.log("called");
                    
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginWithGoogle = async () => {
        try {
            document.location.href = "http://localhost:8080/api/auth/login/google";
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${SignBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100vh"
            }}
            className="flex justify-center items-center">
            <div className="py-16 px-16 w-1/3 flex flex-col justify-center items-center bg-white rounded-3xl">
                <ButtonCostume sx={{ marginRight: "auto" }} onClick={() => navigate("/")}>
                    Back to Home
                </ButtonCostume>
                <Avatar src={MainLogo} alt="Main Logo" />
                <h1 className="mt-6 text-4xl font-semibold text-gray-700">Welcome</h1>
                <h2 className="mt-1 text-sm">Log in to UIT-FundMe to continue.</h2>
                <form
                    action=""
                    className="mt-5 w-full flex flex-col gap-3"
                    onSubmit={handleLoginLocal}>
                    <TextField
                        size="small"
                        fullWidth
                        label="Email Address"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "gray" },
                                "&:hover fieldset": { borderColor: "black" },
                                "&.Mui-focused fieldset": { borderColor: "#008044" }
                            },
                            "& .MuiInputLabel-root": { color: "gray" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#364153" }
                        }}
                        error={validData.email.error}
                        helperText={validData.email.message}
                        value={inputValue.email}
                        onChange={(e) => {
                            setInputValue((prev) => ({ ...prev, email: e.target.value }));
                            setValidData((prev) => ({
                                ...prev,
                                email: { error: false, message: "" }
                            }));
                        }}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        label="Password"
                        type={isVisiblePassword ? "text" : "password"}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "gray" },
                                "&:hover fieldset": { borderColor: "black" },
                                "&.Mui-focused fieldset": { borderColor: "#008044" }
                            },
                            "& .MuiInputLabel-root": { color: "gray" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#364153" }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    disableRipple
                                    onClick={() => setIsVisiblePassword((prev) => !prev)}>
                                    {isVisiblePassword ? (
                                        <VisibilityOutlinedIcon />
                                    ) : (
                                        <VisibilityOffOutlinedIcon />
                                    )}
                                </IconButton>
                            )
                        }}
                        error={validData.password.error}
                        helperText={validData.password.message}
                        value={inputValue.password}
                        onChange={(e) => {
                            setInputValue((prev) => ({ ...prev, password: e.target.value }));
                            setValidData((prev) => ({
                                ...prev,
                                password: { error: false, message: "" }
                            }));
                        }}
                    />
                    <Button
                        fullWidth
                        sx={{
                            paddingY: "10px",
                            backgroundColor: "#333",
                            color: "#fafafa",
                            textTransform: "none",
                            borderRadius: "8px"
                        }}
                        type="submit">
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin"></AiOutlineLoading3Quarters>
                        ) : (
                            "Log In"
                        )}
                    </Button>
                </form>
                <div className="my-3 w-full flex flex-row justify-center items-center gap-2">
                    <hr className="flex-1 border opacity-20" />
                    <span>or</span>
                    <hr className="flex-1 border opacity-20" />
                </div>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        paddingY: 0,
                        borderColor: "#6f6f6f",
                        color: "#252525",
                        textTransform: "none",
                        borderRadius: "8px"
                    }}
                    startIcon={<Avatar src={GoogleIcon} alt="Google Icon" />}
                    onClick={handleLoginWithGoogle}>
                    Continue with Google
                </Button>
                <hr className="my-5 w-full border opacity-20" />
                <span className="mr-auto mb-2 text-sm">Haven't an account yet</span>
                <Button
                    fullWidth
                    sx={{
                        paddingY: "10px",
                        backgroundColor: "#333",
                        color: "#fafafa",
                        textTransform: "none",
                        borderRadius: "8px"
                    }}
                    onClick={() => navigate("/sign-up")}>
                    Create an account
                </Button>
            </div>
        </div>
    );
}

export default SignInPC;
