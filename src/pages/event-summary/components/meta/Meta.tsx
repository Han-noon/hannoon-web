const Meta = () => {
  return (
    <>
      {/* 상단 */}
      <div className="flex justify-between items-center border-b-4 border-gray47 pb-1">
        <p className="text-base w-28">사건요약</p>
        <p className="text-xl">정치</p>
        <button className="text-base">실시간 알림 받기</button>
      </div>

      {/* 하단 */}
      <div className="h-32 flex justify-between border-y-2 border-gray47 mt-2">
        <div className="w-72 border-r-2 border-gray47 flex items-center pl-7">
          <div className="w-11 h-11 rounded-full bg-slate-500"></div>
          <div className="ml-4">
            <p className="text-xs text-gray-700">최초 보도</p>
            <p className="text-base">2024년 5월 24일</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p>[의료개혁]</p>
          <h1 className="text-2xl font-bold pb-4 mt-1">정부, 의대 정원 증원 발표</h1>
        </div>
        <div className="w-72 border-l-2 border-gray47 flex items-center justify-end pr-7 gap-10">
          <div className="text-right">
            <p className="text-xs text-gray-700">최근 업데이트</p>
            <p className="text-base">2024년 5월 30일</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-700">분석 기사 수</p>
            <p className="text-base">143개</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meta;
