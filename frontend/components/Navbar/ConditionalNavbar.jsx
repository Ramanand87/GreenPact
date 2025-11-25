// components/ConditionalNavbar.tsx
'use client';

import { useSelector } from 'react-redux';
import AdminNavbar from './AdminNavbar';
import { Navbar } from './Navbar';

const ConditionalNavbar = () => {
    const userInfo = useSelector((state) => state.auth.userInfo);

    if (userInfo?.role === 'admin') return <AdminNavbar />;
    else if (userInfo?.role === 'farmer' || userInfo?.role === 'contractor') return <Navbar />;
    else return null; // or return a guest navbar if needed
};

export default ConditionalNavbar;
