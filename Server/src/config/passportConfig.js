const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcryptjs");

const hashPassword = require("../utils/hashPassword");
const { getInfoFilter, insertUser, getPassword } = require("../models/query/usersQuery");

// Local Strategy
passport.use(
    new LocalStrategy(async function (email, password, done) {
        try {
            if (!email || !password) {
                return done(null, false, { message: "Missing credentials" });
            }

            let result = await getInfoFilter({ email: email, provider: "local" });

            if (result.length === 0) return done(null, false, { message: "Username not found" });

            result = result[0];

            const passwordHash = await getPassword(result.user_id);

            const isMatch = await bcrypt.compare(password, passwordHash.password_hash);

            if (!isMatch) return done(null, false, { message: "Password is incorrect" });

            return done(null, result);
        } catch (error) {
            return done(error);
        }
    })
);

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/login/google/callback`
        },
        async function (accessToken, refreshToken, profile, done) {
            const email = profile.emails[0].value;
            const full_name = profile.displayName;
            const profile_image = profile.picture;
            const id = profile.id;
            const password_hash = await hashPassword(id);

            try {
                if (!email) return done("Server is broken", false);

                const user = await getInfoFilter({ email, provider: "google" });

                // If user is existed
                if (user.length === 1) {
                    const passwordHash = await getPassword(user[0].user_id);

                    const oldPass = passwordHash.password_hash;

                    const isMatch = await bcrypt.compare(id, oldPass);

                    if (isMatch)
                        return done(null, { user_id: user[0].user_id, email: user[0].email });
                    return done(null, false);
                }

                // If not existed
                const newUser = await insertUser([
                    { email },
                    { full_name },
                    { password_hash },
                    { profile_image },
                    { provider: "google" }
                ]);
                return done(null, { user_id: newUser.user_id, email: newUser.email });
            } catch (error) {
                return done(error);
            }
        }
    )
);

module.exports = passport;
