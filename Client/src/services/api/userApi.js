import axios from "axios";

const SERVER_URL = "http://localhost:8080/api/user";

const getUserInfo = async (filters) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const res = await axios.get(`${SERVER_URL}?${queryString}`, { withCredentials: true });

        return res.data;
    } catch (error) {
        console.log(error);
        return { error: 400, message: "Client fault" };
    }
};

const updateAvatar = async (formData) => {
    try {
        const res = await axios.post(`${SERVER_URL}/update/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return { error: 400, message: "Client fault" };
    }
};

const updateUser = async (data) => {
    try {
        const res = await axios.post(`${SERVER_URL}/update`, data, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log(error);
        return { error: 400, message: "Client fault" };
    }
}

export { getUserInfo, updateAvatar, updateUser };
