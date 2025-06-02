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
    Deposit,
    PageNotFound,
    CampaignInfo,
    ManageCampaign,
    SearchCampaign,
    DonationCampaign,
    AdminDashboard,
    ReportCampaign,
    AdminManageCampaign,
    DiscoverUser,
    TransactionHistory
} from "./pages";
import { GuestRoute, PrivateRoute, AdminRoute } from "./components/FilterRoutes";
import {
    LoginSuccess,
    VerifyComponent,
    DepositSuccess,
    DepositUnsuccess
} from "./components/LogicComponent";
import { fetchLoginStatus } from "./redux/authSlice";
import Categories from "./pages/Categories/Categories";
import CategoriesPage from "./pages/Categories";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLoginStatus());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/verify/sign-up" element={<VerifyComponent />} />

            {/* Admin route */}
            <Route element={<AdminRoute />}>
                <Route element={<LayOut />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route
                        path="/admin/manage/campaign/:campaignId"
                        element={<AdminManageCampaign />}
                    />
                </Route>
            </Route>

            {/* Guess route */}
            <Route element={<GuestRoute />}>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Route>

            {/* Private user route */}
            <Route element={<PrivateRoute />}>
                <Route element={<LayOut />}>
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/balance" element={<BalanceManagement />} />
                    <Route path="/deposit/:method" element={<Deposit />} />
                    <Route path="/campaign/discover/:campaignId" element={<CampaignInfo />} />
                    <Route path="/campaign/manage/:campaignId" element={<ManageCampaign />} />
                    <Route path="/campaign/search" element={<SearchCampaign />} />
                    <Route path="/donation/:campaignId" element={<DonationCampaign />} />
                    <Route path="/campaign/report/:campaignId" element={<ReportCampaign />} />
                    <Route path="/user/discover/:userId" element={<DiscoverUser />} />
                    <Route path="/transaction/history" element={<TransactionHistory />} />
                </Route>
                <Route path="/create-campaign" element={<CreateCampaign />} />
            </Route>

            <Route element={<LayOut />}>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Route>

            <Route path="login-success" element={<LoginSuccess />} />
            <Route path="*" element={<PageNotFound />} />
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
