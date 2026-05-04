import naverLogo from '@/assets/naver_icon.svg';
import googleLogo from '@/assets/google_icon.svg';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  return (
    <div className="bg-[#f8f9fa] h-screen flex justify-center items-center">
      <div className="p-8 border border-gray-300 rounded-xl shadow-md bg-white text-center w-[500px]">
        <h1 className="text-lg pb-4 border-b border-gray-300">
          <span className="text-xl font-bold text-gray47">한눈</span>에 오신 것을 환영합니다.
        </h1>
        <div className="py-5 border-b border-gray-300">
          <button className="bg-[#06BE34] w-full h-12 flex justify-center items-center mb-2 rounded-md">
            <div>
              <img src={naverLogo} alt="네이버" width={48} />
            </div>
            <p className="font-bold text-white">네이버로 계속하기</p>
          </button>
          <button className="bg-[#F7F7F7] h-12 w-full flex justify-center items-center rounded-md">
            <div className="mr-2">
              <img src={googleLogo} alt="구글" width={36} />
            </div>
            <p className="font-bold text-gray47">구글로 계속하기</p>
          </button>
        </div>
        <Link to="/">
          <button className="w-full text-center px-2 py-3  mt-4 border border-gray-300 rounded-md hover:bg-gray-300">
            로그인 없이 서비스 계속 이용하기
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
