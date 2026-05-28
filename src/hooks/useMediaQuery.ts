import { useEffect, useState } from 'react';

// 호출 예시: const isDesktop = useMediaQuery('(min-width: 768px)') ==> query = '(min-width: 768px)'
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // MediaQueryList(브라우저 내장 객체) 반환: 미디어쿼리 상태 관찰자
    const media = window.matchMedia(query);

    // MediaQueryList의 matches 프로퍼티: 현재 시점에 미디어쿼리 조건을 만족하는가(boolean)
    // 2. 현재 상태가 맞는지 아닌지 초기값 세팅
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
