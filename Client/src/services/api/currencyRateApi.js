import axios from "axios";

const exchangeCurrency = async (symbol) => {
    try {
        const res = await axios.get(
            `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=dd23bc8393424088ae985dae409101a2&symbols=${symbol}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export {
    exchangeCurrency,
}
