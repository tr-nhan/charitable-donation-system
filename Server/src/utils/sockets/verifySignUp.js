const verifySignUp = (io) => {
    io.on("connection", (socket) => {
        socket.on("join-room-verify", (email) => {
            socket.join(email);
        });
    });
};

const notifyVerificationStatus = (io, email, success) => {       
    io.to(email).emit("server-send-status", success);
};

module.exports = { verifySignUp, notifyVerificationStatus };
