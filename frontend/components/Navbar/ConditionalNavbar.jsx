// components/ConditionalNavbar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { useSelector } from 'react-redux';
import AdminNavbar from './AdminNavbar';

const ConditionalNavbar = () => {
    const userInfo = useSelector((state) => state.auth.userInfo);

 if (userInfo?.role === 'admin') return <AdminNavbar />;
  else if (userInfo?.role === 'farmer'||'contractor') return <Navbar />;
  else  return null; // or return a guest navbar if needed
};

export default ConditionalNavbar;
