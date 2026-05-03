import HomePage from '@/pages/HomePage.tsx';
import MyPage from '@/pages/MyPage';
import SignInPage from '@/pages/SignInPage';
import EventSummaryPage from '@/pages/event-summary/EventSummaryPage';
import { Route, Routes } from 'react-router-dom';
import TimelinePage from '@/pages/TimelinePage';
import AbusingPage from '@/pages/Abusing';
import Layout from '@/layout/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/event-detail" element={<EventSummaryPage />}></Route>
        <Route path="/timeline" element={<TimelinePage />}></Route>
        <Route path="/abusing" element={<AbusingPage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
