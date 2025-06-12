import { useNavigate } from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div className="py-20 w-full bg-[#f7eedf] flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-7xl font-bold text-green-950">We couldn’t find that page.</h1>
            <h2 className="mt-8 text-2xl text-green-800 italic">
                But we can still find hope, together.
            </h2>
            <p className="mt-6 text-md text-gray-700 max-w-xl">
                The page you’re looking for doesn’t exist. But your journey to bring positive change
                is still alive. Let’s guide you home.
            </p>
            <button
                className="mt-10 py-2 px-6 bg-green-800 hover:bg-green-900 text-white rounded-full transition-all duration-200"
                onClick={() => navigate("/")}>
                Return to Home
            </button>
        </div>
    );
}

export default PageNotFound;
