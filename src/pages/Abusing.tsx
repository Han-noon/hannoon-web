import { useState, useEffect } from 'react';
import { getAbusingArticlesByEvent } from '@/api/article/getAbusingArticlesByEvent';
import { useParams } from 'react-router-dom';
import type { AbusingArticleItem, AbusingType } from '@/api/article/getAbusingArticlesByEvent';

const CATEGORIES: { id: AbusingType | 'all'; title: string; description?: string }[] = [
  { id: 'all', title: '전체' },
  {
    id: 'title_content_mismatch',
    title: '공백기사',
    description:
      '뉴스 가치가 없거나 내용이 거의 없는 기사를 반복 전송하여 검색 결과를 독점하는 기사입니다.',
  },
  {
    id: 'content_context_mismatch',
    title: '본문 주제연속성\n불일치',
    description: '본문의 주제가 일관되지 않거나 맥락 없이 내용이 이어지는 기사입니다.',
  },
];

//const EVENT_ID = 1; // 임시: event_id = 1
const PAGE_SIZE = 4;

export default function Abusing() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState<AbusingType | 'all'>('all');
  const [articles, setArticles] = useState<AbusingArticleItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAbusingArticlesByEvent({
          eventId: Number(id),
          abusingType: activeCategory === 'all' ? undefined : activeCategory,
          page: 1,
          size: PAGE_SIZE,
        });
        setArticles(data.articles);
        setTotalCount(data.total_count);
      } catch (err) {
        console.error(err);
        setError('기사를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]);

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.title.replace('\n', ' ') ?? '';

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 md:py-12 md:px-6 font-sans text-gray-900 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8">
        <header className="flex flex-col gap-3 md:gap-5">
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
              어뷰징 기사
            </h1>
            <div className="flex-1 h-px bg-[#d9d9d9] hidden md:block mb-2"></div>
          </div>
          <div className="w-full pl-0 md:pl-1">
            <p className="text-[#555] text-sm md:text-[14px] leading-relaxed break-keep">
              동일한 뉴스 가치를 지닌 기사를 재편집하여 반복 전송함으로써 검색 포털의 뉴스 결과를
              독점하고, 독자에게 피로감을 주는 뉴스 유통 방식 (공백 및 불일치 기사 포함)
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
          <aside className="bg-white rounded-xl border border-[#e5e7eb] p-4 md:p-6 lg:p-8 shadow-sm lg:sticky lg:top-6 overflow-hidden lg:overflow-visible">
            <ul className="flex flex-row overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 lg:flex-col lg:gap-8 lg:relative lg:border-l-2 lg:border-[#f0f0f0] lg:ml-3 lg:py-2 scrollbar-hide">
              {CATEGORIES.map((item) => {
                const isActive = activeCategory === item.id;
                return (
                  <li
                    key={item.id}
                    onClick={() => setActiveCategory(item.id)}
                    className={`flex-shrink-0 lg:relative lg:pl-8 cursor-pointer group transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-60 lg:opacity-40 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`hidden lg:block absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-[3px] border-white ring-1 ring-[#e5e7eb] transition-colors duration-300 ${
                        isActive ? 'bg-[#474747]' : 'bg-[#d9d9d9] group-hover:bg-gray-400'
                      }`}
                    ></span>
                    <h2
                      className={`text-sm md:text-base lg:text-[20px] font-bold leading-tight transition-colors duration-200 
                        px-4 py-2 rounded-full border lg:border-none lg:px-0 lg:py-0 lg:rounded-none lg:mb-2 whitespace-nowrap lg:whitespace-pre-line
                        ${
                          isActive
                            ? 'bg-[#474747] text-white border-[#474747] lg:bg-transparent lg:text-gray-900'
                            : 'bg-gray-50 text-gray-600 border-gray-200 lg:bg-transparent lg:text-gray-600'
                        }
                      `}
                    >
                      <span className="lg:hidden">{item.title.replace('\n', ' ')}</span>
                      <span className="hidden lg:block">{item.title}</span>
                    </h2>
                    <div className="hidden lg:block">
                      {item.description ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-[13px] text-gray-500 leading-relaxed word-break-keep">
                            {item.description}
                          </p>
                          <div className="h-[100px]" aria-hidden="true"></div>
                        </div>
                      ) : (
                        <div className="h-[150px]" aria-hidden="true"></div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-6 lg:p-8 shadow-sm flex flex-col min-h-[400px] lg:min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 md:mb-8 gap-2 sm:gap-0">
              <h2 className="text-base md:text-lg font-semibold text-gray-700">
                {activeCategoryLabel} 목록
              </h2>
              <p className="text-sm md:text-[16px] text-gray-500">
                탐지된 기사{' '}
                <span className="text-xl md:text-[28px] text-gray-800 font-bold ml-1">
                  {isLoading ? '-' : `${totalCount}건`}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-8 md:gap-10">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[200px] md:h-[300px] text-gray-400">
                  <p className="text-sm md:text-lg">불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-[200px] md:h-[300px] text-red-400">
                  <p className="text-sm md:text-lg">{error}</p>
                </div>
              ) : articles.length > 0 ? (
                articles.map((article, index) => (
                  <a
                    key={`${article.link ?? index}`}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col md:flex-row gap-4 md:gap-6 border-b border-gray-100 pb-8 md:pb-10 last:border-0 last:pb-0 animate-fade-in group"
                  >
                    <div className="flex-shrink-0 relative overflow-hidden rounded w-full md:w-[240px] bg-gray-100">
                      {article.article_image_url ? (
                        <img
                          src={article.article_image_url}
                          alt="기사 썸네일"
                          className="w-full h-[200px] md:h-[160px] object-cover shadow-sm transition-all duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-[200px] md:h-[160px] bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                          이미지 없음
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <p className="text-xs md:text-[13px] text-gray-500">
                          {article.publisher} |{' '}
                          {new Date(article.published_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-none">
                        {article.title}
                      </h3>
                      <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed text-justify line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] md:h-[300px] text-gray-400">
                  <p className="text-sm md:text-lg">해당 카테고리에 탐지된 기사가 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
