import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Avatar,
    FormControl,
    Select,
    MenuItem,
    Input,
    InputAdornment,
    Button
} from "@mui/material";

import { createNewOrderPaypal } from "../../services/api/transactionApi";
import { exchangeCurrency } from "../../services/api/currencyRateApi";
import MomoLogo from "../../assets/images/momo_icon_square_pinkbg_RGB.png";
import USDTLogo from "../../assets/images/tether-usdt-logo.png";
import PaymeLogo from "../../assets/images/Logo-PayME-V.webp";
import PaypalLogo from "../../assets/images/paypal.png";

const PAYMENT_METHODS = [
    {
        id: "momo",
        name: "Momo (Not support now)",
        img: MomoLogo
    },
    // {
    //     id: "payme",
    //     name: "Payme",
    //     img: PaymeLogo
    // },
    {
        id: "paypal",
        name: "Palpal",
        img: PaypalLogo
    }
    // {
    //     id: "binance",
    //     name: "Binance ETH",
    //     img: USDTLogo
    // }
];

const POLICIES = {
    // payme: {
    //     processingTime: "Instant - 10 minutes",
    //     fee: "0%",
    //     limit: [10000, 10000000],
    //     currency: "VND"
    // },
    paypal: {
        processingTime: "Instant - 10 minutes",
        fee: "0%",
        limit: [10000, 10000000],
        currency: "VND"
    },
    // momo: {
    //     processingTime: "Instant - 10 minutes",
    //     fee: "0%",
    //     limit: [10000, 10000000],
    //     currency: "VND"
    // },
    binance: {
        processingTime: "Instant - 10 minutes",
        fee: "",
        limit: [100, 10000],
        currency: "ETH"
    }
};

const formatCurrencyVND = (amount) => {
    return amount.toLocaleString("vi-VN");
};

const initHelperText = (method) => {
    var helperText = "";
    if (method === "momo" || method === "zalopay" || method === "payme") {
        const min = POLICIES[method].limit[0];
        const max = POLICIES[method].limit[1];
        helperText += formatCurrencyVND(min) + " - " + formatCurrencyVND(max) + " VND";
    } else if (method === "binance") {
        const min = POLICIES[method].limit[0];
        const max = POLICIES[method].limit[1];
        helperText += formatCurrencyVND(min) + " - " + formatCurrencyVND(max) + " USDT";
    }

    return helperText;
};

