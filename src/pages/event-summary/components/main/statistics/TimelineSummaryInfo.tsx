import ShortcutButton from '@/components/ShortcutButton';
import type { TimelineInfo } from '@/data/EventSummaryData';
import { Link } from 'react-router-dom';

const TimelineSummaryInfo = ({ topic, timeline_summary }: TimelineInfo) => {
  const textStyle = (title: string) => `
  text-gray-600 truncate 
  ${title === '정보없음' ? '' : 'underline underline-offset-4 hover:text-black'}
`;

  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">타임라인</p>
      <div className="my-8 text-center">
        <p className="mb-6">소속 토픽: {topic}</p>
        <div className="flex h-36 text-sm relative px-2">
          <p className="absolute left-[170px] top-[13px] text-xs text-gray-400">●</p>
          <p className="absolute left-[170px] top-[63px] text-xs">●</p>
          <p className="absolute left-[170px] bottom-[13px] text-xs text-gray-400">●</p>
          <div className="w-1/2 h-full border-r-2 border-gray-400 flex flex-col justify-between py-3 pr-4 text-right">
            <Link to="#">
              <p className={textStyle(timeline_summary[0].title)}>{timeline_summary[0].title}</p>
            </Link>
            <Link to="#">
              <p className={textStyle(timeline_summary[2].title)}>{timeline_summary[2].title}</p>
            </Link>
          </div>
          <div className="w-1/2 h-full flex items-center pl-4">
            <p className="truncate">{timeline_summary[1].title}</p>
          </div>
        </div>
      </div>
      <ShortcutButton path="/timeline" name="전체 타임라인 보기" />
    </section>
  );
};

export default TimelineSummaryInfo;
