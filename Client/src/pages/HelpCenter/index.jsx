import React, { useState } from 'react';

function HelpCenter() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Please enter your email');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/send-tips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Tips email sent successfully! Check your inbox.');
                setEmail('');
            } else {
                setMessage(data.message || 'Failed to send email');
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <div className="py-16 font-serif">
                <h1 className="text-5xl text-center text-1 bold">
                    <span className="border-b-2 border-gray-300 pb-2">How can we help?</span>
                </h1>
            </div>
            <div className="mx-auto p-4 md:p-6 max-w-[1120px]">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="md:row-span-2">
                            <div className="bg-[#012D19] text-white rounded-2xl p-6 md:p-12 h-full flex flex-col">
                                <h3 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
                                    Reach your goal
                                </h3>
                                <p className="pb-6 leading-relaxed">
                                    Find tips and resources to help you organize an effective fundraiser!
                                </p>
                                <div className="mt-auto">
                                    <a
                                        href="/create-campaign"
                                        className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold 
              cursor-pointer border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#012D19]
              transition-colors duration-200"
                                    >
                                        Start a GoFundUIT
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Cột 2 - Form */}
                        <div>
                            <div className="rounded-2xl p-6 md:p-12 bg-[#F5F1ED] h-full">
                                <h3 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
                                    Do you want fundraiser tips?
                                </h3>
                                <p className="pb-6 leading-relaxed">
                                    Here are some simple and effective tips to help you run your fundraiser.
                                </p>
                                <form
                                    id="email-form"
                                    className="flex flex-col sm:flex-row gap-4"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-grow rounded-xl p-3 md:p-4 border border-gray-300 bg-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-6 py-3 md:py-4 cursor-pointer rounded-2xl text-white font-semibold 
              ${isLoading ? 'bg-gray-400' : 'bg-[#012D19] hover:bg-[#034a2a]'} 
              transition-colors duration-200 min-w-[120px]`}
                                    >
                                        {isLoading ? 'Sending...' : 'Sign up'}
                                    </button>
                                </form>
                                {message && (
                                    <p className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Cột 3 */}
                        <div>
                            <div className="rounded-2xl p-6 md:p-12 bg-[#F0FCE9] h-full">
                                <h3 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
                                    Ready to start your fundraiser?
                                </h3>
                                <p className="pb-6 leading-relaxed">
                                    Start your fundraising journey today. Just a few simple steps, and you'll be ready to start accepting donations.
                                </p>
                                <a
                                    href="/create-campaign"
                                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold 
            cursor-pointer border-2 border-[#012D19] bg-transparent text-[#012D19] hover:bg-[#012D19] hover:text-white
            transition-colors duration-200"
                                >
                                    Start a GoFundUIT
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                
            </div>                    
        </div>
    )
}

export default HelpCenter;