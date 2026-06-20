import HomePage from '@/pages/HomePage.tsx';
import MyPage from '@/pages/mypage/MyPage';
import SignInPage from '@/pages/SignInPage';
import EventSummaryPage from '@/pages/event-summary/EventSummaryPage';
import { Route, Routes } from 'react-router-dom';
import TimelinePage from '@/pages/TimelinePage';
import AbusingPage from '@/pages/Abusing';
import Layout from '@/layout/Layout';

import OneSignal from 'react-onesignal';
import { useEffect, useState } from 'react';
import NotificationPage from '@/pages/NotificationPage';
import useOrientationSync from '@/hooks/useOrientationSync';
import TimelineListPage from '@/pages/TimelineListPage';
import useOneSignalAuth from '@/hooks/useOneSignalAuth';

function App() {
  const [oneSignalReady, setOneSignalReady] = useState(false);

  useOrientationSync();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false } as any,
        });

        //console.log('OneSignal 초기화 성공!');
        setOneSignalReady(true);
      } catch (error) {
        console.error(error);
      }
    };

    initOneSignal();
  }, []);

  useOneSignalAuth(oneSignalReady);

  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />}></Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<TimelineListPage />} />
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
