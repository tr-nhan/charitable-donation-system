import User from "./User";
import UserCampaigns from "./UserCampaigns";

function UserProfile() {
    return (
        <div className="px-5 w-full flex flex-col items-center justify-center h-screen">
            <User />
            <hr className="w-full mt-7 border-[#e5e1d7]" />
            <UserCampaigns />
        </div>
    );
}

export default UserProfile;