function Deposit() {
    const navigate = useNavigate();
    const { method } = useParams();
    const [amountInput, setAmountInput] = useState("");
    const [amountUSD, setAmountUSD] = useState("0");
    const [currencyRate, setCurrencyRate] = useState("");
    const [amountHelpText, setAmountHelpText] = useState(() => initHelperText(method));
    const [allowDeposite, setAllowDeposite] = useState(false);

    useEffect(() => {
        const fetchCurrencyRate = async () => {
            const res = await exchangeCurrency("VND");

            setCurrencyRate(() => {
                return res.rates.VND || "26000";
            });
        };
        fetchCurrencyRate();
    }, []);

    if (method !== "paypal" && method !== "momo") {
        return navigate("/balance");
    }

    const handleChangeAmountInput = (e) => {
        const value = e.target.value;

        if (value !== "" && Number.isNaN(Number(value))) return;

        setAmountInput(value);
        setAmountUSD((Number(value) / Number(currencyRate)).toFixed(2));

        const min = POLICIES[method].limit[0];
        const max = POLICIES[method].limit[1];
        const currency = POLICIES[method].currency;

        if (value !== "" && value !== "0") {
            if (!(Number(value) >= Number(min) && Number(value) <= Number(max))) {
                setAllowDeposite(false);
                setAmountHelpText(
                    `Amount must be in ${formatCurrencyVND(min)} ${formatCurrencyVND(max)} ${currency}`
                );
                return;
            }
        }
        if (value === "" || value === "0") {
            setAllowDeposite(false);
            setAmountHelpText(() => initHelperText(method));
            return;
        }

        setAllowDeposite(true);
        setAmountHelpText(() => initHelperText(method));
    };

    // Handle pay
    const handleContinue = async () => {
        if (method === "paypal") {
            const res = await createNewOrderPaypal(amountUSD);

            if (res) {
                localStorage.setItem("fiatDeposit", String(amountInput));
                const approvalUrl = res.approvalUrl;
                window.location.href = approvalUrl;
            } else {
                alert("Failed to create PayPal order");
            }
        }
    };

    return (
        <div className="px-6 md:px-20 py-14 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3">
            <div className="col-span-1 sm:col-span-2 flex flex-col items-start justify-start">
                <h1 className="text-[#141d22] text-4xl font-semibold">Deposite</h1>
                <Link to={"/balance"} className="text-[#1172cc] text-sm mt-1">
                    Manage your balance
                </Link>
                {/* Select payment methods */}
                <div className="mt-10 w-full">
                    <label htmlFor="payment-method" className="text-sm text-[#252525]">
                        Payment method
                    </label>
                    <FormControl
                        size="small"
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#252525"
                                },
                                "&:hover fieldset": {
                                    borderColor: "#6f6f6f"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#252525",
                                    borderWidth: "2px"
                                }
                            },
                            marginTop: "2px"
                        }}>
                        <Select
                            id="payment-method"
                            defaultValue={method}
                            onChange={(e) => {
                                navigate(`/deposite/${e.target.value}`);
                            }}>
                            {PAYMENT_METHODS.map((method) => (
                                <MenuItem
                                    key={method.id}
                                    value={method.id}
                                    sx={{
                                        paddingY: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        "&.Mui-selected": {
                                            backgroundColor: "rgba(108, 133, 149, 0.12) !important"
                                        },
                                        "&.Mui-selected:hover": {
                                            backgroundColor: "rgba(108, 133, 149, 0.08)"
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(108, 133, 149, 0.08)"
                                        }
                                    }}>
                                    <div className="flex items-center gap-1">
                                        <Avatar
                                            alt={method.name}
                                            src={method.img}
                                            sx={{ width: 20, height: 20, marginRight: 1 }}
                                        />
                                        {method.name}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                {/* Amount input */}
                <div className="mt-10 w-full flex flex-col">
                    <label htmlFor="amount-money" className="text-sm text-[#252525]">
                        Amount
                    </label>
                    <Input
                        placeholder="0"
                        onChange={handleChangeAmountInput}
                        value={amountInput}
                        endAdornment={<InputAdornment>{POLICIES[method].currency}</InputAdornment>}
                        id="amount-money"
                        fullWidth
                        sx={{
                            marginTop: "2px",
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#141d22",
                            fontFamily: "'Poppins', sans-serif",
                            "& .MuiInputBase-input": {
                                fontSize: "20px",
                                fontWeight: 600,
                                color: "#141d22",
                                fontFamily: "'Poppins', sans-serif"
                            },
                            "&:before": {
                                borderBottom: "1px solid #ccc"
                            },
                            "&:hover:not(.Mui-disabled):before": {
                                borderBottom: "1px solid #252525"
                            },
                            "&:after": {
                                borderBottom: "2px solid #252525"
                            }
                        }}
                    />
                    <p
                        className={`${
                            amountInput !== "" && amountInput !== "0" && !allowDeposite
                                ? "text-red-600"
                                : "text-blue-500"
                        }`}>
                        {amountHelpText}
                    </p>
                </div>
                {/* Exchange from VND to USD */}
                {method === "paypal" && (
                    <div className="mt-10 p-3 w-full bg-gray-200">
                        <p className="text-sm">To be deposited</p>
                        <h3 className="text-xl text-[##141d22] font-semibold">{amountUSD} USD</h3>
                    </div>
                )}
                {/* Button continue */}
                <Button
                    onClick={handleContinue}
                    size="small"
                    fullWidth
                    disabled={!allowDeposite}
                    sx={{
                        backgroundColor: "#008044",
                        ":hover": { backgroundColor: "#015d32", color: "#e0ddd6" },
                        marginTop: "40px",
                        paddingY: "10px",
                        color: "#252525",
                        fontWeight: "600",
                        fontSize: "14px",
                        "&.Mui-disabled": {
                            backgroundColor: "#f5f5f5",
                            color: "#bdbdbd",
                            cursor: "not-allowed"
                        }
                    }}>
                    Continue
                </Button>
            </div>
            <div className="mt-10 sm:mt-0 col-span-1 sm:col-span-1 pl-0 sm:pl-5">
                <div className="pl-0 sm:pl-5 border-0 sm:border-l-[1px] sm:border-[#e0ddd6]">
                    <h2 className="text-2xl font-semibold text-[#252525]">Term</h2>
                    <p className="mt-4 text-[#6f6f6f] leading-relaxed">
                        Processing time{" "}
                        <span className="text-[#252525] font-semibold">
                            {POLICIES[method].processingTime}
                        </span>
                        <br />
                        Fee{" "}
                        <span className="text-[#252525] font-semibold">{POLICIES[method].fee}</span>
                        <br />
                        Limit{" "}
                        <span className="text-[#252525] font-semibold">
                            {formatCurrencyVND(POLICIES[method].limit[0])} -{" "}
                            {formatCurrencyVND(POLICIES[method].limit[1])}{" "}
                            {POLICIES[method].currency}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Deposit;
