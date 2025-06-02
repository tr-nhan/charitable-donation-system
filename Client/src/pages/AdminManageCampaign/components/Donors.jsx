const formatCurrencyVND = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "0 VND";
    return (
        new Intl.NumberFormat("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        }).format(parsed) + " VND"
    );
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

function Donors({ donations }) {
    const { total_count, total_fiat, total_crypto } = donations.stats;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All the donations</h1>

            {/* Stats Summary */}
            <div className="bg-white rounded-xl shadow p-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Donation Stats</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>
                        <span className="font-medium">Total donations:</span> {total_count}
                    </li>
                    <li>
                        <span className="font-medium">Total fiat:</span>{" "}
                        {formatCurrencyVND(total_fiat)}
                    </li>
                    <li>
                        <span className="font-medium">Total crypto:</span>{" "}
                        {Number(total_crypto).toFixed(3)} ETH
                    </li>
                </ul>
            </div>

            {/* Donor List */}
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 italic">
                    Donors
                </h2>
                <hr className="mb-4 border-[#e0ddd6]" />

                {donations.data.length === 0 ? (
                    <h3 className="text-md font-medium text-center text-gray-500 italic">
                        This campaign does not have any donations yet.
                    </h3>
                ) : (
                    <div className="space-y-6">
                        {donations.data.map((donor, i) => (
                            <div key={i} className="space-y-2">
                                {/* Donor Summary Line */}
                                <div className="flex flex-wrap items-center gap-2 text-gray-800 text-sm sm:text-base">
                                    <span className="font-semibold italic">
                                        {donor.is_anonymous ? (
                                            <span className="text-gray-500">Anonymous</span>
                                        ) : (
                                            donor.donor_name
                                        )}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-medium text-blue-600">
                                        {donor.fiat_amount === 0
                                            ? `${Number(donor.crypto_amount).toFixed(3)} ETH`
                                            : formatCurrencyVND(donor.fiat_amount)}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500 text-xs">
                                        {formatDate(donor.created_at)}
                                    </span>
                                </div>

                                {/* Donor Message */}
                                {donor.donation_message && (
                                    <p className="text-sm italic text-gray-600 pl-1">
                                        “{donor.donation_message}”
                                    </p>
                                )}

                                {/* Divider */}
                                {i < donations.data.length - 1 && (
                                    <hr className="mt-4 border-t border-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Donors;
