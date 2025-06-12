const router = require("express").Router();

const userController = require("../controllers/userController");
const verifyLogIn = require("../middlewares/auth/verifyLogIn");
const { uploadAvatar } = require("../middlewares/storeImgCloud/index");

// get user info /api/user
router.get("/", verifyLogIn, userController.getUser);

// get user info by id
router.get("/info", userController.getUserbyId);

// update user's avatar /api/user/update/avatar
router.post(
    "/update/avatar",
    verifyLogIn,
    uploadAvatar.single("newAvatar"),
    userController.updateAvatar
);

// update user info /api/user/update
router.post("/update", verifyLogIn, userController.updateUserInfoController);

module.exports = router;
