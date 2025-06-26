export const dateFormat = 'dd.MM.yyyy HH:mm';
export const dateFormatYMD = 'dd.MM.yyyy';
export function getFormatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
