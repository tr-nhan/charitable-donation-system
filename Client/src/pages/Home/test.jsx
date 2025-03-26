import { useState, useRef, useEffect } from "react";
import { ArrowBack, ArrowForward, ArrowDropDown } from "@mui/icons-material";
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CampaignIcon from '@mui/icons-material/Campaign';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import bgImage from "../../assets/images/HomePage.jpg";

const contentPages = [
    {
        imgSrc: "https://images.gofundme.com/Zu81ES4E3QWY0BvD0nAlKp4pqmM=/720x405/https://d2g8igdw686xgo.cloudfront.net/89718395_1742790539450580_r.png", // Thay ảnh thực tế
        title: "Das Zaubereinmaleins braucht Deine Unterstützung!",
        progress: 65294,
        target: 100000,
        donaters: 101,
        donations: "65,294 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/p2aGDv0tS5I-ivJVWKQQB_A-XLo=/720x405/https://d2g8igdw686xgo.cloudfront.net/89469117_1741696270780805_r.png", // Thay ảnh thực tế
        title: "Frank’s 12-Year Battle Against Leukemia: Help Us Save Him",
        progress: 65294,
        target: 100000,
        donaters: 101,
        donations: "65,294 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/3MQJUSMTOdkfr_8m5S7Jki4mcbc=/720x405/https://d2g8igdw686xgo.cloudfront.net/89510435_1741736056757862_r.png",
        title: "A Life-Saving Bone Marrow Transplant for Levi",
        progress: 135675,
        target: 200000,
        donaters: 101,
        donations: "135,675 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/WO31wTmMZyJR81iwqiFCNOORWlE=/720x405/https://d2g8igdw686xgo.cloudfront.net/89554207_1741897135218499_r.png",
        title: "Connecticut Rescue: A Second Chance",
        progress: 183065,
        target: 250000,
        donaters: 101,
        donations: "183,065 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/K667se68PHmkhhzG09ITt34Lza4=/720x405/https://d2g8igdw686xgo.cloudfront.net/89615017_1742237300287980_r.jpeg",
        title: "Support for Victims of the Kochani Nightclub Fire",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/rF84AbSS7PIEYALIgkVV2Y7qjjo=/720x405/https://d2g8igdw686xgo.cloudfront.net/89790069_1742751582684593_r.png",
        title: "Junger Familienvater plötzlich aus dem Leben gerissen",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/HP9o8wGJUyDifQcbkEr9mkZCkSE=/720x405/https://d2g8igdw686xgo.cloudfront.net/89729483_1742499741817889_r.png",
        title: "Haskell Infrastructure Overhaul",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/4MBD8c1us6qdSezLrMWb6OYTpJE=/720x405/https://d2g8igdw686xgo.cloudfront.net/89730713_1742502786623603_r.png",
        title: "Steun Randa in de strijd tegen kanker",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/NOTvQNGIeMoG7W4ocagYwfzEPZI=/720x405/https://d2g8igdw686xgo.cloudfront.net/89766931_1742655741972037_r.png",
        title: "Help us bring our Mom - Maura Heffernan (nee O'Gorman) home",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    },
    {
        imgSrc: "https://images.gofundme.com/vADCUaTznkY-CRQGYhuEcNGg_Cg=/720x405/https://d2g8igdw686xgo.cloudfront.net/89786343_1742737560151077_r.png",
        title: "Unterstützung für die Familie von Ulrich Guse",
        progress: 112908,
        target: 150000,
        donaters: 101,
        donations: "112,908 $",
        link: "#"
    }
]

function HomePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("Actualité internationale");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const itemRefs = useRef([]);
    const mainItemRef = useRef(null);


    const toggleDropdown = () => setIsOpen(!isOpen);

    
    const mainItem = contentPages[currentIndex];
    const gridItems = contentPages.slice(currentIndex + 1, currentIndex + 5);
    
    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, gridItems.length);
    }, [gridItems]);

    const navigateSlide = (direction) => {
        if (isAnimating) return;

        setIsAnimating(true);

        // Animate out the main item
        if (mainItemRef.current) {
            mainItemRef.current.classList.add("slide-out");
        }

        // Animate out grid items with staggered delay
        itemRefs.current.forEach((item, index) => {
            setTimeout(() => {
                if (item) item.classList.add("slide-out");
            }, index * 100);
        });

        // Change data after animations complete
        setTimeout(() => {
            setCurrentIndex((prev) =>
                direction === "next"
                    ? (prev + 5) % contentPages.length
                    : (prev - 5 + contentPages.length) % contentPages.length
            );

            // Reset classes for new items
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

            // End animation
            setTimeout(() => {
                if (mainItemRef.current) {
                    mainItemRef.current.classList.remove("slide-in");
                }
                itemRefs.current.forEach((item) => {
                    if (item) item.classList.remove("slide-in");
                });
                setIsAnimating(false);
            }, 500);
        }, 500);
    };


    return (
        <div className="relative">
            <style jsx global>{`
        .slide-out {
          animation: slideOut 0.3s ease-in-out forwards;
        }
        .slide-in {
          animation: slideIn 0.3s ease-in-out forwards;
        }
        @keyframes slideOut {
            from {
                transform: translate3d(0, 0, 0);
                opacity: 1;
            }
            to {
                transform: translate3d(-100%, 0, 0);
                opacity: 0;
            }
        }

        @keyframes slideIn {
            from {
                transform: translate3d(100%, 0, 0);
                opacity: 0;
            }
            to {
                transform: translate3d(0, 0, 0);
                opacity: 1;
            }
        }
      `}</style>

            <section className="sticky top-0 h-[39rem] z-0 mb-10">
                <div className="absolute w-full h-full top-0 bg-no-repeat bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        maxHeight: '630px'
                    }}>
                    <div className="w-full fixed text-center top-1/5">
                        <h1 className="max-w-2xs mt-0 mb-6 ml-auto mr-auto text-center font-semibold text-xl text-(--text-color-2) animate-fadeIn select-none">
                            La référence en matière de financement participatif
                        </h1>
                        <h2 className="font-semibold text-6xl max-w-2xs text-center mt-0 mb-0 mr-auto ml-auto text-(--text-color-2) animate-fadeIn select-none">
                            Votre plateforme d'entraide
                        </h2>
                        <button style={{ fontSize: '16px' }}
                            className="font-semibold text-(--text-color-3) mt-12 px-6 py-2 bg-white rounded-xl min-h-14 animate-fadeIn select-none cursor-pointer hover:bg-[#fffc]">
                            Démarrer une cagnotte
                        </button>
                    </div>
                </div>
            </section>

            <div className="relative bg-white pt-10 rounded-t-4xl z-10 mt-[-5rem]">
                <div className="mt-0 mb-0 mx-auto pl-4 pr-4 max-w-[75%]">
                    <h2 className="mt-12 mb-10 mr-0 ml-0 font-bold text-2xl text-[#252525]">
                        Découvrez des cagnottes en lien avec vos centres d'intérêt
                    </h2>

                    <div className="bg-white block">
                        <div className="flex justify-between items-center relative">
                            <button onClick={toggleDropdown} className="inline-flex min-h-10 pt-1 pb-1 pl-6 pr-6 leading-4 text-center items-center justify-center rounded-3xl font-semibold text-(--text-color-1) border-[#c0bdb8] border text-base cursor-pointer hover:bg-[#2525250d]">
                                <p className="h-6 mt-1">{selectedItem}</p>
                                <ArrowDropDown className="my-auto ml-1 -mr-1" />
                            </button>
                            {isOpen && (
                                <div style={{ boxShadow: "0 2px 6px #0000001a" }} className="h-[476px] bg-white absolute top-12 w-sm rounded-xl overflow-y-scroll z-50">
                                    <div>
                                        <div className="overflow-y-scroll">
                                            <ul className="flex flex-col m-0 pt-4 pb-4 pl-2 pr-2">
                                                <li onClick={() => (setSelectedItem("Tout près du but"), setIsOpen(false))} className="flex rounded-[8px] p-4 items-center gap-5 hover:bg-[#fbfaf8] cursor-pointer">
                                                    <TrackChangesIcon className="bg-[#fbfaf8] text-1 rounded-full h-10! w-10! p-2" />
                                                    <div>
                                                        <div className="font-semibold text-1 text-base">Tout près du but</div>
                                                        <div className="text-[#6f6f6f] text-[14px]">Cagnottes à 5 % de leur objectif</div>
                                                    </div>
                                                </li>
                                                <li onClick={() => (setSelectedItem("Lancement récent"), setIsOpen(false))} className="flex rounded-[8px] p-4 items-center gap-5 hover:bg-[#fbfaf8] cursor-pointer">
                                                    <CampaignIcon className="bg-[#fbfaf8] text-1 rounded-full h-10! w-10! p-2" />
                                                    <div>
                                                        <div className="font-semibold text-1 text-base">Lancement récent</div>
                                                        <div className="text-[#6f6f6f] text-[14px]">Cagnottes créées ces deux derniers jours</div>
                                                    </div>
                                                </li>
                                                <li onClick={() => (setSelectedItem("Besoin de dynamique"), setIsOpen(false))} className="flex rounded-[8px] p-4 items-center gap-5 hover:bg-[#fbfaf8] cursor-pointer">
                                                    <ElectricBoltIcon className="bg-[#fbfaf8] text-1 rounded-full h-10! w-10! p-2" />
                                                    <div>
                                                        <div className="font-semibold text-1 text-base">Besoin de dynamique</div>
                                                        <div className="text-[#6f6f6f] text-[14px]">Cagnottes qui ont besoin d'un petit coup de pouce</div>
                                                    </div>
                                                </li>
                                                <li onClick={() => (setSelectedItem("Actualité internationale"), setIsOpen(false))} className="flex rounded-[8px] p-4 items-center gap-5 hover:bg-[#fbfaf8] cursor-pointer">
                                                    <TrendingUpIcon className="bg-[#fbfaf8] text-1 rounded-full h-10! w-10! p-2" />
                                                    <div>
                                                        <div className="font-semibold text-1 text-base">Actualité internationale</div>
                                                        <div className="text-[#6f6f6f] text-[14px]">Cagnottes enregistrant un taux élevé de mobilisation des donateurs</div>
                                                    </div>
                                                </li>
                                                <li onClick={() => (setSelectedItem("Associations caritatives"), setIsOpen(false))} className="flex rounded-[8px] p-4 items-center gap-5 hover:bg-[#fbfaf8] cursor-pointer">
                                                    <VolunteerActivismIcon className="bg-[#fbfaf8] text-1 rounded-full h-10! w-10! p-2" />
                                                    <div>
                                                        <div className="font-semibold text-1 text-base">Associations caritatives</div>
                                                        <div className="text-[#6f6f6f] text-[14px]">Cagnottes au profit d'associations populaires</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="hidden md:flex">
                                <button onClick={() => navigateSlide('prev')} className="w-8 h-8 bg-[#0000] border border-[#c0bdb8] text-1 rounded-4xl justify-center items-center cursor-pointer inline-flex hover:bg-[#2525250d] mr-2">
                                    <ArrowBack />
                                </button>
                                <button onClick={() => navigateSlide('next')} className="w-8 h-8 bg-[#0000] border border-[#c0bdb8] text-1 rounded-4xl justify-center items-center cursor-pointer inline-flex hover:bg-[#2525250d]">
                                    <ArrowForward />
                                </button>
                            </div>
                        </div>

                        <div>
                            <ul className="grid grid-cols-2 mt-4 mb-4 -mr-2 -ml-2 p-0 gap-4">
                                <li ref={mainItemRef} className="item">
                                    <a href={mainItem.link}>
                                        <div className="text-1 bg-[#0000] max-h-[36rem] max-w-[36rem] w-full rounded-xl p-2 group transition-normal duration-300 transition-all" >
                                            <div className="relative rounded-xl min-h-40 overflow-hidden h-[27.5rem]">
                                                <img src={mainItem.imgSrc} alt={mainItem.title} className="absolute max-w-full h-full object-cover group-hover:scale-105 transition-all transition-normal duration-500 ease-in-out" />
                                                <span className="absolute inline-flex items-center rounded-xl bottom-3 text-white text-[.875rem] font-normal h-6 left-3 py-0 px-2 bg-[#00000080]">
                                                    {mainItem.donaters} dons
                                                </span>
                                            </div>
                                            <div className="py-5 px-3 flex flex-col justify-around text-1">
                                                <div className="h-[2.6rem] leading-[1.3] font-bold text-base text-1">{mainItem.title}</div>
                                                <div className="flex flex-col text-1">
                                                    <progress value={mainItem.progress} max={mainItem.target} className="mt-6 bg-[#e5e1d7] w-full h-2 appearance-none text-[#008044] block rounded-full overflow-hidden" />
                                                    <label className="block text-sm text-1 leading-[1.5] font-bold mt-1">
                                                        {mainItem.progress.toLocaleString()} € de dons récoltés
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </li>

                                <li className="w-full list-none">
                                    <ul className="grid content-start grid-cols-2 p-0 gap-0.5">
                                        {gridItems.map((item, index) => (
                                            <li key={`grid-item-${index}`} ref={(el) => (itemRefs.current[index] = el)} className="w-full list-none item">
                                                <a href={item.link} className="cursor-pointer">
                                                    <div className="text-1 bg-[#0000] h-[17.9375rem] max-w-[17.8125rem] w-full px-2 pt-2 pb-5 group transition-normal duration-300 transition-all">
                                                        <div className="relative min-h-[9.25rem] rounded-xl overflow-hidden">
                                                            <img src={item.imgSrc} alt={item.title} className="w-full object-cover group-hover:scale-110 transition-transform transition-normal duration-500 ease-in-out" />
                                                            <span className="absolute inline-flex items-center rounded-xl bottom-3 text-white text-[.875rem] font-normal h-6 left-3 py-0 px-2 bg-[#00000080]">
                                                                {item.donaters} dons
                                                            </span>
                                                        </div>
                                                        <div className="py-5 px-3 flex flex-col justify-around text-1">
                                                            <div className="h-[2.6rem] leading-[1.3] font-bold text-base text-1">{item.title}</div>
                                                            <div className="flex flex-col text-1">
                                                                <progress value={item.progress} max={item.target} className="mt-6 bg-[#e5e1d7] w-full h-2 appearance-none block rounded-full overflow-hidden" />
                                                                <label className="block text-sm text-1 leading-[1.5] font-bold mt-1">
                                                                    {item.progress.toLocaleString()} € de dons récoltés
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
        </div>
    );
}

export default HomePage;