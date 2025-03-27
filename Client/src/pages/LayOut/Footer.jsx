import { Facebook, Instagram, KeyboardArrowDown, Mic, YouTube } from "@mui/icons-material";
import { useState } from "react";
import franceIcon from "../../assets/icons/france.svg"
import { FaXTwitter } from "react-icons/fa6";


function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    function handleOpen() {
        setIsOpen(!isOpen);
    }
    return (
        <footer className="w-full mt-auto bg-white pt-12 pb-12 border-t border-gray-300 relative">
            <div className="container mx-auto px-4 pb-12 max-w-7xl relative">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Support Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">Je soutiens</h3>
                        <ul className="space-y-2">
                            <li className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                <a href="#" className="text-lg text-1">
                                    Catégories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Fundraising Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">Collecter des fonds</h3>
                        <ul className="space-y-2">
                            {[
                                'Comment démarrer une cagnotte',
                                'Collecte de fonds en équipe',
                                'Blog sur la collecte de fonds'
                            ].map((item) => (
                                <li key={item} className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                    <a href="#" className="text-lg text-1">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold ml-2 mb-1 text-xl text-1">À propos de</h3>
                        <ul className="space-y-2">
                            {[
                                'Garantie des dons GoFundMe',
                                'Pays couverts',
                                'Tarifs',
                                "Centre d'assistance",
                                'À propos de GoFundMe',
                                'Centre de presse',
                                'Emplois'
                            ].map((item) => (
                                <li key={item} className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                    <a href="#" className="text-lg text-1">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-4">
                        <img
                            src="https://www.gofundme.com/nextassets/shared/logo-ifp.png"
                            alt="GoFundMe"
                            className="h-16 w-16 object-contain"
                        />
                        <p className="text-gray-600 text-base">
                            GoFundMe Ireland Limited est immatriculée à l'ORIAS en tant qu'Intermédiaire
                            en Financement Participatif (IFP) sous le numéro d'immatriculation 24000751.
                        </p>
                    </div>
                </div>
                <div className="grid">
                    <button onClick={handleOpen} className="flex px-2 py-1 font-semibold text-1 text-lg hover:bg-gray-50 cursor-pointer w-fit rounded-2xl ">
                        Plus de ressources
                        <KeyboardArrowDown className={`ml-2 w-8! h-8!  ${isOpen ? 'animate-spinACircle' : 'animate-spinReverse'}`} />
                    </button>
                    <ul className={`${isOpen ? 'grid animate-fadeIn' : 'hidden'} transition-all duration-300 ease-in-out overflow-hidden 
                space-y-2 grid-cols-1 lg:grid-flow-col lg:grid-cols-4 lg:grid-rows-[repeat(4,auto)] gap-x-8`}>
                        {[
                            'Conseils pour collecter des fonds',
                            'Idées de collecte de fonds',
                            'Aide pour payer le loyer',
                            'Sites de collecte de fonds',
                            'Qu\'est-ce que le financement participatif ?',
                            'Pourquoi GoFundMe',
                            'Questions fréquentes',
                            'Témoignages',
                            'Aide pour payer des factures',
                            'Aide pour régler des frais médicaux',
                            'Idées de cagnottes scolaires',
                            'Comment demander un chien d\'assistance',
                            'Sites de financement participatif'
                        ].map((item) => (
                            <li key={item} className="hover:bg-gray-50 cursor-pointer transition-colors rounded-xl p-2 m-0">
                                <a href="#" className="text-lg text-1">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"
                    style={{ left: '50%', transform: 'translateX(-50%)', width: '100vw' }}></div>

            </div>
            <div className="container mx-auto px-4 pb-12 max-w-7xl relative">
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 py-12 mx-2">
                    <div>
                        <button className="flex items-center justify-center text-[16px] border rounded-xl p-2 min-h-8 border-[#c0bdb8]">
                            <img src={franceIcon} alt="france icon" className="w-4 h-4 mr-2" />
                            France
                            <span className="mx-2 mb-1 -mt-1">.</span>
                            Français
                        </button>
                    </div>
                    <div className="flex items-center md:justify-end">
                        <a href="" className="w-12! h-12! inline-flex items-center justify-center rounded-full cursor-pointer bg-[#0000] hover:bg-gray-100">
                            <Facebook className="text-3xl!" />
                        </a>
                        <a href="" className="w-12! h-12! inline-flex items-center justify-center rounded-full cursor-pointer bg-[#0000] hover:bg-gray-100">
                            <YouTube className="text-3xl!" />
                        </a>
                        <a href="" className="w-12! h-12! inline-flex items-center justify-center rounded-full cursor-pointer bg-[#0000] hover:bg-gray-100">
                            <FaXTwitter className="text-3xl!" />
                        </a>
                        <a href="" className="w-12! h-12! inline-flex items-center justify-center rounded-full cursor-pointer bg-[#0000] hover:bg-gray-100">
                            <Instagram className="text-3xl!" />
                        </a>
                        <a href="" className="w-12! h-12! inline-flex items-center justify-center rounded-full cursor-pointer bg-[#0000] hover:bg-gray-100">
                            <Mic className="text-3xl!" />
                        </a>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center flex-wrap -ml-2">
                        <span class="text-[#6f6f6f] mx-2">
                            © 2010-2025 GoFundUIT
                        </span>
                        <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">Conditions</a>
                        <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">Avis de confidentialité</a>
                        <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors">Fins juridiques</a>
                        <a href="#" className="my-0 mr-2 px-2 py-1 cursor-pointer text-lg text-1 hover:bg-gray-100 rounded-xl transition-colors flex items-center md:justify-center">
                            Vos choix en matière de confidentialité
                            <img src="https://www.gofundme.com/nextassets/shared/privacy-pill.png" alt="#" className="w-[29px] h-[14px] ml-2 mt-1"/>    
                        </a>
                    </div>
                    <div className="flex md:justify-end">
                        <a href="#" className="bg-[url(https://d25oniaj7o2jcw.cloudfront.net/img-play-store-fr.png)] h-[2.125rem] w-[7.3125rem] bg-no-repeat bg-cover mr-2"></a>
                        <a href="#" className="bg-[url(https://d25oniaj7o2jcw.cloudfront.net/img-app-store-fr-v2.png)] h-[2.125rem] w-[7.3125rem] bg-no-repeat bg-cover "></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;