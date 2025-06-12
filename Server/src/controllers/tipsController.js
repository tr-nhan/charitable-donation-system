const sendFundraiserTipsMail = require("../utils/sendMail/sendFundraiserTipsMail");

const sendTips = async (req, res) => {
  const { email } = req.body;

  try {
    await sendFundraiserTipsMail(email);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email." });
  }
};

module.exports = { sendTips };
