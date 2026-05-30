export const getElapsedTime = (articleTime: string) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');

  const current = `${year}-${month}-${date}T${hours}`;
  const elapsedTime = articleTime.slice(0, 10);

  if (current.slice(0, 10) === elapsedTime) {
    const h = Number(current.slice(11, 13)) - Number(articleTime.slice(11, 13));

    return h === 0 ? '방금 전' : `${h}시간 전`;
  }

  return elapsedTime;
};
