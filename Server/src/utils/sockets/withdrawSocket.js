const {
    insertWithdrawRequest,
    updateStatusWithdrawRequestQuery
} = require("../../models/query/withdrawQuery");
const { updateCampaignBalanceQuery } = require("../../models/query/campaignsQuery");

const handleWithdrawSocket = (io) => {
    io.on("connection", (socket) => {
        // Step 1: User joins their own room using their userId
        socket.on("join-user-room", (userId) => {
            socket.join(userId);
        });

        // Step 2: User sends withdraw request
        socket.on("withdraw-request", async (data, callback) => {
            const result = await insertWithdrawRequest({
                campaignId: data.campaignId,
                amount: data.amount,
                method: data.method,
                methodInfo: data.methodInfo
            });

            if (result.error === 0) {
                io.emit("new-withdraw-request", {
                    campaignId: data.campaignId,
                    userId: data.userId
                });
                callback({ status: "ok" }); // ✅ confirm success
            } else {
                callback({ status: "error", message: result.message });
            }
        });

        // Step 3: Admin responds with decision
        socket.on("withdraw-response", async ({ campaignId, userId, status, amount, id }) => {
            try {
                if (status === "success") {
                    await updateStatusWithdrawRequestQuery(status, id);
                } else if (status === "reject") {
                    await updateStatusWithdrawRequestQuery(status, id);
                    await updateCampaignBalanceQuery(campaignId, "inc", amount);
                }

                // Notify user only after DB success
                io.to(userId).emit("withdraw-result", {
                    campaignIdS: campaignId,
                    statusS: status,
                    idS: id,
                    amountS: amount
                });
            } catch (err) {
                console.error("Withdraw update failed:", err);
                // optionally emit error to admin/client
            }
        });
    });
};

module.exports = { handleWithdrawSocket };
