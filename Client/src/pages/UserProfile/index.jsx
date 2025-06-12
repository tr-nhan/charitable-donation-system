import User from "./User";
import UserCampaigns from "./UserCampaigns";

function UserProfile() {
    return (
        <div className="w-full py-10 px-5 min-h-screen">
            <User />
            <hr className="w-full my-7 border-[#e5e1d7]" />
            <UserCampaigns />
        </div>
    );
}

export default UserProfile;
