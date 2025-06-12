import { useEffect, useState } from "react";
import { getCategoriesCampaign } from "../../../services/api/campaignApi";

function MainChooseType({ setData, saveData }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesCampaign();
            if (res.error !== 0) {
                console.log(res.message);
            } else {
                setCategories(res.results);
                if (!saveData.category) {
                    setSelectedCategory(res.results[0].category_name);
                    setData({ category: res.results[0].category_id });
                } else {
                    setSelectedCategory(
                        res.results.find((c) => c.category_id === saveData.category)
                            ?.category_name || ""
                    );
                }
            }
        };
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full px-6 md:px-20 lg:px-40 py-4 flex flex-col justify-center items-start text-left">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
                What best describes why you're fundraising?
            </h2>
            <form className="flex flex-wrap gap-3">
                {categories.map((category) => (
                    <div key={category.category_id} className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            id={category.category_id}
                            value={category.category_name}
                            checked={selectedCategory === category.category_name}
                            className="hidden peer"
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setData({ category: category.category_id });
                            }}
                        />
                        <label
                            htmlFor={category.category_id}
                            className="px-4 py-2 text-[15px] border rounded-3xl border-[#c0bdb8] 
                                hover:bg-[#ebfbe2] hover:border-[#c0bdb8] cursor-pointer
                                peer-checked:bg-[#ebfbe2] peer-checked:border-[#015d32]
                                transition-all duration-150 text-center">
                            {category.category_name}
                        </label>
                    </div>
                ))}
            </form>
        </div>
    );
}

export default MainChooseType;
