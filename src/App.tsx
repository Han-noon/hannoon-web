import HomePage from '@/pages/HomePage.tsx';
import MyPage from '@/pages/mypage/MyPage';
import SignInPage from '@/pages/SignInPage';
import EventSummaryPage from '@/pages/event-summary/EventSummaryPage';
import { Route, Routes } from 'react-router-dom';
import TimelinePage from '@/pages/TimelinePage';
import AbusingPage from '@/pages/Abusing';
import Layout from '@/layout/Layout';

import OneSignal from 'react-onesignal';
import { useEffect } from 'react';
import NotificationPage from '@/pages/NotificationPage';
import useOrientationSync from '@/hooks/useOrientationSync';

function App() {
  useOrientationSync();

  useEffect(() => {
    // OneSignal 초기화 함수
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true, // 기본 종 모양 구독 버튼 활성화
          } as any,
        });

        console.log('OneSignal 초기화 성공!');
      } catch (error) {
        console.error('OneSignal 초기화 실패:', error);
      }
    };

    // 배포환경에서만 실행
    if (import.meta.env.PROD) initOneSignal();
  }, []);

  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />}></Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/event-detail/:id" element={<EventSummaryPage />}></Route>
        <Route path="/timeline/:topic_id" element={<TimelinePage />}></Route>
        <Route path="/abusing/:id" element={<AbusingPage />}></Route>
      </Route>

      <Route path="/notification" element={<NotificationPage />} />
    </Routes>
  );
}

export default App;
