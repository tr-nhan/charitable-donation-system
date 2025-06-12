import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CampaignDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call (thay thế bằng API thật nếu có)
    setTimeout(() => {
      setCampaign({
        id,
        title: "Frank’s 12-Year Battle Against Leukemia: Help Us Save Him",
        image: "https://images.gofundme.com/p2aGDv0tS5I-ivJVWKQQB_A-XLo=/720x405/https://d2g8igdw686xgo.cloudfront.net/89469117_1741696270780805_r.png", // Thay bằng ảnh thực tế
        raised: 507053,
        goal: 530000,
        donations: 6700,
        recentDonors: [
          { name: "Tamara Hogg", amount: 20, type: "Recent donation" },
          { name: "BOBABOBA MORLEY", amount: 5513, type: "Top donation" },
          { name: "Laura Suizu", amount: 500, type: "First donation" },
        ],
      });
      setLoading(false);
    }, 1000); // Giả lập thời gian tải
  }, [id]);

  if (loading) {
    return <p className="text-center text-xl mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">{campaign.title}</h1>
        <img
          src={campaign.image}
          alt="Campaign"
          className="w-full h-auto rounded-lg mb-4"
        />
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl font-semibold">${campaign.raised.toLocaleString()} AUD raised</p>
            <p className="text-gray-600">${campaign.goal.toLocaleString()} goal • {campaign.donations.toLocaleString()} donations</p>
          </div>
          <div className="w-16 h-16 flex items-center justify-center border-4 border-green-500 rounded-full">
            <span className="text-lg font-bold">
              {Math.round((campaign.raised / campaign.goal) * 100)}%
            </span>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded w-full">
            Share
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full">
            Donate now
          </button>
        </div>
        <p className="text-gray-600 text-center mb-4">{campaign.donations.toLocaleString()} people just donated</p>
        <div className="border-t pt-4">
          {campaign.recentDonors.map((donor, index) => (
            <p key={index}>
              <strong>{donor.name}</strong> - ${donor.amount.toLocaleString()} 
              <span className="text-gray-500"> • {donor.type}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
