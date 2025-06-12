import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/UI";
import { Select, MenuItem } from "@mui/material";

import { getCategoriesCampaign, getCampaignsByFilter } from "../../services/api/campaignApi";
import { useBounce } from "../../services/hooks";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

const formatCurrencyVND = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3
    }).format(parsed);
};

function getGreenShade(percent) {
    if (percent < 25) return "#d1fae5";
    if (percent < 50) return "#6ee7b7";
    if (percent < 75) return "#34d399";
    return "#059669"; // emerald-600
}

function SearchCampaign() {
    const navigate = useNavigate();
    // paginatio
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    // campaigns filtered
    const [campaigns, setCampaigns] = useState([]);
    // filters input
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");
    const [goal, setGoal] = useState("");
    // init state
    const [categories, setCategories] = useState("");
    const goalOptions = [
        [null, null],
        [1000000, 10000000],
        [10000000, 50000000],
        [50000000, 100000000],
        [100000000, 200000000],
        [200000000, 500000000],
        [500000000, 1000000000],
        [1000000000, null]
    ];
    // debounce
    const debouncedSearch = useBounce(searchInput, 1000);
    // loading
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesCampaign();
            if (res.error !== 0) {
                console.error("Failed to fetch categories:", res.message);
            } else {
                const allCategories = [
                    { category_id: "", category_name: "Category" },
                    ...res.results
                ];
                setCategories(allCategories);
            }
        };
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const res = await getCampaignsByFilter({
                    page: 1
                });

                if (res.error === 0) {
                    setCampaigns(res.results.data);
                    setTotalPage(res.results.totalPage);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
        fetchCategories();
    }, []);

    useEffect(() => {
        // Skip logging if nothing is typed yet
        if (debouncedSearch.trim() === "") return;

        // Parse goal string back into array or null
        const parsedGoal = goal ? JSON.parse(goal) : null;

        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                var filters = {
                    q: searchInput,
                    fromGoal: parsedGoal ? parsedGoal[0] || 0 : 0,
                    toGoal: parsedGoal
                        ? parsedGoal[1] || Number.MAX_SAFE_INTEGER
                        : Number.MAX_SAFE_INTEGER,
                    page
                };

                const res = await getCampaignsByFilter(filters);
                if (res.error === 0) {
                    setCampaigns(res.results.data);
                    setTotalPage(res.results.totalPage);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    if (!categories) return <Loading />;

    // handle filter by click button
    const handleFilter = () => {
        const parsedGoal = goal ? JSON.parse(goal) : null;

        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                var filters = {
                    q: searchInput,
                    fromGoal: parsedGoal ? parsedGoal[0] || 0 : 0,
                    toGoal: parsedGoal
                        ? parsedGoal[1] || Number.MAX_SAFE_INTEGER
                        : Number.MAX_SAFE_INTEGER,
                    page,
                    categoryId: category
                };

                const res = await getCampaignsByFilter(filters);
                if (res.error === 0) {
                    setCampaigns(res.results.data);
                    setTotalPage(res.results.totalPage);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    };

    const handleShowMore = () => {
        const parsedGoal = goal ? JSON.parse(goal) : null;
        const nextPage = page + 1;

        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                var filters = {
                    q: searchInput,
                    fromGoal: parsedGoal ? parsedGoal[0] || 0 : 0,
                    toGoal: parsedGoal
                        ? parsedGoal[1] || Number.MAX_SAFE_INTEGER
                        : Number.MAX_SAFE_INTEGER,
                    page: nextPage
                };

                const res = await getCampaignsByFilter(filters);
                if (res.error === 0) {
                    setCampaigns((prev) => [...prev, ...res.results.data]);
                    setTotalPage(res.results.totalPage);
                    setPage(nextPage);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    };

    if (loading) return <Loading />;

    return (
        <div className="px-4 md:px-24 py-10 w-full flex flex-col items-center justify-center gap-10">
            {/* Heading */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Find Fundraisers and Campaigns
                </h1>
                <h2 className="text-md md:text-lg text-gray-600">
                    Search by name, title, or category
                </h2>
            </div>

            {/* Search input */}
            <div className="relative w-full max-w-xl">
                <SearchOutlinedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search campaigns..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-800 placeholder-gray-400"
                />
            </div>

            {/* Filter */}
            <div className="w-full flex flex-row justify-center items-center gap-2 flex-wrap">
                <div className="px-3 py-2 text-[#252525] flex flex-row gap-2 border-[#949392] border-[1px] rounded-3xl bg-[#fbfaf8]">
                    <TuneOutlinedIcon sx={{ fontWeight: 300 }} />
                    <p>Filter</p>
                </div>

                {/* Options category */}
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 250,
                                bgcolor: "#fefcfb",
                                boxShadow: 3,
                                borderRadius: 2,
                                mt: 1,
                                "& .MuiMenuItem-root": {
                                    fontSize: 14,
                                    color: "#252525",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    transition: "all 0.2s ease-in-out",

                                    "&:hover": {
                                        backgroundColor: "#f1eee9"
                                    },

                                    "&.Mui-selected": {
                                        backgroundColor: "#e0ddd6 !important",
                                        fontWeight: 600
                                    }
                                }
                            }
                        }
                    }}
                    sx={{
                        backgroundColor: "#fbfaf8",
                        borderRadius: 5,
                        height: 40,
                        ".MuiSelect-select": {
                            padding: "4px 16px",
                            color: "#252525",
                            borderColor: "#949392"
                        },
                        "& fieldset": {
                            borderColor: "#949392"
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#949392"
                        },
                        "&.Mui-expanded .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#949392"
                        }
                    }}>
                    <MenuItem disabled value="">
                        Select Category
                    </MenuItem>
                    {categories.map((cat) => (
                        <MenuItem
                            key={cat.category_id}
                            value={cat.category_id}
                            sx={{ marginTop: "5px" }}>
                            {cat.category_name}
                        </MenuItem>
                    ))}
                </Select>

                {/* Options goal */}
                <Select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    displayEmpty
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 250,
                                bgcolor: "#fefcfb",
                                boxShadow: 3,
                                borderRadius: 2,
                                mt: 1,
                                "& .MuiMenuItem-root": {
                                    fontSize: 14,
                                    color: "#252525",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "#f1eee9"
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "#e0ddd6 !important",
                                        fontWeight: 600
                                    }
                                }
                            }
                        }
                    }}
                    sx={{
                        backgroundColor: "#fbfaf8",
                        borderRadius: 5,
                        height: 40,
                        ".MuiSelect-select": {
                            padding: "4px 16px",
                            color: "#252525",
                            borderColor: "#949392"
                        },
                        "& fieldset": {
                            borderColor: "#949392"
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#949392"
                        },
                        "&.Mui-expanded .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#949392"
                        }
                    }}>
                    <MenuItem disabled value="">
                        Select goal range
                    </MenuItem>
                    {goalOptions.map(([min, max], index) => {
                        const val = min === null && max === null ? "" : JSON.stringify([min, max]);
                        let text = "";

                        if (min === null && max === null) {
                            text = "Goal"; // or "All Goals"
                        } else if (max === null) {
                            text = `≥ ${formatCurrencyVND(min)}`;
                        } else {
                            text = `${formatCurrencyVND(min)} - ${formatCurrencyVND(max)}`;
                        }

                        return (
                            <MenuItem key={index} value={val} sx={{ marginTop: "5px" }}>
                                {text}
                            </MenuItem>
                        );
                    })}
                </Select>

                {/* Filter button */}
                <button
                    onClick={handleFilter}
                    className="px-5 h-[40px] rounded-3xl bg-[#252525] text-white text-sm font-medium border border-[#252525] transition-all duration-200 hover:bg-white hover:text-[#252525] hover:border-[#252525] shadow-sm">
                    Apply Filter
                </button>
            </div>

            {/* Campaign List */}
            <div className="w-full max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {campaigns.map((c, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 animate-fade-in cursor-pointer"
                            onClick={() => navigate(`/campaign/discover/${c.campaign_id}`)}>
                            <img
                                src={c.campaign_image}
                                alt="Campaign thumbnail"
                                className="w-full h-40 object-cover rounded-xl mb-4"
                            />
                            <h2 className="text-lg font-semibold mb-1 truncate">{c.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">by {c.full_name}</p>
                            {/* Custom Progress Bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full`}
                                    style={{
                                        width: `${(c.current_fiat / c.goal_fiat) * 100}%`,
                                        backgroundColor: getGreenShade(
                                            (c.current_fiat / c.goal_fiat) * 100
                                        )
                                    }}></div>
                            </div>

                            <b className="text-sm text-green-700">
                                {formatCurrencyVND(c.current_fiat)} raised
                            </b>
                        </div>
                    ))}
                </div>

                {/* pagination */}
                {page < totalPage && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleShowMore}
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300">
                            Show more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchCampaign;
