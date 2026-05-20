import type { EventSummary } from '@/types/eventSummary';

const BiasInfo = ({ event }: { event: EventSummary }) => {
  const total: number = event.left_count + event.mid_count + event.right_count;

  const left: number =
    event.left_count && total ? Math.ceil((event.left_count / total) * 1000) / 10 : 0;
  const mid: number =
    event.mid_count && total ? Math.ceil((event.mid_count / total) * 1000) / 10 : 0;
  const right: number =
    event.right_count && total ? Math.ceil((event.right_count / total) * 1000) / 10 : 0;

  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">보도 언론사 편향 지수</p>
      <div className="p-8">
        <div className="text-xs flex justify-between">
          <p>진보</p>
          <p>중도</p>
          <p>보수</p>
        </div>
        <div className="flex justify-between h-3 rounded-xl overflow-hidden mt-2 mb-6 bg-[#D9D9D9]">
          <p style={{ width: `${left}%` }} className="bg-blue-600"></p>
          <p style={{ width: `${mid}%` }} className="bg-purple-600"></p>
          <p style={{ width: `${right}%` }} className="bg-red-600"></p>
        </div>
        <div className="text-xs flex justify-center gap-6 pb-6">
          <p>
            <span className="text-blue-600">●</span>
            {left}%
          </p>
          <p>
            <span className="text-purple-600">●</span>
            {mid}%
          </p>
          <p>
            <span className="text-red-600">●</span>
            {right}%
          </p>
        </div>
      </div>
    </section>
  );
};

export default BiasInfo;
