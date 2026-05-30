import { getArticlesByEvent } from '@/api/event/getArticlesByEvent';
import Pagination from '@/components/Pagination';
import ArticleCard from '@/pages/event-summary/components/article-list/ArticleCard';
import BiasFilteringBtn from '@/pages/event-summary/components/article-list/BiasFilteringBtn';
import TimeFilteringBtn from '@/pages/event-summary/components/article-list/TimeFilteringBtn';
import type { Articles } from '@/types/eventSummary';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ArticleList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesData, setArticlesData] = useState<Articles | null>(null);
  const [biasFilter, setBiasFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('asc');
  const { id } = useParams();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesByEvent({
          p_bias_type: biasFilter,
          p_event_id: Number(id) || 1,
          p_order: timeFilter,
          p_page: currentPage,
        });
        setArticlesData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, [currentPage, biasFilter, timeFilter]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-0">요약에 사용된 기사 리스트</h1>
        <div className="text-sm flex gap-2">
          <BiasFilteringBtn biasFilter={biasFilter} setBiasFilter={setBiasFilter} />
          <TimeFilteringBtn timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
        </div>
      </div>
      {articlesData?.articles.map((article) => (
        <ArticleCard key={article.link} article={article} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={articlesData?.total_pages || 1}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ArticleList;
