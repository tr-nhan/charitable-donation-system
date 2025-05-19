import "./custumStyle.css"

function Loading() {
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex h-full w-full items-center justify-center">
                <div className="flex gap-1 text-5xl font-bold text-green-950">
                    <span className="bounce-dot bounce-delay-0">.</span>
                    <span className="bounce-dot bounce-delay-1">.</span>
                    <span className="bounce-dot bounce-delay-2">.</span>
                </div>
            </div>
        </div>
    );
}

export default Loading;
