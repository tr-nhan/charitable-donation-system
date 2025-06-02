import Tips from "./Tips";
function RenderItems({ item }) {
    switch (item.type) {
        case "paragraph":
            return <p className="text-1 font-normal mb-4">{item.text}</p>;
        case "bullet":
            return (
                <div className="mb-2 ml-8">
                    <ul className="list-disc">
                        <li className="text-1 font-normal mb-2">
                            {item.text}
                            {item.children && (
                                <div>
                                    {item.children.map((child, index) => (
                                        <RenderItems key={index} item={child} />
                                    ))}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            );
        case "example":
            return (
                <div className="bg-[#f8f8f8] p-4 rounded-lg my-2 border-l-4 border-[#008044]">
                    <p className="text-[#6f6f6f] italic">{item.text}</p>
                </div>
            );
    }
}

function FundraisingTips() {
    return (
        <div>
            <section className="pt-20 pb-10">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
                    <div className="flex flex-col gap-8 max-w-3xl">
                        <div>
                            <p className="text-[#6f6f6f] text-[.875rem] font-medium">
                                Fundraising Tips
                            </p>
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold">
                                How To Have A Successful Fundraiser: 9 Tips to Spread the Word
                            </h1>
                        </div>
                        <div>
                            <p className="text-[#6f6f6f] font-normal mb-6">
                                Are you looking to raise money for an important cause? With these
                                top tips, you can reach your fundraising goals and make your
                                GoFundUIT fundraiser successful.
                            </p>
                            <p className="text-[#6f6f6f] font-normal mb-6">
                                This ultimate guide will help you spread the word about your
                                fundraising event through social media, email marketing, and local
                                media.
                            </p>
                            <p className="text-[#6f6f6f] font-normal">
                                Whether you’re hosting an online fundraising campaign or an
                                in-person event, GoFundUIT can help support your fundraising
                                efforts.
                            </p>
                        </div>
                        <div>
                            <a
                                href="/create-campaign"
                                className="inline-flex items-center justify-center rounded-xl px-6 py-2 font-bold 
                    cursor-pointer border border-[#0000] min-h-14 bg-[#008044] text-white hover:bg-[#015d32]">
                                Start a GoFundUIT
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mb-12">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl mb-10 font-semibold">
                            9 fundraising tips to promote your campaign
                        </h2>
                        <p className="mb-10">
                            To run an effective fundraising campaign, you need to get the word out.
                            You can have the most worthy cause in the world, but if no one knows
                            about it, you’ll never meet your fundraising goals.
                        </p>
                        <p className="mb-10">
                            We’ve pulled together nine tips to help you find potential donors to
                            support your fundraising efforts.
                        </p>
                    </div>
                </div>
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
                    {Tips.map((tip) => (
                        <div
                            key={tip.id}
                            className="border-b border-[#eaeaea] pb-10 last:border-b-0">
                            <h2 className="text-2xl font-semibold mb-6">
                                {tip.id}. {tip.title}
                            </h2>
                            <div className="space-y-4">
                                {tip.content.map((item, index) => (
                                    <RenderItems key={index} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
                    <div className="flex flex-col gap-8 max-w-3xl">
                        <div>
                            <h1 className="text-3xl font-semibold">
                                Create your fundraising campaign today
                            </h1>
                        </div>
                        <div>
                            <p className="text-1 font-normal mb-6">
                                Now that you’ve got the know-how, it’s time to set up your
                                fundraising campaign. GoFundUIT is the perfect, trusted fundraising
                                platform to launch your campaign.
                            </p>
                        </div>
                        <div>
                            <a
                                href="/create-campaign"
                                className="inline-flex items-center justify-center rounded-xl px-6 py-2 font-bold 
                    cursor-pointer border border-[#0000] min-h-14 bg-[#008044] text-white hover:bg-[#015d32]">
                                Start a GoFundUIT
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FundraisingTips;
