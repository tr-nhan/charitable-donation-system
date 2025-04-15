import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { LayOut, Home, SignIn, SignUp, CreateCampaign, CampaignDetail, UserProfile } from "./pages";
import { GuestRoute, PrivateRoute } from "./components/FilterRoutes";
import { LoginSuccess, VerifyComponent } from "./components/LogicComponent";
import { fetchLoginStatus } from "./redux/authSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLoginStatus());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/verify/sign-up" element={<VerifyComponent />} />

            {/* Guess route */}
            <Route element={<GuestRoute />}>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Route>

            {/* Private route */}
            <Route element={<PrivateRoute />}>
                <Route element={<LayOut />}>
                    <Route path="/profile" element={<UserProfile />} />
                </Route>
                <Route path="/create-campaign" element={<CreateCampaign />} />
            </Route>
            <Route element={<LayOut />}>
                {/* Services */}
                <Route path="login-success" element={<LoginSuccess />} />

                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<CampaignDetail />} />
            </Route>
        </Routes>
    );
}

export default App;
