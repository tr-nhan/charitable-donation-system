import React, { useState, useEffect } from 'react';
import {
  MedicalServices,
  ArrowForward,
  Fireplace,
  Tsunami,
  FavoriteBorder,
  School,
  WbTwilight,
  Pets,
  AddBusiness,
  SportsSoccer,
  Add,
  LocalFlorist,
  Public,
  Handshake
} from '@mui/icons-material';

function Categories() {
  const allCategories = [
    { icon: <MedicalServices />, name: 'Medical' },
    { icon: <Fireplace />, name: 'Memorial' },
    { icon: <Tsunami />, name: 'Emergency' },
    { icon: <FavoriteBorder />, name: 'Charity' },
    { icon: <School />, name: 'Education' },
    { icon: <WbTwilight />, name: 'Faith' },
    { icon: <Pets />, name: 'Animals' },
    { icon: <AddBusiness />, name: 'Business' },
    { icon: <SportsSoccer />, name: 'Sports' },
    { icon: <LocalFlorist />, name: 'Wedding' },
    { icon: <Public />, name: 'Environmental' },
    { icon: <Handshake />, name: 'General fundraising' }
  ];

  const [visibleCount, setVisibleCount] = useState(9);
  const [showMoreButton, setShowMoreButton] = useState(allCategories.length > 9);
  const [animatingItems, setAnimatingItems] = useState([]);

  const loadMoreCategories = () => {
    const newCount = Math.min(visibleCount + 3, allCategories.length);
    const newlyAddedIndices = Array.from({length: newCount - visibleCount}, (_, i) => visibleCount + i);
    
    setAnimatingItems(newlyAddedIndices);
    setVisibleCount(newCount);
    setShowMoreButton(newCount < allCategories.length);
  };

  useEffect(() => {
    if (animatingItems.length > 0) {
      const timer = setTimeout(() => {
        setAnimatingItems([]);
      }, 500); // Thời gian phù hợp với duration của animation
      
      return () => clearTimeout(timer);
    }
  }, [animatingItems]);

  const visibleCategories = allCategories.slice(0, visibleCount);

  return (
    <div className="relative pb-28">
      <section className="py-[8.6875rem] mb-0">
        <div className="md:max-w-[52rem] lg:max-w-[72rem] px-4 mx-auto">
          <div className="w-full max-w-[55.9375rem] mx-auto text-center mb-[2.375rem] 
          text-[clamp(1.25rem,1.25rem+.25*(100vw-23.4375rem)/66.5625,1.5rem)]">
            <h1 className="font-semibold mb-9 text-3xl">
              Fundraising categories on GoFundUIT
            </h1>
            <p>
              You can fundraise for almost anything on GoFundMe- Explore a few of the ways below. Looking for general tips and FAQs? Get information on
              <strong className="text-[clamp(1.25rem,1.25rem+.25*(100vw-23.4375rem)/66.5625,1.5rem)] underline">
                <a href="#"> how to start a GoFundUIT</a>
              </strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleCategories.map((category, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center justify-between bg-[#fbfaf8] rounded-2xl 
                pr-7 pl-5 py-5 border-[1px] border-transparent hover:border-[#6f6f6f] transition-all
                ${animatingItems.includes(index) ? 'animate-fadeIn' : ''}`}
              >
                <div className="flex justify-start items-center">
                  <span className="flex items-center justify-center w-20 h-20 mr-5">
                    {React.cloneElement(category.icon, { className: "w-full! h-auto!" })}
                  </span>
                  <span className="text-1 text-xl font-semibold">
                    {category.name}
                  </span>
                </div>
                <div className="w-6! h-6!">
                  <ArrowForward />
                </div>
              </a>
            ))}
          </div>
          {showMoreButton && (
            <div className="mt-14 text-center">
              <button
                onClick={loadMoreCategories}
                className="inline-flex items-center justify-center text-1 font-semibold 
                min-h-12 border-[1px] border-[#c0bdb8] rounded-xl px-6 py-2 hover:bg-[#2525250d] 
                hover:border-[#3e3e3e] cursor-pointer transition-all duration-200"
              >
                more categories
                <Add className="w-6! h-6! ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Categories;