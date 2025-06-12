import { Facebook, Instagram, KeyboardArrowDown, Mail, Mic, Phone, YouTube } from "@mui/icons-material";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    function handleOpen() {
        setIsOpen(!isOpen);
    }
    return (
        <footer className="w-full mt-auto bg-white pt-12 pb-12 border-t border-gray-300 relative overflow-x-hidden">
            <div className="container mx-auto px-4 pb-12 max-w-7xl relative">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Support Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">My Support</h3>
                        <ul className="space-y-2">
                            <li className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                <a href="/categories" className="text-lg text-1">
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Fundraising Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">
                            Fundraise
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { title: "How to start a GoFundUIT", slug: "how-to-start" },
                                { title: "Fundraising categories", slug: "categories" },
                                { title: "Fundraising Blog", slug: "fundraising-blog" },
                                { title: "Charity fundraising", slug: "charity-fundraising" }
                            ].map((item) => (
                                <li key={item.slug} className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                    <a href={`/${item.slug}`} className="text-lg text-1">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">About</h3>
                        <ul className="space-y-2">
                            {[
                                { title: "GoFundUIT Donation Guarantee", slug: "donation-guarantee" },
                                { title: "Countries Covered", slug: "countries-covered" },
                                { title: "Help Center", slug: "help-center" },
                                { title: "About GoFundUIT", slug: "about" },
                                { title: "Press Center", slug: "press" }
                            ].map((item) => (
                                <li
                                    key={item.slug}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0"
                                >
                                    <a href={`/${item.slug}`} className="text-lg text-1">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-4">
                        <img
                            src="https://courses.uit.edu.vn/pluginfile.php/1/core_admin/logocompact/300x300/1748450794/Logo_UIT_Web-218x261.png"
                            alt="GoFundUIT"
                            className="h-16 w-16 object-contain"
                        />
                        <p className="text-gray-600 text-base">
                            GoFundUIT
                        </p>
                    </div>
                </div>
                <div className="grid">
                    <button
                        onClick={handleOpen}
                        className="flex px-2 py-1 font-semibold text-1 text-lg hover:bg-gray-50 cursor-pointer w-fit rounded-2xl ">
                        More resources
                        <KeyboardArrowDown
                            className={`ml-2 w-8! h-8!  ${isOpen ? "animate-spinACircle" : "animate-spinReverse"}`}
                        />
                    </button>
                    <ul className={`${isOpen ? "grid animate-fadeIn" : "hidden"} transition-all duration-300 ease-in-out overflow-hidden 
    space-y-2 grid-cols-1 lg:grid-flow-col lg:grid-cols-4 lg:grid-rows-[repeat(4,auto)] gap-x-8`}>
                        {[
                            "Fundraising Tips",
                            "Fundraising ideas",
                            "Fundraising sites",
                            "Rent assistance",
                            "Team fundraising ideas",
                            "What is crowdfunding?",
                            "Why GoFundUIT",
                            "Common questions",
                            "Success stories",
                            "School fundraising ideas",
                            "Help for veterans"
                        ].map((item) => {
                            const createSlug = (text) => {
                                return text
                                    .toLowerCase()
                                    .replace(/[^\w\s-]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/--+/g, '-');
                            };

                            const slug = createSlug(item);

                            return (
                                <li
                                    key={item}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                    <a href={`/${slug}`} className="text-lg text-1">
                                        {item}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"
                    style={{ left: "50%", transform: "translateX(-50%)", width: "100vw" }}></div>
            </div>
            <div className="container mx-auto px-4 pb-12 max-w-7xl relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12 mx-2">
                    <div>
                        <button className="flex items-center cursor-pointer justify-center text-[16px] 
            border rounded-xl p-2 min-h-8 border-[#c0bdb8] hover:bg-[#eee]">
                            English
                            <span className="mx-2 mb-1 -mt-1">.</span>
                            english
                        </button>
                        <div className="flex flex-col md:flex-row md:items-center flex-wrap -ml-2">
                            <span className="text-[#6f6f6f] mx-2">©2025 GoFundUIT</span>
                            <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">
                                Conditions
                            </a>
                            <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">
                                Privacy Notice
                            </a>
                            <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">
                                Legal
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center">
                            <span>Khu phố 6, P.Linh Trung, Tp.Thủ Đức, Tp.Hồ Chí Minh.</span>
                            <MapPin className="text-xl ml-2" />
                        </div>
                        <div className="flex items-center">
                            <a href="mailto:support@gofunduit.com" className="hover:underline">support@gofunduit.com</a>
                            <Mail className="text-xl ml-2" />
                        </div>
                        <div className="flex items-center">
                            <a href="tel:+0909090909" className="hover:underline">+84 0909090909</a>
                            <Phone className="text-xl ml-2" />
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;