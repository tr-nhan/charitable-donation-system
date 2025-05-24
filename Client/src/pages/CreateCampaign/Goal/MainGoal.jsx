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
        const value = e.target.value.replace(/[^\d.]/g, ""); // allow float numbers
        setData({ goal_crypto: value });
        setInputCrypto(value);
    };

    return (
        <div className="px-[160px] w-full h-full flex flex-col justify-center items-start text-center leading-12">
            {/* VND Goal Field */}
            <fieldset className="relative border border-gray-400 px-3 rounded-md w-full flex flex-row justify-between items-center gap-2 mb-4">
                <LocalAtmIcon />
                <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all duration-200">
                    Your starting goal (VND)
                </legend>
                <input
                    type="text"
                    className="w-full outline-none border-none bg-transparent text-lg p-1 mt-2"
                    placeholder=""
                    onFocus={(e) =>
                        e.target.previousElementSibling.classList.add("text-blue-500", "text-xs")
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            e.target.previousElementSibling.classList.remove(
                                "text-blue-500",
                                "text-xs"
                            );
                        }
                    }}
                    onChange={handleFormatValue}
                    value={inputValue}
                />
                <span>VND</span>
            </fieldset>

            {/* USDT Goal Field */}
            <fieldset className="relative border border-gray-400 px-3 rounded-md w-full flex flex-row justify-between items-center gap-2">
                <FaDollarSign />
                <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-white px-1 text-gray-500 text-sm transition-all duration-200">
                    Your crypto goal (USDT)
                </legend>
                <input
                    type="text"
                    className="w-full outline-none border-none bg-transparent text-lg p-1 mt-2"
                    placeholder="Optional"
                    onFocus={(e) =>
                        e.target.previousElementSibling.classList.add("text-blue-500", "text-xs")
                    }
                    onBlur={(e) => {
                        if (!e.target.value) {
                            e.target.previousElementSibling.classList.remove(
                                "text-blue-500",
                                "text-xs"
                            );
                        }
                    }}
                    onChange={handleCryptoChange}
                    value={inputCrypto}
                />
                <span>USDT</span>
            </fieldset>

            {/* Suggestion Info */}
            <div className="mt-10 p-5 w-full bg-[#f4f2ec] rounded-2xl flex flex-col justify-between items-start gap-2">
                <h2 className="text-[16px] font-semibold">
                    Fundraisers like yours typically aim to raise 10,000,000 VND or more.
                </h2>
                <hr className="w-full border-gray-300" />
                <div className="flex flex-row justify-start items-center gap-2">
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
