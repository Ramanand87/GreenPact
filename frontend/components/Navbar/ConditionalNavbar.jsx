// components/ConditionalNavbar.tsx
'use client';

import { useSelector } from 'react-redux';
import AdminNavbar from './AdminNavbar';
import { Navbar } from './Navbar';

const ConditionalNavbar = () => {
    const userInfo = useSelector((state) => state.auth.userInfo);

    if (userInfo?.role === 'admin') return <AdminNavbar />;
    else return <Navbar />; 
};

export default ConditionalNavbar;
