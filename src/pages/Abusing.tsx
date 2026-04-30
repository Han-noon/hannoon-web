import React, { useState } from 'react';
import { categories, mockArticles, type Article } from '../data/AbusingData';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredArticles: Article[] =
    activeCategory === 'all'
      ? mockArticles
      : mockArticles.filter((article) => article.type === activeCategory);

  return (
    <div className="min-h-screen bg-[#f4f5f7] py-12 px-6 font-sans text-gray-900 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <h1 className="text-4xl font-bold whitespace-nowrap tracking-tight text-[#1a1a1a]">
              어뷰징 기사
            </h1>
            <div className="flex-1 h-px bg-[#d9d9d9] hidden md:block mb-2"></div>
          </div>

          <div className="w-full pl-1 overflow-hidden">
            <p className="text-[#555] text-[14px] truncate whitespace-nowrap">
              동일한 뉴스 가치를 지닌 기사를 재편집하여 반복 전송함으로써 검색 포털의 뉴스 결과를
              독점하고, 독자에게 피로감을 주는 뉴스 유통 방식 (공백 및 불일치 기사 포함)
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
          <aside className="bg-white rounded-xl border border-[#e5e7eb] p-6 lg:p-8 shadow-sm sticky top-6">
            <ul className="relative border-l-2 border-[#f0f0f0] ml-3 py-2 flex flex-col gap-8">
              {categories.map((item) => {
                const isActive = activeCategory === item.id;

                return (
                  <li
                    key={item.id}
                    onClick={() => setActiveCategory(item.id)}
                    className={`relative pl-8 cursor-pointer group transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-[3px] border-white ring-1 ring-[#e5e7eb] transition-colors duration-300 ${
                        isActive ? 'bg-[#474747]' : 'bg-[#d9d9d9] group-hover:bg-gray-400'
                      }`}
                    ></span>

                    <h2
                      className={`text-[20px] font-bold leading-tight whitespace-pre-line transition-colors duration-200 ${
                        isActive ? 'text-gray-900' : 'text-gray-600'
                      } mb-2`}
                    >
                      {item.title}
                    </h2>

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
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-700">
                {categories.find((c) => c.id === activeCategory)?.title.replace('\n', ' ')} 목록
              </h2>
              <p className="text-[16px] text-gray-500">
                탐지된 기사{' '}
                <span className="text-[28px] text-gray-800 font-bold ml-1">
                  {filteredArticles.length}건
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-10">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-10 last:border-0 last:pb-0 animate-fade-in"
                  >
                    <div className="flex-shrink-0 relative overflow-hidden rounded group">
                      <img
                        src={article.imgUrl}
                        alt="기사 썸네일"
                        className="w-full md:w-[240px] h-[160px] object-cover shadow-sm transition-all duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col justify-start">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[13px] text-gray-500">
                          {article.source} | 최근 업데이트: {article.updateTime}
                        </p>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight hover:text-blue-600 cursor-pointer transition-colors">
                        {article.title}
                      </h3>
                      {/* 변경된 부분: line-clamp-3 추가 */}
                      <p className="text-[15px] text-gray-600 leading-relaxed text-justify line-clamp-3">
                        <span className="font-semibold text-gray-800 mr-1">AI 요약:</span>
                        {article.summary}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <p className="text-lg">해당 카테고리에 탐지된 기사가 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
