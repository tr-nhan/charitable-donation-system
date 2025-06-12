const transporter = require("../../config/nodeMailer");
const ejs = require("ejs");
const path = require("path");

const verifySignUpMail = async (urlVerify, email, subject) => {
    try {
        const emailTemplatePath = path.join(__dirname, "..", "..", "views", "verifySignUp.ejs");

        const html = await ejs.renderFile(emailTemplatePath, { urlVerify });

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject,
            html
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = verifySignUpMail;
