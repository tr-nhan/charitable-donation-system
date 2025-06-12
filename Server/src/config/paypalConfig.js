const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
require("dotenv").config();

const environment = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

const client = () => {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
};

module.exports = { client };
