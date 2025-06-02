import { useState } from "react";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { PiFlowerLotusDuotone } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa";

function MainGoal({ setData, saveData }) {
    const [inputValue, setInputValue] = useState(saveData.goal_amount || "");
    const [inputCrypto, setInputCrypto] = useState(saveData.goal_amount_usdt || "");

    const handleFormatValue = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setData({ goal_fiat: formatted });
        setInputValue(formatted);
    };

    const handleCryptoChange = (e) => {
        const value = e.target.value.replace(/[^\d.]/g, "");
        setData({ goal_crypto: value });
        setInputCrypto(value);
    };

    return (
        <div className="w-full px-4 md:px-10 lg:px-40 py-6 flex flex-col justify-center items-start text-left">
            {/* VND Goal Field */}
            <fieldset className="relative border border-gray-400 px-3 py-2 rounded-md w-full flex items-center gap-2 mb-5">
                <LocalAtmIcon />
                <legend className="absolute -top-2 left-3 transform -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all duration-200">
                    Your starting goal (VND)
                </legend>
                <input
                    type="text"
                    className="w-full outline-none border-none bg-transparent text-lg"
                    placeholder=""
                    onFocus={(e) =>
                        e.target.previousElementSibling.classList.add("text-blue-500", "text-xs")
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            e.target.previousElementSibling.classList.remove("text-blue-500", "text-xs");
                        }
                    }}
                    onChange={handleFormatValue}
                    value={inputValue}
                />
                <span className="text-sm text-gray-600">VND</span>
            </fieldset>

            {/* ETH Goal Field */}
            <fieldset className="relative border border-gray-400 px-3 py-2 rounded-md w-full flex items-center gap-2 mb-5">
                <FaDollarSign />
                <legend className="absolute -top-2 left-3 transform -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all duration-200">
                    Your crypto goal (ETH)
                </legend>
                <input
                    type="text"
                    className="w-full outline-none border-none bg-transparent text-lg"
                    placeholder="Optional"
                    onFocus={(e) =>
                        e.target.previousElementSibling.classList.add("text-blue-500", "text-xs")
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            e.target.previousElementSibling.classList.remove("text-blue-500", "text-xs");
                        }
                    }}
                    onChange={handleCryptoChange}
                    value={inputCrypto}
                />
                <span className="text-sm text-gray-600">USDT</span>
            </fieldset>

            {/* Suggestion Info */}
            <div className="mt-8 p-4 md:p-5 w-full bg-[#f4f2ec] rounded-2xl flex flex-col gap-3">
                <h2 className="text-[16px] font-semibold leading-snug">
                    Fundraisers like yours typically aim to raise 10,000,000 VND or more.
                </h2>
                <hr className="w-full border-gray-300" />
                <div className="flex items-center gap-2">
                    <PiFlowerLotusDuotone className="text-green-700" />
                    <p className="text-[14px] text-[#6f6f6f]">
                        Based on goals for similar fundraisers
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MainGoal;
