const deleteImageFromCloudinary = require("../middlewares/deleteImgCloud");
const {
    updateUserAvatarInDatabase,
    updateUserInfo,
    getInfoFilter
} = require("../models/query/usersQuery");

const getUser = async (req, res) => {
    const filters = req.query;

    try {
        if (Object.keys(filters).length === 0) return res.json({ error: 0, results: [] });

        let userInfo = await getInfoFilter(filters);

        if (userInfo.length > 0) {
            userInfo = userInfo.map((user) => ({
                ...user,
                password_hash: ""
            }));
        }

        res.json({ error: 0, results: userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const getUserbyId = async (req, res) => {
    const { userId } = req.body;

    try {
        let userInfo = await getInfoFilter({ user_id: userId });

        if (userInfo.length > 0) {
            userInfo = userInfo.map((user) => ({
                ...user,
                password_hash: ""
            }));
        }

        res.json({ error: 0, results: userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const updateAvatar = async (req, res) => {
    let { oldAvatar, newAvatar } = req.body;
    const user_id = req.user.user_id;

    try {
        newAvatar = req.file?.path;

        // Assuming you have a function to update the avatar in the database
        const updatedAvatar = await updateUserAvatarInDatabase(user_id, newAvatar);

        if (oldAvatar !== undefined) {
            await deleteImageFromCloudinary(oldAvatar);
        }

        if (updatedAvatar) {
            res.json({ error: 0, results: updatedAvatar });
        } else {
            res.status(500).json({ error: 1, message: "Failed to update avatar" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const updateUserInfoController = async (req, res) => {
    const dataChange = req.body;
    const user_id = req.user.user_id;

    try {
        if (!dataChange) return res.status(400).json({ error: 2, message: "No data to update" });

        const updatedUser = await updateUserInfo(dataChange, user_id);

        res.json({ error: 0, results: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getUser,
    updateAvatar,
    updateUserInfoController,
    getUserbyId
};
