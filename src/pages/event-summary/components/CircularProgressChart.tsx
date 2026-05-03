import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import type { AbusInfo } from '@/data/EventSummaryData';

const PATH_COLOR = '#7859B4'; // 차트에 표시될 선
const TRAIL_COLOR = '#D9D9D9'; // 차트의 배경선

export const CircularProgressChart = ({ total, abusing }: AbusInfo) => {
  return (
    <CircularProgressbar
      value={(abusing / total) * 100}
      className="progressbar"
      strokeWidth={10}
      styles={buildStyles({
        pathColor: PATH_COLOR,
        trailColor: TRAIL_COLOR,
        textColor: '#2B2D36',
      })}
    />
  );
};
