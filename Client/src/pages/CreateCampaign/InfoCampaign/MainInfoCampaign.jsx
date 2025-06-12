import { useEffect, useState } from "react";
import RichText from "../../../components/UI/RichText";

function MainInfoCampaign({ setData, saveData }) {
    const [inputValue, setInputValue] = useState({
        title: saveData.title || "",
        description: saveData.description || ""
    });

    useEffect(() => {
        setData({ title: inputValue.title, description: inputValue.description });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleChangeDescription = (content) => {
        // setWords(text.length === 0 ? 0 : text.split(" ").length);
        setInputValue((prev) => ({ ...prev, description: content }));
    };

    return (
        <div className="md:px-[160px] px-2 w-full flex flex-col md:justify-center justify-start items-start overflow-y-auto">
            <h1 className="md:hidden mb-5 font-semibold">Tell donors your story</h1>
            {/* Title */}
            <input
                type="text"
                className="w-full outline-gray-500 border-gray-400 border-[1px] bg-transparent text-lg p-2 rounded-md"
                placeholder="Title"
                value={inputValue.title}
                onChange={(e) => {
                    setInputValue({ ...inputValue, title: e.target.value });
                }}
            />

            {/* Description */}
            <div className="w-full">
                <RichText
                    content={inputValue.description}
                    onChange={handleChangeDescription}
                    classCustom={
                        "p-2 min-h-[250px] max-h-[400px] outline-gray-500 border-gray-400 border-[1px] rounded-md overflow-y-auto"
                    }
                />
            </div>
        </div>
    );
}

export default MainInfoCampaign;
