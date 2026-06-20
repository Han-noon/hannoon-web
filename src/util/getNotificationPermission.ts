export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
};

// 반환값 형태
// 'default'
// 'granted'
// 'denied'
// 'unsupported'
