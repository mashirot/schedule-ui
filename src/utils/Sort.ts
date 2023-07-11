const week: Map<string, number> = new Map([["Monday", 1], ["Tuesday", 2], ["Wednesday", 3], ["Thursday", 4], ["Friday", 5]]);

interface CourseVo {
  courseId: number,
  dayOfWeek: string,
  time: string,
  name: string,
  place: string,
  teacher: string,
  week: string,
  oddWeek: string,
  credit: string,
}

export function sortByStartWeek(pre: CourseVo, next: CourseVo): number {
  const startWeek1 = parseInt(pre.week.split(" - ")[0]);
  const startWeek2 = parseInt(next.week.split(" - ")[0]);
  const subWeek = startWeek1 - startWeek2;
  if (subWeek === 0) {
    return subWeek;
  }
  return sortByDayOfWeek(pre, next);
}

export function sortByStartTime(pre: CourseVo, next: CourseVo): number {
  const startTime1 = parseInt(pre.time.split(" - ")[0].replace(":", ""));
  const startTime2 = parseInt(next.time.split(" - ")[0].replace(":", ""));
  const subTime = startTime1 - startTime2;
  if (subTime !== 0) {
    return subTime;
  }
  const date1 = pre.dayOfWeek;
  const date2 = next.dayOfWeek;
  const date2num1 = (week.get(date1) as number);
  const date2num2 = (week.get(date2) as number);
  return date2num1 - date2num2;
}

export function sortByDayOfWeek(pre: CourseVo, next: CourseVo): number {
  const date1 = pre.dayOfWeek;
  const date2 = next.dayOfWeek;
  const subDayOfWeek = (week.get(date1) as number) - (week.get(date2) as number);
  if (subDayOfWeek !== 0) {
    return subDayOfWeek;
  }
  const startTime1 = parseInt(pre.time.split(" - ")[0].replace(":", ""));
  const startTime2 = parseInt(next.time.split(" - ")[0].replace(":", ""));
  return startTime1 - startTime2;
}
