import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownTwoTone";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

const REACTIONS_TYPE = [
    {
        type: "heart",
        component: FavoriteTwoToneIcon,
        color: "red"
    },
    {
        type: "thumb_up",
        component: ThumbUpAltTwoToneIcon,
        color: "blue"
    },
    {
        type: "thumb_down",
        component: ThumbDownTwoToneIcon,
        color: "orange"
    },
    {
        type: "smile",
        component: SentimentVerySatisfiedTwoToneIcon,
        color: "green"
    }
];

function ReactionStats({ stats }) {
    const hasReaction = stats?.total_reaction > 0;

    return (
        <div className="w-full mb-8 px-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 italic mb-2">
                Reactions
            </h2>
            <hr className="mb-4 border-[#e0ddd6]" />
            <div className="flex justify-center items-center">
                {hasReaction ? (
                    <div className="flex flex-wrap justify-center gap-4">
                        {REACTIONS_TYPE.map((r) => {
                            const Icon = r.component;
                            const count = stats[`number_of_${r.type}`];
                            return (
                                <div key={r.type} className="flex items-center gap-1">
                                    <Icon style={{ color: r.color }} />
                                    <span className="text-sm font-medium text-gray-600 underline">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-sm font-medium text-gray-500 italic">No reactions yet</div>
                )}
            </div>
        </div>
    );
}

function ImageGallery({ images }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full px-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 italic mb-2">Images</h2>
            <hr className="mb-4 border-[#e0ddd6]" />
            <div className="flex overflow-x-auto gap-5 py-3 w-full">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="w-[100px] h-[100px] rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                        <img
                            src={img}
                            alt={`Campaign Image ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReactionImages({ reactions, images }) {
    return (
        <div className="max-w-3xl mx-auto py-8 px-2 sm:px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Reactions and Images</h1>
            <ReactionStats stats={reactions.stats} />
            <ImageGallery images={images} />
        </div>
    );
}

export default ReactionImages;
