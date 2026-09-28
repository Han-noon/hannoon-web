//import naverLogo from '@/assets/naver_icon.svg';
import { signInWithOAuth } from '@/api/auth/signInWithOAuth';
import googleLogo from '@/assets/google_icon.svg';
import { useLocation } from 'react-router-dom';

const SignInPage = () => {
  const { pathname } = useLocation();
  const isOAuthEnabled = pathname === '/signin12';

  return (
    <div className="bg-[#f8f9fa] h-screen flex justify-center items-center">
      <div className="p-8 border border-gray-300 rounded-xl shadow-md bg-white text-center w-[500px]">
        <h1 className="text-lg pb-4 border-b border-gray-300">
          <span className="text-xl font-bold text-gray47">한눈</span>에 오신 것을 환영합니다.
        </h1>
        <div className="py-5">
          {/* <button className="bg-[#06BE34] w-full h-12 flex justify-center items-center mb-2 rounded-md">
            <div>
              <img src={naverLogo} alt="네이버" width={48} />
            </div>
            <p className="font-bold text-white">네이버로 계속하기</p>
          </button> */}
          <button
            onClick={signInWithOAuth}
            disabled={!isOAuthEnabled}
            className={`bg-[#F7F7F7] h-12 w-full flex justify-center items-center rounded-md ${
              isOAuthEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
          >
            <div className="mr-2">
              <img src={googleLogo} alt="구글" width={36} />
            </div>
            <p className="font-bold text-gray47">구글로 계속하기</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
