import type { AbusInfo } from '@/data/EventSummaryData';
import ShortcutButton from '@/components/ShortcutButton';
import { CircularProgressChart } from '@/pages/event-summary/components/CircularProgressChart';

const AbusingInfo = ({ total, abusing }: AbusInfo) => {
  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">어뷰징 기사</p>
      <div className="flex flex-col items-center mt-5">
        <p className="text-sm">
          총 {total}건의 기사에서 {abusing}건의 어뷰징 기사가 탐지되었습다.
        </p>
        <div className="w-40 m-5 relative">
          <CircularProgressChart total={total} abusing={abusing} />
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
            {abusing}개
          </p>
        </div>
      </div>
      <ShortcutButton path="/abusing" name="관련 어뷰징 기사 보기" />
    </section>
  );
};

export default AbusingInfo;
