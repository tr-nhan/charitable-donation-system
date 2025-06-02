import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Loading } from "../../components/UI";
import { getTransactionHistory } from "../../services/api/transactionApi";

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

function TransactionHistory() {
    const userId = useSelector((state) => state.auth.user.user_id);
    const [historyTransaction, setHistoryTransaction] = useState(null);

    useEffect(() => {
        const fetchInitState = async () => {
            const res = await getTransactionHistory(userId);
            if (res.error === 0) {
                setHistoryTransaction(res.results);
            }
        };
        fetchInitState();
    }, []);

    if (!historyTransaction) return <Loading />;

    return (
        <div className="p-6 sm:p-10 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Transaction History</h1>

            <Section
                title="Deposit History"
                subtitle="List of all your deposit transactions"
                columns={["Method", "Provider", "Amount", "Time"]}
                data={historyTransaction.historyDeposit}
                renderRow={(item) => [
                    item.method,
                    item.provider_name,
                    `${formatCurrencyVND(item.amount)}`,
                    new Date(item.created_at).toLocaleString()
                ]}
            />

            <Section
                title="Donation History"
                subtitle="List of all your donations"
                columns={["Campaign", "Amount", "Time"]}
                data={historyTransaction.historyDonation}
                renderRow={(item) => [
                    item.title || "N/A",
                    `${item.fiat_amount ? formatCurrencyVND(item.fiat_amount) : item.crypto_amount + ' ETH'}`,
                    new Date(item.created_at).toLocaleString()
                ]}
            />

            <Section
                title="Withdraw History"
                subtitle="List of all your withdrawal transactions"
                columns={["Method", "Info", "Amount", "Time"]}
                data={historyTransaction.historyWithdraw}
                renderRow={(item) => [
                    item.method,
                    item.method_info,
                    `${item.amount.toLocaleString()} VND`,
                    new Date(item.created_at).toLocaleString()
                ]}
            />
        </div>
    );
}

function Section({ title, subtitle, columns, data, renderRow }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-green-800">{title}</h2>
            <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-green-200">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-green-100 text-green-900">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="text-left px-4 py-3 font-medium border-b border-green-200">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr
                                key={idx}
                                className="even:bg-green-50 hover:bg-green-100 transition-colors">
                                {renderRow(item).map((cell, i) => (
                                    <td
                                        key={i}
                                        className="px-4 py-3 border-b border-green-100 text-gray-800">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TransactionHistory;
