import type { BiasIndex } from '@/data/EventSummaryData';

const BiasInfo = ({ progressive, neutral, conservative }: BiasIndex) => {
  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">보도 언론사 편향 지수</p>
      <div className="p-8">
        <div className="text-xs flex justify-between">
          <p>진보</p>
          <p>중도</p>
          <p>보수</p>
        </div>
        <div className="flex justify-between h-3 rounded-xl overflow-hidden mt-2 mb-6">
          <p style={{ width: `${progressive.value}%` }} className="bg-blue-600"></p>
          <p style={{ width: `${neutral.value}%` }} className="bg-purple-600"></p>
          <p style={{ width: `${conservative.value}%` }} className="bg-red-600"></p>
        </div>
        <div className="text-xs flex justify-center gap-6 pb-6">
          <p>
            <span className="text-blue-600">●</span>
            {progressive.value}%
          </p>
          <p>
            <span className="text-purple-600">●</span>
            {neutral.value}%
          </p>
          <p>
            <span className="text-red-600">●</span>
            {conservative.value}%
          </p>
        </div>
      </div>
    </section>
  );
};

export default BiasInfo;
