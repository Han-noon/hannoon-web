import React, { useState, useRef, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import ThemeCard from '@/components/ThemeCard';

interface ThemeItem {
  id: number;
  category: string;
  title: string;
  summary: string;
  firstReportDate: string;
  latestReportDate: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[340px] rounded-[14px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="pt-9 pb-7 px-7 text-center">
          <h2 className="text-[15px] font-bold text-black mb-2.5 tracking-tight">{title}</h2>
          <p className="text-[12px] text-gray-400 leading-relaxed font-light break-keep whitespace-pre-wrap px-1">
            {message}
          </p>
        </div>
        <div className="flex border-t border-gray-50 h-[44px]">
          <button
            onClick={onClose}
            className="flex-1 text-[13px] text-gray-300 font-medium hover:bg-gray-50"
          >
            취소
          </button>
          <div className="w-[1px] bg-gray-50" />
          <button
            onClick={onConfirm}
            className="flex-1 text-[13px] text-black font-bold hover:bg-gray-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scrapped' | 'recent'>('scrapped');
  const [bookmarkedThemeIds, setBookmarkedThemeIds] = useState<number[]>([1, 2, 3]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('userProfileImage')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 스크랩한 주제
  const THEME_DATA: ThemeItem[] = [
    {
      id: 1,
      category: '정치',
      title: '의료개혁 로드맵',
      summary:
        '정부는 지역 필수의료 붕괴를 막기 위해 의과대학 정원 확대와 더불어 지역인재 전형 비율을 대폭 강화하는 세부안을 발표했습니다. 보건복지부는 이를 위해 지역 보건의료 개편안을 마련하여 추진 중이며, 거점 국립대 중심의 의료 네트워크를 구축하여 단계별 인력 확충을 가동하고 있습니다.',
      firstReportDate: '2026.10.10',
      latestReportDate: '2026.10.30',
    },
    {
      id: 2,
      category: '경제',
      title: '통화 정책 방향',
      summary:
        '한국은행 금융통화위원회는 최근 가계부채 급증과 부동산 시장의 불확실성이 지속됨에 따라 기준금리를 현 수준에서 유지하기로 만장일치 결정했습니다. 위원회는 향후 물가 추이와 미 연준의 금리 결정을 면밀히 주시할 예정이며, 시장의 변동성에 대비하여 유동성 공급 정책을 유연하게 운영할 방침입니다.',
      firstReportDate: '2026.09.15',
      latestReportDate: '2026.10.28',
    },
    {
      id: 3,
      category: '사회',
      title: '스마트 모빌리티',
      summary:
        '도시 교통 혼잡을 해소하기 위한 자율주행 셔틀 서비스가 시범 운영 기간을 마치고 정식 노선 도입 단계에 접어들었습니다. 지자체는 통합 교통 시스템과의 연동을 통해 시민들의 이동 편의성을 높일 계획이며, 안전 규제 샌드박스를 활용하여 차세대 퍼스널 모빌리티 보급 사업을 전국 단위로 확장할 예정입니다.',
      firstReportDate: '2026.08.20',
      latestReportDate: '2026.10.25',
    },
  ];

  // 최근 본 사건 데이터
  const RECENT_NEWS_DATA = [
    {
      id: 101,
      themeName: '의료개혁',
      title: '의대 정원 배정 위원회 공식 출범',
      summary:
        '정부와 대학 관계자가 참여하는 정원 배정 위원회가 첫 회의를 가졌습니다. 대학별 수용 역량 조사를 기반으로 공정한 배정 기준을 마련할 방침입니다.',
      date: '2026.10.30',
      isBookmarked: true,
    },
    {
      id: 102,
      themeName: '통화 정책',
      title: '금통위, 긴축 기조 유지 시사',
      summary:
        '이창용 총재는 기자간담회에서 물가 안정 목표치 도달 전까지는 긴축적인 통화 정책 기조를 상당 기간 유지하는 것이 적절하다고 강조했습니다.',
      date: '2026.10.29',
      isBookmarked: false,
    },
    {
      id: 103,
      themeName: '모빌리티',
      title: '자율주행 4단계 안전 기준 확정',
      summary:
        '국토교통부는 완전 자율주행에 가까운 레벨 4 단계의 안전 기준을 최종 확정하고, 사고 발생 시 책임 소재를 명확히 하는 법적 근거를 마련했습니다.',
      date: '2026.10.27',
      isBookmarked: true,
    },
  ];

  const handleBookmarkToggle = (id: number) => {
    setBookmarkedThemeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem('userProfileImage', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="max-w-[880px] mx-auto px-6 pt-10">
        {/* 프로필 */}
        <section className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center bg-white border border-gray-200 rounded-full px-2.5 py-1.5 shadow-lg space-x-2 z-10">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-black transition-colors p-0.5"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                <div className="w-[1px] h-2.5 bg-gray-100"></div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-gray-300 hover:text-black transition-colors p-0.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div>
              <h2 className="text-[28px] font-bold text-black mb-1 leading-none">공오삼</h2>
              <p className="text-gray-400 font-light text-[14px]">test053@gmail.com</p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-[#F3F3F4] rounded-[12px] w-[100px] h-[85px] flex flex-col items-center justify-center">
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
                스크랩한 토픽
              </p>
              <p className="text-[34px] font-bold text-black leading-none">
                {bookmarkedThemeIds.length}
              </p>
            </div>
          </div>
        </section>

        {/* 탭/내비게이션 */}
        <div className="flex items-end justify-between mb-10 border-b border-gray-300">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('scrapped')}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'scrapped' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              스크랩한 사건
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`text-[14px] pb-1 transition-all ${activeTab === 'recent' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-300 font-normal hover:text-gray-500'}`}
            >
              최근 본 사건
            </button>
          </div>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="group flex items-center space-x-1.5 text-[12px] text-gray-300 hover:text-black transition-all pb-1 border-b border-transparent hover:border-black"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>탈퇴하기</span>
          </button>
        </div>

        {/* 그리드 영역 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 min-h-[300px] items-start">
          {activeTab === 'scrapped'
            ? THEME_DATA.filter((t) => bookmarkedThemeIds.includes(t.id)).map((theme) => (
                <ThemeCard
                  key={theme.id}
                  {...theme}
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            : RECENT_NEWS_DATA.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  category={news.themeName}
                  title={news.title}
                  summary={news.summary}
                  date={news.date}
                  isBookmarked={news.isBookmarked}
                  onBookmarkToggle={() => {}}
                />
              ))}
        </div>
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />

        {/* 모달 멘트 */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            setProfileImage(null);
            localStorage.removeItem('userProfileImage');
            setIsDeleteModalOpen(false);
          }}
          title="프로필 이미지 초기화"
          message={`현재 설정된 이미지를 삭제하시겠습니까? 삭제 후에는 기본 프로필로 변경됩니다.`}
          confirmText="삭제하기"
        />
        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirm={() => setIsWithdrawModalOpen(false)}
          title="계정 탈퇴 확인"
          message={`정말 탈퇴하시겠습니까? 탈퇴 시 스크랩한 모든 기사와 활동 기록이 즉시 삭제되며 이는 복구가 불가능합니다.`}
          confirmText="탈퇴하기"
        />
      </div>
    </div>
  );
};

export default MyPage;
