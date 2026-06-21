import useClickOutside from '@/hooks/useClickOutside';
import type { EventSummary } from '@/types/eventSummary';
import { useCallback, useRef, useState } from 'react';

const BiasInfo = ({ event }: { event: EventSummary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bias, setBias] = useState<'left' | 'mid' | 'right' | null>(null);

  const total: number = event.left_count + event.mid_count + event.right_count;

  const left: number =
    event.left_count && total ? Math.ceil((event.left_count / total) * 1000) / 10 : 0;
  const mid: number =
    event.mid_count && total ? Math.ceil((event.mid_count / total) * 1000) / 10 : 0;
  const right: number =
    event.right_count && total ? Math.ceil((event.right_count / total) * 1000) / 10 : 0;

  function handlePublishersModal(e: React.MouseEvent, newBias: 'left' | 'mid' | 'right') {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    console.log(bias, newBias);

    if (bias === newBias) {
      setIsOpen(false);
      setBias(null);
      return;
    }

    setIsOpen(true);
    setBias(newBias);
  }

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setBias(null);
  }, []);

  const PublishersModalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(PublishersModalRef, closeModal);

  return (
    <section className="w-full">
      <p className="border-y border-gray47 py-3 text-center">보도 언론사 편향 지수</p>
      <div className="p-8">
        <div className="text-xs flex justify-between">
          <p>진보</p>
          <p>중도</p>
          <p>보수</p>
        </div>
        <div ref={PublishersModalRef} className="relative">
          <div className="flex justify-between h-3 rounded-xl overflow-hidden mt-2 mb-6 bg-[#D9D9D9] hover:cursor-pointer">
            <p
              style={{ width: `${left}%` }}
              className="bg-blue-600 rounded-l-full box-border hover:border-2 border-blue-700"
              onClick={(e) => handlePublishersModal(e, 'left')}
            ></p>
            <p
              style={{ width: `${mid}%` }}
              className={`bg-purple-600 box-border hover:border-2 border-purple-700 ${left === 0 ? 'rounded-l-full' : ''} ${right === 0 ? 'rounded-r-full' : ''}`}
              onClick={(e) => handlePublishersModal(e, 'mid')}
            ></p>
            <p
              style={{ width: `${right}%` }}
              className="bg-red-600 rounded-r-full box-border hover:border-2 border-red-700"
              onClick={(e) => handlePublishersModal(e, 'right')}
            ></p>
          </div>

          {isOpen && (
            <div
              className={`box-border text-xs absolute top-5 border-2 bg-white w-full p-3 rounded-xl flex flex-wrap gap-y-5 gap-x-2 z-50
                ${bias === 'right' ? 'border-red-600' : bias === 'mid' ? 'border-purple-600' : 'border-blue-600'}`}
            >
              {bias &&
                event.publishers[bias]?.map((publishers) => (
                  <div key={publishers} className="flex flex-col items-center">
                    {/* <p className="bg-gray-400 w-9 h-9 rounded-full mb-1"></p> */}
                    <p className="bg-slate-200 py-1 px-2 rounded-full">{publishers}</p>
                  </div>
                ))}
            </div>
          )}

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
      </div>
    </section>
  );
};

export default BiasInfo;
