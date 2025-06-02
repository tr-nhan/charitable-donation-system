import { FundraisingQuestions, DonationsQuestions } from "./Questions";
import { useState } from "react";

function CommonQuestionsPage() {
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };
    return (
        <div>
            <section className="bg-white">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 lg:pt-20 pb-8 flex flex-col md:flex-row gap-6 md:gap-9 justify-between items-start">
                    {/* Text Content */}
                    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 flex-1 order-2 md:order-1">
                        <div>
                            <h1 className="font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                                Questions about GoFundUIT
                            </h1>
                        </div>
                        <div>
                            <p className="text-[#6f6f6f] text-lg sm:text-xl md:text-2xl font-normal">
                                Learn more about fundraising, donating, or sharing on GoFundUIT.
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-4">
                            <a
                                href="/create-campaign"
                                className="flex items-center justify-center rounded-xl px-4 sm:px-6 py-2 sm:py-3 md:py-2 font-bold 
              cursor-pointer border border-[#0000] min-h-12 sm:min-h-14 bg-[#008044] text-white hover:bg-[#015d32]
              text-sm sm:text-base md:text-lg w-full sm:w-2xs"
                            >
                                Start a GoFundUIT
                            </a>
                        </div>
                    </div>

                    {/* Image */}
                    <picture className="w-full md:w-[40%] lg:w-[30%] order-2 mb-6 md:mb-0">
                        <img
                            src="https://videos.openai.com/vg-assets/assets%2Ftask_01jvpxn9hsfbxty019e96kvt6h%2F1747747328_img_3.webp?st=2025-06-02T08%3A13%3A43Z&se=2025-06-08T09%3A13%3A43Z&sks=b&skt=2025-06-02T08%3A13%3A43Z&ske=2025-06-08T09%3A13%3A43Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=1kAPXKuC9v5wa%2Bs5H48R4xsr2Ks%2BsMJiI3wZM5oGn2E%3D&az=oaivgprodscus"
                            alt="GoFundUIT illustration"
                            className="w-full max-h-[450px] mx-auto md:mx-0 rounded-2xl"
                        />
                    </picture>
                </div>
            </section>

            {/* Fundraising Questions Section */}
            <section className="bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12">
                            Questions about fundraising
                        </h2>
                        <div className="space-y-4">
                            {FundraisingQuestions && FundraisingQuestions.map((question) => (
                                <div key={question.id} className="border-b border-gray-200 mb-12 pb-6">
                                    <div
                                        className="group flex justify-between items-center cursor-pointer hover:text-[#008044]"
                                        onClick={() => toggleQuestion(question.id)}
                                    >
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 group-hover:text-[#008044]">
                                            {question.title}
                                        </h3>
                                        <span className={`transform transition-transform duration-300 text-4xl ${openQuestion === question.id ? 'rotate-45 text-[#008044]' : ''}`}>
                                            +
                                        </span>
                                    </div>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openQuestion === question.id ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="text-gray-600">
                                            {question.content.map((item, index) => (
                                                <p key={index} className="mb-4 last:mb-0">
                                                    {item.text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Donations Questions Section */}
            <section className="bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12">
                            Questions about donations
                        </h2>
                        <div className="space-y-4">
                            {DonationsQuestions && DonationsQuestions.map((question) => (
                                <div key={question.id} className="border-b border-gray-200 mb-12 pb-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleQuestion('d' + question.id)}
                                    >
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 hover:text-[#008044]">
                                            {question.title}
                                        </h3>
                                        <span className={`transform transition-transform duration-300 text-2xl ${openQuestion === 'd' + question.id ? 'rotate-45' : ''}`}>
                                            +
                                        </span>
                                    </div>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openQuestion === 'd' + question.id ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="text-gray-600">
                                            {question.content.map((item, index) => (
                                                <p key={index} className="mb-4 last:mb-0">
                                                    {item.text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Help Section */}
            <section className="bg-white mb-16">
                <div className="max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md">
                        <div className="md:basis-1/3 lg:basis-2/5 relative">
                            <img
                                src="https://media.istockphoto.com/id/1422164584/photo/help-needed-sign-held-up-by-man-against-blue-sky-background.jpg?s=612x612&w=0&k=20&c=iLpNdPgEgEjAyallQgv0RFpjpEj5jaBKMOkfr8W00z8="
                                alt="needhelp?"
                                className="w-full h-48 md:h-full"
                            />
                        </div>
                        <div className="md:basis-2/3 lg:basis-3/5 py-6 px-6 sm:py-8 sm:px-8 lg:py-10 lg:px-12">
                            <div className="max-w-[560px] mb-6 sm:mb-8 lg:mb-12">
                                <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-600">
                                    STILL NEED HELP?
                                </h3>
                                <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6 text-gray-800">
                                    We're here to support you
                                </h2>
                                <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
                                    You’re not alone — our team is here to assist you at every stage of your fundraiser.
                                </p>
                            </div>
                            <div className="flex justify-start">
                                <a
                                    href="/help-center"
                                    className="inline-flex justify-center items-center rounded-xl px-6 sm:px-8 font-bold py-3
              cursor-pointer border-2 border-[#02a95c] min-h-12 bg-transparent text-[#02a95c] 
              hover:bg-[#e6f6ef] hover:border-[#018a4c] transition-colors duration-200
              text-sm sm:text-base md:text-lg w-full sm:w-auto"
                                >
                                    Contact us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CommonQuestionsPage;