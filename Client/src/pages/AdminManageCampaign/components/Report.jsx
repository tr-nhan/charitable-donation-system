function Report({ reports }) {
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All the reports</h1>

            {reports.count === 0 ? (
                <p className="text-gray-500 italic">No reports available.</p>
            ) : (
                <div className="space-y-6">
                    {reports.data.map((report, index) => (
                        <div
                            key={report.id}
                            className="bg-white shadow rounded-xl p-4 border border-gray-100">
                            {/* Report Text */}
                            <p className="text-gray-800 text-base mb-2">
                                <span className="font-semibold">Report #{index + 1}:</span>{" "}
                                {report.report_text}
                            </p>

                            {/* Reporter Info */}
                            <p className="text-sm text-gray-500 mb-2">
                                <span className="font-medium">Reporter ID:</span>{" "}
                                {report.reporter_id}
                            </p>

                            {/* Campaign ID (optional) */}
                            <p className="text-sm text-gray-400 mb-2">
                                <span className="font-medium">Campaign ID:</span>{" "}
                                {report.campaign_id}
                            </p>

                            {/* Date */}
                            <p className="text-sm text-gray-500 mb-4">
                                <span className="font-medium">Created at:</span>{" "}
                                {formatDate(report.created_at)}
                            </p>

                            {/* Images */}
                            {report.report_images && (
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {report.report_images.split(",").map((imgUrl, i) => (
                                        <a
                                            href={imgUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            key={i}
                                            className="w-24 h-24 rounded-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                                            <img
                                                src={imgUrl}
                                                alt={`report-image-${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Report;
