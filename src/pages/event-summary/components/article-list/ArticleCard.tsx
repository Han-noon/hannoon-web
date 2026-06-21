import type { Article } from '@/types/eventSummary';
import { getElapsedTime } from '@/util/getElapsedTime';

const ArticleCard = ({ article }: { article: Article }) => {
  // 시간 몇 시간 전.. 요고 해야함

  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col md:flex-row bg-white p-5 border border-[#cbcbcb] mb-4 rounded-md hover:cursor-pointer hover:bg-[#f1f1f1]">
        <div className="hidden md:block w-48 h-28">
          {article.article_image_url && (
            <div className="w-[192px] h-[115px]">
              <img className="w-full h-full" src={article.article_image_url} />
            </div>
          )}
          {!article.article_image_url && <div className="w-full h-full bg-[#e4e4e4]"></div>}
        </div>
        <div className="flex-1 md:ml-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-1 text-sm">
            <p className="text-gray-400 order-2 md:order-1">
              {article.publisher} • {getElapsedTime(article.published_at)}
            </p>
            <p
              className={`w-fit mb-2 rounded-full text-white px-4 pt-[1px] text-xs md:order-2
              ${article.bias_type === '진보' ? 'bg-blue-500' : article.bias_type === '보수' ? 'bg-red-500' : 'bg-purple-500'}
            `}
            >
              {article.bias_type}
            </p>
          </div>
          <h3 className="text-base md:text-lg font-bold line-clamp-1">{article.title}</h3>
          <p className="line-clamp-2 text-gray-600 text-sm leading-relaxed">{article.summary}</p>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
