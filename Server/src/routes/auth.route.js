const router = require("express").Router();
const passport = require("../config/passportConfig")

const authController = require("../controllers/authController")

// login with LOCAL /api/auth/login/local [POST]
router.post("/login/local", authController.loginWithLocal);

// login with GOOGLE /api/auth/login/google
router.get("/login/google", passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

router.get("/login/google/callback", 
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/sign-in`, session: false }),
    authController.loginWithGoogle
)

// logout /api/auth/logout
router.get("/logout", authController.logout)

// check login status /api/auth/login/check
router.get("/login/check", authController.checkLogin)

// register /api/auth/sign-up
router.post("/sign-up", authController.signUpAccount)

// verify sign up /api/auth/verify/sign-up
router.post("/verify/sign-up", authController.verifySignUp)

// check token /api/auth/verify/check
router.post("/verify/check", authController.handleVerifyAccount)

module.exports = router
