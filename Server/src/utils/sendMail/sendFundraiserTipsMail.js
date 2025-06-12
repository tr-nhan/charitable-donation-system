const transporter = require("../../config/nodeMailer");
const ejs = require("ejs");
const path = require("path");

const sendFundraiserTipsMail = async (email) => {
  try {
    const templatePath = path.join(__dirname, "..", "..", "views", "fundraiserTips.ejs");
    const html = await ejs.renderFile(templatePath);

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your GoFundUIT tips for getting started",
      html,
    });
  } catch (err) {
    console.error("Email sending error:", err);
    throw err;
  }
};

module.exports = sendFundraiserTipsMail;
