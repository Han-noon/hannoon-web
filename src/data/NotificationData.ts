export interface Notification {
  id: number;
  topic: string;
  isRead: boolean;
}

export const notificationDummyData: Notification[] = [
  {
    id: 1,
    topic: '산불 발생',
    isRead: false,
  },
  {
    id: 2,
    topic: '지하철 운행 지연',
    isRead: false,
  },
  {
    id: 3,
    topic: '태풍 북상',
    isRead: true,
  },
  {
    id: 4,
    topic: '대규모 정전',
    isRead: true,
  },
  {
    id: 5,
    topic: '주가 급락',
    isRead: false,
  },
  {
    id: 6,
    topic: '폭우 피해',
    isRead: true,
  },
];
