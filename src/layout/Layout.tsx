import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Category from '../components/Category';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center w-full overflow-x-auto">
      <div className="bg-[#f8f9fa] w-[1440px] relative shadow-xl shrink-0">
        <Header />
        <Category />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
