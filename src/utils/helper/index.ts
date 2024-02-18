export function convertBDTimeToUTC(date: Date): Date {
  return new Date(new Date(date).getTime() - 6 * 60 * 60 * 1000);
}
