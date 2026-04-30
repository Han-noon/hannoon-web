import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Category from '../components/Category';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-auto min-w-[1200px]">
      <div className="bg-[#f8f9fa] h-auto min-w-[1200px] pb-[267px] relative flex flex-col items-center">
        <Header />
        <Category />
        <main className="min-h-[1300px] w-full max-w-[1200px] flex-1 mt-80 mx-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
