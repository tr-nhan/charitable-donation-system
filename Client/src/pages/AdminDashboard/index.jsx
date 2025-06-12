import { useState } from "react";

import { WithdrawRequest, ReportManage, Dashboard } from "./components";

const OPTIONS = [
    {
        label: "Dashboard",
        value: "dashboard",
        component: () => <Dashboard />
    },
    {
        label: "Withdraw Request",
        value: "withdraw_request",
        component: () => <WithdrawRequest />
    },
    {
        label: "Report Campaigns",
        value: "report_campaigns",
        component: () => <ReportManage />
    }
];

function AdminDashboard() {
    const [active, setActive] = useState("dashboard");
    const current = OPTIONS.find((item) => item.value === active);

    return (
        <div className="w-full py-10 px-2 md:px-20 flex flex-col md:flex-row items-start gap-5">
            {/* Buttons container */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setActive(option.value)}
                        className={`px-4 py-3 rounded cursor-pointer text-lg font-semibold ${
                            active === option.value ? "bg-green-800 text-white" : "bg-gray-200"
                        }`}>
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Vertical Divider */}
            <div className="ml-5 mr-10 hidden md:block w-px self-stretch bg-[#e0ddd6]" />

            {/* Element display */}
            <div className="flex-1 w-full">{current?.component()}</div>
        </div>
    );
}

export default AdminDashboard;
