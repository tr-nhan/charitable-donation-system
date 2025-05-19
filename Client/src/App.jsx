import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    LayOut,
    Home,
    SignIn,
    SignUp,
    CreateCampaign,
    CampaignDetail,
    UserProfile,
    BalanceManagement,
    Deposit
} from "./pages";
import { GuestRoute, PrivateRoute } from "./components/FilterRoutes";
import {
    LoginSuccess,
    VerifyComponent,
    DepositSuccess,
    DepositUnsuccess
} from "./components/LogicComponent";
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
                    <Route path="/balance" element={<BalanceManagement />} />
                    <Route path="/deposit/:method" element={<Deposit />} />
                </Route>
                <Route path="/create-campaign" element={<CreateCampaign />} />
            </Route>

            <Route element={<LayOut />}>
                <Route path="/" element={<Home />} />
            </Route>

            
            <Route path="login-success" element={<LoginSuccess />} />
            <Route path="/deposit/:method/payment-success" element={<DepositSuccess />} />
            <Route path="/deposit/:method/payment-cancelled" element={<DepositUnsuccess />} />

            <Route element={<PrivateRoute />}>
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<CampaignDetail />} />
            </Route>
        </Routes>
    );
}

export default App;
