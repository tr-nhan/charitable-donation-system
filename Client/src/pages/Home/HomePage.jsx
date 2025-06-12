import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward, ArrowDropDown } from "@mui/icons-material";
import bgImage from "../../assets/images/HomePage.jpg";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./index.css";

function HomePage({ contentPages }) {
    const navigate = useNavigate();

    // States
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const [showButton, setShowButton] = useState(false);

    // Refs
    const itemRefs = useRef([]);
    const mainItemRef = useRef(null);
    const sectionRefs = useRef([]);

    // Scroll button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 630);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Intersection observer cho các section
    useEffect(() => {
        sectionRefs.current = sectionRefs.current.slice(0, 2);
        const observer = new IntersectionObserver(
            (entries) => {
                const newVisibleSections = {};
                entries.forEach((entry) => {
                    newVisibleSections[entry.target.dataset.index] = entry.isIntersecting;
                });
                setVisibleSections((prev) => ({ ...prev, ...newVisibleSections }));
            },
            { threshold: 0.3 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    // Slide logic
    const mainItem = contentPages[currentIndex];
    const gridItems = contentPages.slice(currentIndex + 1, currentIndex + 5);

    useEffect(() => {
        if (!contentPages) return;
        const gridItems = contentPages.slice(currentIndex + 1, currentIndex + 5);
        itemRefs.current = itemRefs.current.slice(0, gridItems.length);
    }, [contentPages, currentIndex]);
    if (!contentPages) return <Loading />;

    const navigateSlide = (direction) => {
        if (isAnimating) return;

        setIsAnimating(true);

        // Animate out main item
        if (mainItemRef.current) {
            mainItemRef.current.classList.add("slide-out");
        }

        // Animate out grid items
        itemRefs.current.forEach((item, index) => {
            setTimeout(() => {
                if (item) item.classList.add("slide-out");
            }, index * 30);
        });

        // Đổi dữ liệu sau khi animation kết thúc
        setTimeout(() => {
            setCurrentIndex((prev) =>
                direction === "next"
                    ? (prev + 5) % contentPages.length
                    : (prev - 5 + contentPages.length) % contentPages.length
            );

            // Reset animation
            if (mainItemRef.current) {
                mainItemRef.current.classList.remove("slide-out");
                mainItemRef.current.classList.add("slide-in");
            }

            itemRefs.current.forEach((item) => {
                if (item) {
                    item.classList.remove("slide-out");
                    item.classList.add("slide-in");
                }
            });

            // Kết thúc animation
            setTimeout(() => {
                if (mainItemRef.current) {
                    mainItemRef.current.classList.remove("slide-in");
                }
                itemRefs.current.forEach((item) => {
                    if (item) item.classList.remove("slide-in");
                });
                setIsAnimating(false);
            }, 300);
        }, 300);
    };

    return (
        <div className="relative bg-white flex flex-col min-h-[calc(100vh-56px)]">
            <section className="relative w-full h-[40rem] sm:h-[48rem] md:h-[56rem] md:mb-16 mb-10 overflow-x-hidden">
                <div
                    className="fixed top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        height: "100vh",
                        maxHeight: "630px",
                        width: "100vw"
                    }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h1 className="max-w-2xs mt-0 mb-6 font-semibold text-xl text-[var(--text-color-2)] animate-fadeIn select-none">
                            The benchmark in crowdfunding
                        </h1>
                        <h2 className="max-w-2xs font-semibold text-6xl mt-0 mb-0 text-[var(--text-color-2)] animate-fadeIn select-none">
                            Charity platform
                        </h2>
                        <button
                            onClick={() => navigate("/create-campaign")}
                            className="font-semibold text-[var(--text-color-3)] mt-12 px-6 py-2 bg-white rounded-xl min-h-14 animate-fadeIn select-none cursor-pointer hover:bg-[#ffffffcc] transition-colors">
                            Start a fundraiser
                        </button>
                    </div>
                </div>
            </section>

            <div className="relative pb-10 bg-white pt-10 rounded-t-4xl z-10 mt-[-5rem] w-full">
                <div className="mt-0 mb-0 mx-auto pl-4 pr-4 max-w-[75%]">
                    <h2 className="mt-12 mb-10 mr-0 ml-0 font-bold text-2xl text-[#252525]">
                        Discover fundraisers related to your interests
                    </h2>

                    <div className="bg-white block">
                        <div className="flex flex-row justify-end items-center relative">
                            <div className="mr-4 mb-5 hidden lg:flex">
                                <button
                                    onClick={() => navigateSlide("prev")}
                                    className="w-8 h-8 bg-[#0000] border border-[#c0bdb8] text-1 rounded-4xl justify-center items-center cursor-pointer inline-flex hover:bg-[#2525250d] mr-2">
                                    <ArrowBack />
                                </button>
                                <button
                                    onClick={() => navigateSlide("next")}
                                    className="w-8 h-8 bg-[#0000] border border-[#c0bdb8] text-1 rounded-4xl justify-center items-center cursor-pointer inline-flex hover:bg-[#2525250d]">
                                    <ArrowForward />
                                </button>
                            </div>
                        </div>

                        <div>
                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                                <li ref={mainItemRef} className="item hidden sm:block">
                                    <a href={mainItem.link}>
                                        <div className="text-1 bg-[#0000] max-h-[36rem] max-w-[36rem] w-full rounded-xl p-2 group transition-normal duration-300 transition-all">
                                            <div className="relative rounded-xl min-h-40 overflow-hidden h-[27.5rem]">
                                                <img
                                                    src={mainItem.imgSrc}
                                                    alt={mainItem.title}
                                                    className="absolute max-w-full h-full object-cover group-hover:scale-105 transition-all transition-normal duration-500 ease-in-out"
                                                />
                                            </div>
                                            <div className="py-5 px-3 flex flex-col justify-around text-1">
                                                <div className="h-[2.6rem] leading-[1.3] font-bold text-base text-1">
                                                    {mainItem.title}
                                                </div>
                                                <div className="flex flex-col text-1">
                                                    <progress
                                                        value={mainItem.progress}
                                                        max={mainItem.target}
                                                        className="mt-6 bg-[#e5e1d7] w-full h-2 appearance-none text-[#008044] block rounded-full overflow-hidden"
                                                    />
                                                    <label className="block text-sm text-1 leading-[1.5] font-bold mt-1">
                                                        {mainItem.progress.toLocaleString()} of
                                                        donations collected
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>

                                <li className="w-full list-none">
                                    <ul className="grid content-start grid-cols-1 md:grid-cols-2 gap-2">
                                        {gridItems.map((item, index) => (
                                            <li
                                                key={`grid-item-${index}`}
                                                ref={(el) => (itemRefs.current[index] = el)}
                                                className="list-none hover:bg-[#cecea633] rounded-xl transition-all">
                                                <a href={item.link} className="block w-full">
                                                    <div className="bg-transparent px-3 pt-3 pb-6 group transition-all duration-300">
                                                        {/* Image Wrapper with Fixed Aspect Ratio */}
                                                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                                                            <img
                                                                src={item.imgSrc}
                                                                alt={item.title}
                                                                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                                            />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="py-5 px-2 flex flex-col justify-around">
                                                            <h3 className="h-[2.6rem] font-bold text-base leading-tight text-ellipsis overflow-hidden whitespace-normal line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                            <div className="flex flex-col mt-4">
                                                                <progress
                                                                    value={item.progress}
                                                                    max={item.target}
                                                                    className="w-full h-2 bg-[#e5e1d7] appearance-none rounded-full overflow-hidden"
                                                                />
                                                                <label className="text-sm font-semibold mt-1">
                                                                    {item.progress.toLocaleString()}{" "}
                                                                    of donations raised
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-white py-16 w-full relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <header className="mb-12">
                        <h2 className="text-3xl font-semibold text-gray-900">Trending topics</h2>
                    </header>

                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 cursor-pointer"
                        onClick={() => navigate(contentPages[0].link)}>
                        <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                            <a className="block h-full">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={contentPages[0].imgSrc}
                                        alt="Union Island"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-3 text-xl font-bold">
                                        {contentPages[0].title}
                                    </h3>
                                    <div
                                        className="mb-6 text-gray-600 max-h-[6rem] overflow-hidden"
                                        dangerouslySetInnerHTML={{
                                            __html: contentPages[0].description
                                        }}
                                    />
                                    <div className="flex items-center text-1 font-semibold">
                                        <span>I support</span>
                                        <ArrowForward className="ml-2" />
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div
                            className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(contentPages[1].link)}>
                            <a href="#" className="block h-full">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={contentPages[1].imgSrc}
                                        alt="Union Island"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-3 text-xl font-bold">
                                        {contentPages[1].title}
                                    </h3>
                                    <div
                                        className="mb-6 text-gray-600 max-h-[6rem] overflow-hidden"
                                        dangerouslySetInnerHTML={{
                                            __html: contentPages[1].description
                                        }}
                                    />
                                    <div className="flex items-center text-1 font-semibold">
                                        <span>Learn more</span>
                                        <ArrowForward className="ml-2" />
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-white w-full relative">
                <section
                    ref={(el) => (sectionRefs.current[0] = el)}
                    data-index="section1"
                    className={`relative bg-[#f0fce9] w-full py-20 z-10 pt-[72px] transition-all duration-500 ${
                        visibleSections["section1"] ? "scale-100" : "scale-95 rounded-4xl"
                    }`}>
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="max-w-xs md:max-w-2xl lg:max-w-4xl mx-auto">
                            <h2
                                style={{
                                    fontSize:
                                        "clamp(32px, 1.25rem + 0.25 * (100vw - 23.4375rem) / 66.5625, 1.5rem)"
                                }}
                                className="font-bold mb-10 text-gray-900 max-w-[46rem]">
                                Fundraising on GoFundMe is user-friendly, efficient, and secure.
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                <p
                                    style={{
                                        fontSize:
                                            "clamp(1.25rem, 1.25rem + 0.25 * (100vw - 23.4375rem) / 66.5625, 1.5rem)"
                                    }}>
                                    ChatGPT said: Charity Proj gives you the means to successfully
                                    raise the funds you need for yourself, your friends, your
                                    family, or a charity. With its fee-free start-up for organizers,
                                    Charity Proj is the reference for...
                                    <a href="#" className="text-1 underline ml-1">
                                        ...around the world for crowdfunding.
                                    </a>{" "}
                                    around the world for the{" "}
                                    <a href="#" className="text-1 underline">
                                        health
                                    </a>{" "}
                                    (Emergencies) and the{" "}
                                    <a href="#" className="text-1 underline">
                                        non-profit organizations
                                    </a>
                                    You can ask your questions here at any time if you need help.
                                </p>
                                <p
                                    style={{
                                        fontSize:
                                            "clamp(1.25rem, 1.25rem + 0.25 * (100vw - 23.4375rem) / 66.5625, 1.5rem)"
                                    }}
                                    className="mb-4 mt-8">
                                    Do you have others{" "}
                                    <a href="#" className="text-1 underline">
                                        questions
                                    </a>{" "}
                                    ?Learn more about{" "}
                                    <a href="#" className="text-1 underline">
                                        how Charity Proj works
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="relative bg-white w-full py-20">
                <div className="container mx-auto max-w-[48rem] lg:max-w-[64rem] xl:max-w-[72rem] px-4">
                    <header className="flex justify-between items-center w-full mb-6">
                        <h2 className="text-2xl font-semibold">How does Charity Proj work?</h2>
                        <a
                            href="/fundraising-tips"
                            className="text-base font-semibold border border-gray-300 rounded-xl py-1 px-4 h-fit min-h-[32px]">
                            Learn more
                        </a>
                    </header>

                    <div className="relative">
                        <picture>
                            <source
                                media="(max-width: 22.5rem)"
                                srcSet="https://d25oniaj7o2jcw.cloudfront.net/homepage-refresh-how-it-works-video-still-m-7-23.jpg"
                            />
                            <source
                                media="(min-width: 22.6rem)"
                                srcSet="https://d25oniaj7o2jcw.cloudfront.net/homepage-refresh-how-it-works-video-still-d-7-23.jpg"
                            />
                            <img
                                alt=""
                                className="video_image__NT0b7 w-full rounded-lg"
                                loading="lazy"
                                src="https://d25oniaj7o2jcw.cloudfront.net/homepage-refresh-how-it-works-video-still-m-7-23.jpg"
                            />
                        </picture>

                        <button
                            className="absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:bg-transparent px-6 py-2 rounded-xl cursor-pointer font-bold text-base text-center border-none min-h-[3rem] flex items-center"
                            onClick={() => setIsPlaying(true)}>
                            <PlayArrowIcon className="mr-1" />
                            Watch the video (1 min).
                        </button>
                    </div>
                </div>

                {isPlaying && (
                    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsPlaying(false)}></div>
                        <div className="relative w-full max-w-4xl mx-auto z-10">
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                <iframe
                                    className="w-full h-[315px] md:h-[500px] lg:h-[600px] rounded-lg shadow-xl"
                                    src={`https://www.youtube.com/embed/Dn_0Vji7j5s?autoplay=1&rel=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onClick={(e) => e.stopPropagation()}></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="relative bg-white w-full">
                <section
                    ref={(el) => (sectionRefs.current[1] = el)}
                    data-index="section2"
                    className={`relative bg-[#012d19] w-full py-20 z-10 pt-[72px] transition-all duration-500 ${
                        visibleSections["section2"] ? "scale-100" : "scale-95 rounded-4xl"
                    }`}>
                    <div className="container mx-auto px-4 max-w-xs md:max-w-2xl lg:max-w-4xl">
                        <div className="max-w-4xl mx-auto h-[36rem] flex items-start justify-center flex-col">
                            <h2 className="font-bold mb-10 text-white max-w-[46rem] text-2xl lg:text-4xl">
                                You are not at risk.
                            </h2>
                            <div className="space-y-4 text-white font-bold">
                                <span className="text-2xl lg:text-4xl leading-[1.4]">
                                    Charity Proj is a reliable leader in online fundraising. With
                                    <a href="#" className="text-white underline ml-1">
                                        simple fees
                                    </a>{" "}
                                    and the team of
                                    <a href="#" className="text-white underline">
                                        {" "}
                                        trust and security
                                    </a>{" "}
                                    and its experts, you can raise money or
                                </span>
                                <span className="text-2xl lg:text-4xl mb-4 mt-8">
                                    make a donation with peace of mind.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="relative bg-white w-full pt-10">
                <section className="pt-8 flex items-center justify-center bg-white">
                    <div className="w-7xl mt-0 my-auto px-4 pb-[10.5rem] max-w-[20rem] xl:max-w-[80rem] lg:max-w-[56rem] md:max-w-[40rem] sm:max-w-[36rem]">
                        <h2 className="font-semibold text-2xl">
                            Raise funds for whoever you want.
                        </h2>
                        <ul>
                            <li
                                className="border-b border-[#ccc] pt-12 pb-8"
                                onClick={() => navigate("/balance")}>
                                <a href="/balance">
                                    <div className="flex items-center justify-between text-1 font-semibold text-4xl group sm:text-2xl md:text-3xl  lg:text-4xl">
                                        <h3>You</h3>
                                        <ArrowForwardIosIcon className="text-white text-center border border-[#ccc] pl-[10px] bg-black w-9! h-9! p-2 rounded-full group-hover:text-1 group-hover:bg-white" />
                                    </div>
                                    <p className="pt-6 mb-4 text-[#6f6f6f] text-xl">
                                        The funds are deposited into your bank account for your
                                        personal use.
                                    </p>
                                </a>
                            </li>
                            <li
                                className="border-b border-[#ccc] pt-12 pb-8"
                                onCick={() => navigate("/create-campaign")}>
                                <a href="/create-campaign">
                                    <div className="flex items-center justify-between text-1 font-semibold text-4xl group sm:text-2xl md:text-3xl  lg:text-4xl">
                                        <h3>Associations</h3>
                                        <ArrowForwardIosIcon className="text-white text-center border border-[#ccc] pl-[10px] bg-black w-9! h-9! p-2 rounded-full group-hover:text-1 group-hover:bg-white" />
                                    </div>
                                    <p className="pt-6 mb-4 text-[#6f6f6f] text-xl">
                                        The funds are given to the non-profit organization of your
                                        choice.{" "}
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
            {showButton && (
                <div className="block lg:hidden fixed z-[99] bg-white w-full! p-4! bottom-0 animate-fadeIn h-20">
                    <a
                        href="/create-campaign"
                        className="flex h-12 bg-[#008044] text-white font-bold text-lg rounded-[1.5625rem] py-[.6875rem] px-[1rem] items-center justify-center shadow hover:bg-[#015d32] transition-colors">
                        Start a fundraiser.
                    </a>
                </div>
            )}
        </div>
    );
}

export default HomePage;
