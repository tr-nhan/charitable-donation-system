import { Outlet } from "react-router-dom";

import "./Style/BaseLayout.css";
import Header from './Header'
import Footer from './Footer'

function Layout() {
    return (
        <div className="layout-container">
            <Header />
            <main className="mt-[56px] md:mt-[80px]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
