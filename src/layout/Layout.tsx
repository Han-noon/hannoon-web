import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Category from './components/Category';
import Footer from './components/Footer';

const Layout = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* <div className="bg-[#f8f9fa] pb-[267px] flex flex-col items-center"> */}
      <div className="pb-[267px] flex flex-col items-center">
        <Header />
        <Category />

        <main className="w-full max-w-[1200px] flex-1 mt-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
